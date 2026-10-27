# Guna Bala D — AI/ML Engineer portfolio

A portfolio site with five project case studies, a professional-work section and custom SVG system diagrams. It's built with React 18, TypeScript and Vite, with no UI or animation libraries.

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check, production build to `dist/`, then prerender one HTML file per case-study route |
| `npm run preview` | Serve the production build at http://localhost:4173 |
| `npm run lint` | ESLint (TypeScript + React hooks rules) |
| `npm run typecheck` | `tsc -b` |
| `npm run check` | Lint, then the full build |

## Deploy

`dist/` is a static site. It works on any static host:

- **Vercel**: import the repo. Framework preset: Vite; output directory: `dist`. `vercel.json` already contains the SPA rewrite.
- **Netlify**: build command `npm run build`, publish directory `dist`. `public/_redirects` handles client routes.
- **GitHub Pages / other hosts**: each case study has its own prerendered `dist/projects/<slug>/index.html`, and `dist/404.html` falls back to the app.

After deploying, change `og:image` in `index.html` to the absolute URL (`https://<your-domain>/og-image.png`). Some social networks ignore relative image URLs.

## Where the content lives

All facts are in two typed data files. Edit these rather than the components:

- `src/data/profile.ts`: contact links, experience, education, certifications, skills. Source: `Guna_Bala_Resume.pdf`.
- `src/data/projects.ts`: the five case studies. Source: each GitHub repository's README, fetched in October 2026. Metrics keep the qualifiers the READMEs give them (dataset, model, hardware).
- `src/components/diagram/specs.ts`: node/edge layouts for every architecture diagram and card illustration.

## Structure

```
src/
  components/        Nav, Footer, ProjectCard, Reveal, CopyEmail, HeroGraph, Icons, ScrollManager
    diagram/         Diagram engine (SVG nodes + routed edges), ArchitectureFigure, specs, card art
  sections/          Homepage sections: Hero, Projects, Experience, Skills, About, Contact
  pages/             Home, ProjectPage (case study), NotFound
  hooks/             useInView, usePageMeta
  styles/            tokens.css (design tokens), global, layout, diagram, home, project
scripts/
  prerender-routes.mjs   Writes per-route HTML with the right <title>/description after build
public/              Resume PDF, favicon, social image, Document Risk Engine screenshots
```

## Design notes

- **Tokens.** Colours, type scale, spacing, radii, shadows and motion timings live in `src/styles/tokens.css`. The palette is a deep space-black base with a violet → cyan → mint "signal" gradient, glass surfaces and soft glows. Headings use Space Grotesk, body text Inter, and labels JetBrains Mono. Diagram node types (LLM, model, code, store, human) each get a colour and always carry a text tag, so meaning never depends on colour alone.
- **Signature visuals.** `LatentSpace.tsx` is a canvas 3D embedding space whose query point retrieves its top-k neighbours. `Skills.tsx` has an interactive capability graph (projects → capability hubs → skills). `Timeline.tsx` draws the career timeline, and `Metrics.tsx` provides the count-ups and radial gauges for resume metrics. The latent space is an illustration, not data. Every number on the site comes from the resume or a README.
- **Diagrams.** Architecture diagrams are generated from declarative specs (`Diagram.tsx`) with rounded orthogonal edge routing. Below 760px each one switches to a numbered step list, so it stays readable on phones.
- **Motion.** The page uses a short hero entrance, reveal-on-scroll, pulses along a diagram's primary path (only while it is on screen), and the hero's retrieval animation. All of it is CSS transform/opacity and is disabled under `prefers-reduced-motion`.
- **Accessibility.** The site has semantic landmarks, a skip link, visible focus rings, and keyboard-operable navigation (the mobile menu closes on Escape). Diagrams have a title and description, the comparison table uses real `<th>` scopes, and copying the email address is announced through a live region.
