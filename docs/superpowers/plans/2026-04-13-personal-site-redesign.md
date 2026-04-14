# Personal Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal site with an interactive ecosystem graph, using vanilla HTML/CSS/JS and Vite.

**Architecture:** Single `index.html` with all content as semantic HTML. CSS handles layout, theming, animations, and responsive design. Vanilla JS handles graph interaction (SVG edge rendering, node selection, entrance animations, scroll tracking). Vite provides dev server and static build output. The existing mockup (ecosystem-v8.html) is the primary reference — this plan cleans it up, fixes known bugs, adds SEO, and structures it for production.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Vite (dev/build only), Google Fonts

**Spec:** `docs/superpowers/specs/2026-04-13-personal-site-redesign-design.md`

**Reference mockup:** `.superpowers/brainstorm/64634-1776120285/content/ecosystem-v8.html`

---

### Task 1: Scaffold — Vite, project structure, delete Next.js

**Files:**
- Create: `vite.config.js`
- Rewrite: `package.json`
- Create: `index.html` (minimal shell)
- Create: `css/styles.css` (variables + grid background only)
- Create: `js/main.js` (empty placeholder)
- Create: `public/llms.txt`
- Delete: `app/` directory, `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `next-env.d.ts`

- [ ] **Step 1: Delete the Next.js scaffold**

```bash
cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2/.worktrees/personal-site-redesign
rm -rf app/ tailwind.config.ts next.config.ts postcss.config.mjs tsconfig.json eslint.config.mjs
rm -f next-env.d.ts
rm -f *-full.png
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 2: Rewrite package.json**

```json
{
  "name": "justinbeaudry-com",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6"
  }
}
```

- [ ] **Step 3: Create vite.config.js**

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
});
```

- [ ] **Step 4: Create minimal index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Justin Beaudry</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <p style="text-align:center;padding:4rem;color:#888;">Site under construction</p>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create css/styles.css with variables and grid**

```css
/* css/styles.css */

/* ===== Variables ===== */
:root {
  --bg: #0a0a0a;
  --accent: #c8a455;
  --accent-dim: rgba(200, 164, 85, 0.15);
  --accent-glow: rgba(200, 164, 85, 0.06);
  --text-bright: #fff;
  --text-primary: #c8c8c8;
  --text-secondary: #999;
  --text-muted: #888;
  --border: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.25);
  --edge-base: rgba(255, 255, 255, 0.1);
  --edge-cross: rgba(255, 255, 255, 0.06);

  --font-sans: 'Outfit', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

/* ===== Reset ===== */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

/* ===== Grid Background ===== */
.grid-bg {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.page { position: relative; z-index: 1; }
```

- [ ] **Step 6: Create empty js/main.js**

```js
// js/main.js
// Graph interaction, animations, scroll tracking
// Will be populated in Task 4
```

- [ ] **Step 7: Create public/llms.txt**

```
# Justin Beaudry

> Engineering leader, community builder, Toledo OH

## Current Roles
- Director of Engineering, Actual Reality Technologies
- Founder, Toledo Codes
- Director of Technology & Board Treasurer, EmpoweredAI
- Regional Manager — Midwest, AI Collective

## About
Software engineer with 15+ years of experience. Spent a decade building at startups in San Francisco and Austin (CreativeLive, Instawork, United Airlines, Vida Health). Studied philosophy at the University of Toledo. Made a deliberate move home to bridge Silicon Valley scale and Midwest talent.

## Research
- Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations (arXiv, 2025) — https://arxiv.org/abs/2508.21164

## Contact
- LinkedIn: https://linkedin.com/in/justinbeaudry
- GitHub: https://github.com/JustinBeaudry
- Consulting: Beaudry Software & Systems (https://beaudry.dev)
```

- [ ] **Step 8: Install Vite and verify dev server**

```bash
cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2/.worktrees/personal-site-redesign
rm -rf node_modules bun.lock
bun add -d vite
bun run dev
```

Expected: Vite dev server at http://localhost:5173, shows "Site under construction" on dark background with grid.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold — Vite, vanilla HTML/CSS/JS, delete Next.js"
```

---

### Task 2: Full HTML Structure + CSS

Build the complete page structure in `index.html` and all styles in `css/styles.css`. This is the largest task — it produces the entire visual design without JS interaction.

**Files:**
- Rewrite: `index.html`
- Rewrite: `css/styles.css`

- [ ] **Step 1: Write the complete index.html**

The HTML should include:
- `<head>`: charset, viewport, title, meta description, OG tags, Twitter cards, canonical, Google Fonts links, JSON-LD script, stylesheet link, favicon links
- Skip-to-content link
- Grid background div
- `<nav>`: sticky, name left, HOME/WORK/CONTACT links right
- `<main id="main-content">`
  - `<section id="about">`: hero (h1, sub div, body p), personality anchor (tagline + aside)
  - `<section id="work">`: section label, graph container with 5 node divs (absolute positioned, each with name/role/stat), detail panel div (pre-populated with Justin's detail as default), SVG element for edges (empty, JS fills)
  - `<section id="contact">`: location, three action links
- `<footer>`: consultancy mention, copyright

All nodes must have: `role="button"`, `tabindex="0"`, `aria-label`, `aria-pressed`, `data-node` attribute.
Detail panel must have `aria-live="polite"`.
Justin's detail content is the default visible content (progressive enhancement — works without JS).

Reference the mockup (`ecosystem-v8.html`) for the exact HTML structure, but use the spec-corrected copy (no unverified stats, no "first engineering hire", corrected EmpoweredAI stat line).

Node positions from spec:
- Justin (center): `left: 47%; top: 48%`
- Actual Reality: `left: 32%; top: 8%`
- Toledo Codes: `left: 87%; top: 34%`
- EmpoweredAI: `left: 10%; top: 66%`
- AI Collective: `left: 72%; top: 88%`

- [ ] **Step 2: Write the complete css/styles.css**

Include all styles from the mockup, organized into sections:
1. Variables (already done in Task 1)
2. Reset
3. Grid background
4. Skip link
5. Navigation (sticky, backdrop blur, font-mono)
6. Hero (centered, max-width 700px, text sizes)
7. Personality anchor (accent tagline, italic aside)
8. Ecosystem section (max-width 960px)
9. Graph container (relative, height 400px)
10. Nodes (absolute, translate-50%, center vs peripheral sizes)
11. Node states (default, hover, selected — with accent border/glow)
12. Detail panel (max-width 640px, border-top)
13. Research inline
14. Contact (centered, action links with hover lift)
15. Footer (muted consultancy, copyright)
16. Focus-visible styles (accent outline on all interactive elements)
17. Animations (@keyframes: fadeUp, slideDown, drawLine, breathe)
18. `prefers-reduced-motion` media query (disable all animations)
19. Responsive: tablet verification (768-1024px)
20. Responsive: mobile (<768px) — graph becomes 2x2 grid, SVG hidden, text wraps

All contrast values must meet WCAG AA:
- `--text-muted` (#888) on `--bg` (#0a0a0a) = 5.3:1 ✓
- Footer text minimum #777

Progressive enhancement: nodes default to `opacity: 1`. The `.js-loaded` class on body sets `.node { opacity: 0; }` for entrance animation.

- [ ] **Step 3: Verify the page renders correctly without JS**

Open http://localhost:5173 — should show the full page with all content visible (no animations, no edges, but all nodes and text readable).

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: complete HTML structure and CSS — all sections, responsive, accessible"
```

---

### Task 3: Graph Interaction — SVG Edges + Node Selection

All JavaScript for the ecosystem graph: edge rendering, node click handling, detail panel updates.

**Files:**
- Write: `js/graph.js`
- Modify: `js/main.js` (import graph module)

- [ ] **Step 1: Write js/graph.js**

This module handles:

**Edge rendering:**
- `computeEdges()`: reads node positions via `getBoundingClientRect()` relative to graph container, computes quadratic bezier control points (curveFactor 0.22 for hub, 0.15 for cross), generates SVG `<path>` elements with `d` attribute, sets `stroke-dasharray` and `stroke-dashoffset` via `getTotalLength()`
- Hub edges: solid stroke, `var(--edge-base)`
- Cross edges: dashed stroke (`stroke-dasharray: 4 4`), `var(--edge-cross)`

**Node selection:**
- Click handler on all `[data-node]` elements
- Keyboard handler (Enter/Space)
- Updates `aria-pressed` on all nodes
- Highlights selected node (add `.selected` class)
- Updates edge classes: connected edges get `.active`, unconnected get `.dimmed` (when non-Justin selected)
- When Justin selected: hub edges `.active`, cross edges at base opacity, no dimming
- Updates detail panel content (swap innerHTML with fade animation via CSS class)
- On mobile (<768px): scrolls detail panel into view after selection

**Detail panel data:**
- Object mapping nodeId → { name, role, description, link?, research? }
- `updateDetail(nodeId)`: builds HTML from data, sets innerHTML on detail panel, triggers fade animation
- Use the spec's draft copy for all descriptions

**Resize handling:**
- `ResizeObserver` on graph container, debounced 150ms
- Recomputes edge positions on resize

**Edge animation state machine:**
- Managed via a `phase` variable: `'idle' | 'drawing' | 'breathing' | 'interactive'`
- Drawing: edges have `stroke-dashoffset` animated to 0 via CSS `animation: drawLine`
- After 2.2s timeout: remove drawing styles, add `.breathing` class to inactive edges
- On any node click: set phase to `'interactive'`, remove breathing, redraw with highlight/dim classes
- Breathing never resumes after user interaction

**Export:** `initGraph()` function called from main.js

- [ ] **Step 2: Update js/main.js to import graph**

```js
// js/main.js
import { initGraph } from './graph.js';

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
  initGraph();
});
```

- [ ] **Step 3: Verify graph interaction works**

Run: `bun run dev`
Expected:
- Click nodes → detail panel updates, edges highlight/dim
- Justin selected by default on load
- Edges render as curved SVG paths
- Resize browser → edges reposition correctly
- Tab through nodes → focus ring visible, Enter/Space selects

- [ ] **Step 4: Commit**

```bash
git add js/graph.js js/main.js
git commit -m "feat: graph interaction — SVG edges, node selection, detail panel"
```

---

### Task 4: Entrance Animations + Scroll Tracking

Hero entrance animation, ecosystem scroll-triggered entrance, and nav active section tracking.

**Files:**
- Create: `js/animations.js`
- Modify: `js/main.js`
- Modify: `css/styles.css` (add animation classes if not already present)

- [ ] **Step 1: Write js/animations.js**

**Hero entrance:**
- On DOMContentLoaded, add staggered animation classes to hero elements
- Nav: add `.animate-slide-down` class
- H1: add `.animate-fade-up` with `animation-delay: 0.2s`
- Sub: `.animate-fade-up` delay 0.4s
- Body: `.animate-fade-up` delay 0.6s
- Anchor: `.animate-fade-up` delay 0.8s
- Check `prefers-reduced-motion` — if true, add all classes immediately with `animation-duration: 0s`

**Ecosystem scroll entrance:**
- IntersectionObserver on `#work` section (threshold 0.12, once)
- When visible: trigger node entrance (add `.animate-node-in` class with staggered delays: 0ms, 150ms, 280ms, 410ms, 540ms)
- After nodes enter: trigger edge drawing animation (call graph module's `drawEdges()` with `animate: true`)

**Nav scroll tracking:**
- IntersectionObserver on each `section[id]` with `rootMargin: '-80px 0px -60% 0px'`
- Update `.active` class on nav links as sections enter/leave viewport

**Smooth scroll:**
- Click handler on nav `<a>` elements
- `preventDefault()`, `scrollIntoView({ behavior: 'smooth', block: 'start' })`

**Export:** `initAnimations()` function

- [ ] **Step 2: Update js/main.js**

```js
// js/main.js
import { initGraph } from './graph.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
  initAnimations();
  initGraph();
});
```

- [ ] **Step 3: Verify animations**

Run: `bun run dev`
Expected:
- Page load: hero fades in staggered over ~1.3s
- Scroll to ecosystem: nodes appear one by one, edges draw with curved paths, then breathe
- Click a node: breathing stops, edges highlight
- Nav: active state tracks scroll position
- Click nav link: smooth scrolls to section
- With `prefers-reduced-motion` enabled in OS: all animations are instant

- [ ] **Step 4: Commit**

```bash
git add js/animations.js js/main.js css/styles.css
git commit -m "feat: entrance animations, scroll tracking, smooth scroll nav"
```

---

### Task 5: Build Verification + Cleanup

Final verification that the static build works correctly.

**Files:**
- Possibly modify: any file with issues found during verification

- [ ] **Step 1: Run production build**

```bash
cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2/.worktrees/personal-site-redesign
bun run build
```

Expected: Build succeeds, outputs to `dist/`.

- [ ] **Step 2: Preview production build**

```bash
bun run preview
```

Expected: Full site works at preview URL. All interactions work. No console errors.

- [ ] **Step 3: Verify llms.txt**

Navigate to http://localhost:4173/llms.txt
Expected: Plain text content renders correctly.

- [ ] **Step 4: Verify accessibility basics**

- Tab through entire page — all interactive elements reachable
- Focus rings visible on all interactive elements
- Screen reader: `aria-live` detail panel announces changes
- Skip-to-content link works on Tab from top of page

- [ ] **Step 5: Verify responsive**

- Resize to 375px: graph becomes 2x2 grid, no SVG edges, text wraps, touch targets ≥44px
- Resize to 900px: verify no node clipping at 87% left position
- Resize to 1440px+: content centered, no issues

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: verify production build, cleanup"
```

---

## Post-Implementation Checklist

These items require Justin's input:

- [ ] **Finalize all DRAFT copy** — rewrite hero body, node detail descriptions in your own voice
- [ ] **Provide missing URLs** — Cal.com scheduling link, AI Collective link, Actual Reality link
- [ ] **Verify toledo.codes and beaudry.dev** resolve correctly
- [ ] **Verify Actual Reality founding date** (2023 vs. when Justin joined Nov 2024)
- [ ] **Verify EmpoweredAI stats** with the organization before adding any beyond the $40K grant
- [ ] **Create og:image** — dark background, name, tagline, 1200x630px, save as `public/og.png`
- [ ] **Create favicon** — minimal mark or "JB" initials, save as `public/favicon.ico` + apple-touch-icon
