# Guna Bala D — AI/ML Engineer portfolio

A portfolio site with five project case studies, a professional-work section and custom SVG system diagrams. It's built with React 18, TypeScript and Vite, with GSAP and Lenis for scroll motion and Three.js for the hero. There's no UI component library.

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

- **Tokens.** Colours, type scale, spacing and motion timings live in `src/styles/tokens.css`, with light and dark themes (it follows the system until the visitor picks one in the nav). The look is a ruled drafting table: a framed column, hairline grids, crosshair ticks and square corners, with a single blue accent. Headlines use Archivo Expanded with Instrument Serif italic accent words, body text Inter, and labels Geist Mono. Diagram node types (LLM, model, code, store, human) each get a colour and always carry a text tag, so meaning never depends on colour alone.
- **Signature visuals.** `galaxy/Galaxy.tsx` is a Three.js spiral conveyor of clickable work samples behind the hero, loaded lazily; its artwork is drawn in `galaxy/cards.ts`, and the charts there are illustrations, not data. `Ruler.tsx` is the right-edge scroll ruler with a rolling percentage, and `SectionIndex.tsx` flies each section's name up the ruler into its sticky bar. `Timeline.tsx` draws the career timeline, and `Metrics.tsx` provides the count-ups and radial gauges for resume metrics. Every number on the site comes from the resume or a README.
- **Diagrams.** Architecture diagrams are generated from declarative specs (`Diagram.tsx`) with rounded orthogonal edge routing. Below 760px each one switches to a numbered step list, so it stays readable on phones.
- **Motion.** Lenis smooths the wheel on GSAP's ticker. `motion/useChoreo.ts` drives scroll choreography from data attributes: `data-choreo` draws a section's rule, bar and ticks, `data-reveal` blurs content up once, and `data-reveal-group` staggers a row left to right. The hero plays a letter-by-letter entrance once per page load, and pulses run along a diagram's primary path only while it is on screen. Under `prefers-reduced-motion` smooth scrolling, the entrance, reveals and the flying index are all off, and the hero spiral renders one still frame.
- **Accessibility.** The site has semantic landmarks, a skip link, visible focus rings, and keyboard-operable navigation (the mobile menu closes on Escape). Diagrams have a title and description, the comparison table uses real `<th>` scopes, and copying the email address is announced through a live region.
