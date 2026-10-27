// Writes a static HTML entry for every case-study route so direct loads work on any static host
// and each page ships its own <title> and description before JavaScript runs.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const source = await readFile(join(root, 'src/data/projects.ts'), 'utf8');
const template = await readFile(join(dist, 'index.html'), 'utf8');

const unquote = (s) => s.replace(/\\'/g, "'").replace(/\\u2019/g, '’');
const field = (block, name) => {
  const m = block.match(new RegExp(`\\n    ${name}: '((?:[^'\\\\]|\\\\.)*)'`));
  return m ? unquote(m[1]) : undefined;
};
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const blocks = source.split(/\n {2}\{\n {4}slug: /).slice(1).map((b) => `\n    slug: ${b}`);
const routes = blocks.map((b) => ({ slug: field(b, 'slug'), name: field(b, 'name'), seo: field(b, 'seo') }));

if (routes.length === 0 || routes.some((r) => !r.slug || !r.name || !r.seo)) {
  console.error('prerender: could not read project slugs/names/seo from src/data/projects.ts');
  process.exit(1);
}

function render(title, description) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`);
}

for (const r of routes) {
  const dir = join(dist, 'projects', r.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), render(`${r.name} — Case study · Guna Bala D`, r.seo));
}

// Fallback for hosts that serve 404.html for unknown paths (e.g. GitHub Pages); the app renders its own 404 view.
await writeFile(join(dist, '404.html'), render('Page not found · Guna Bala D', 'Portfolio of Guna Bala D, AI/ML Engineer.'));

console.log(`prerender: wrote ${routes.length} case-study pages + 404.html`);
