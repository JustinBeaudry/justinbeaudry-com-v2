# Personal Site Redesign — Design Spec

## Overview

Single-page personal site for Justin Beaudry. The centerpiece is an interactive ecosystem graph showing the organizations he's building through in Toledo, OH. Dark theme, warm accent, animated entrance, accessible.

**Reference mockup:** `.superpowers/brainstorm/64634-1776120285/content/ecosystem-v8.html`

**Note:** The mockup (v8) contains outdated copy and unverified stats that were corrected during brainstorming. This spec is authoritative — where the mockup and spec disagree, follow the spec.

## Design Decisions (locked)

### Direction
- **Ecosystem visualization** as the core differentiator — no other dev leader site has this
- **Dark canvas** with subtle grid background
- **Single accent color** (warm gold) used sparingly
- **Progressive depth**: surface (who + what) → middle (ecosystem graph, clickable) → depth (detail panel per node)
- **No email displayed** — contact via Cal.com scheduling link
- **Beaudry Software & Systems** mentioned subtly in footer only

### Typography
- **Display/body:** Outfit — geometric, warm, approachable
- **Mono/structural:** IBM Plex Mono — industrial, clear
- Self-host via `next/font/google` with `display: 'swap'` and `adjustFontFallback: true` to minimize CLS
- Weights used: Outfit 400/500/600/700, IBM Plex Mono 400/700

### Color Palette
```
--bg:             #0a0a0a
--accent:         #c8a455    (warm gold)
--accent-dim:     rgba(200,164,85,0.15)
--accent-glow:    rgba(200,164,85,0.06)
--text-bright:    #ffffff
--text-primary:   #c8c8c8
--text-secondary: #999999
--text-muted:     #888888    (minimum for WCAG AA on --bg)
--border:         rgba(255,255,255,0.1)
--border-hover:   rgba(255,255,255,0.25)
--edge-base:      rgba(255,255,255,0.1)
--edge-cross:     rgba(255,255,255,0.06)
```

All text must meet WCAG AA contrast against `--bg`. Footer text minimum `#777`.

### Grid Background
- Subtle grid overlay at 0.015 opacity, 40px spacing
- Fixed position, non-interactive
- Purely decorative — degrades gracefully on low-contrast displays

## Page Structure

### Navigation (sticky)
- Left: `JUSTIN BEAUDRY` (bold, white)
- Right: `HOME` | `WORK` | `CONTACT`
- Sticky with backdrop blur, semi-transparent background
- Smooth scroll on click, active section tracking via IntersectionObserver (not scroll position)
- Focus-visible styles on all links (accent color outline)

### Section 1: Hero (#about)

**H1 (DRAFT — needs Justin's voice):**
> A decade of startups in San Francisco and Austin.

**Sub:**
> Then a deliberate move home to Toledo.

**Body (DRAFT — needs Justin's voice):**
> Now I lead engineering at an AI consultancy, run a developer community, and serve on the board of a non-profit bringing AI education to Toledo.

**Personality anchor:**
> Studied philosophy. Writes code. Builds communities.
> _Currently thinking about what AI-first and "local tech ecosystem" actually mean._

- Tagline in accent color (gold), 15px, IBM Plex Mono
- Aside in italic, `--text-muted`
- All copy marked DRAFT will be finalized by Justin during implementation

### Section 2: Ecosystem Graph (#work)

**Section label:** `WHAT I'M BUILDING`

#### Graph Layout
- **Container:** max-width 960px, height 400px on desktop
- **Center node** (Justin Beaudry) — substantially larger (padding 28px/36px, name 16px), subtle gold background tint, position: `left: 47%; top: 48%` (slightly off-center for organic feel)
- **4 peripheral nodes** in asymmetric arrangement:
  - Actual Reality: `left: 32%; top: 8%` (top-left, close — day job)
  - Toledo Codes: `left: 87%; top: 34%` (right)
  - EmpoweredAI: `left: 10%; top: 66%` (lower-left)
  - AI Collective: `left: 72%; top: 88%` (bottom-right)
- **Curved edges** (quadratic bezier). Control point calculation:
  ```
  mx = (p1.x + p2.x) / 2
  my = (p1.y + p2.y) / 2
  cx = mx - (p2.y - p1.y) * curveFactor
  cy = my + (p2.x - p1.x) * curveFactor
  ```
  - Hub edges (center ↔ peripheral): curveFactor 0.22
  - Cross edges (peripheral ↔ peripheral): curveFactor 0.15, dashed stroke (`stroke-dasharray: 4 4`), lower opacity
- **Edge dimming**: selecting a non-Justin node dims unconnected edges to `opacity: 0.3`
- **When Justin is selected**: hub edges highlight (gold), cross edges stay at base opacity. Not "all edges active."

#### Node Content
Each peripheral node displays three lines (all visible without clicking):
1. Organization name (IBM Plex Mono, 11px, bold, white)
2. Role (Outfit, 11px, `--text-secondary`)
3. Stat/fact line (IBM Plex Mono, 10px, accent color, full opacity)

**Center node** also displays a stat line: `15+ yrs · 5 orgs · Toledo, OH`

Allow `white-space: normal` (wrapping) on mobile for node names to prevent overflow at 320px.

**Peripheral node stats:**
- Actual Reality: `AI consultancy · founded 2023` _(verify founding date — Justin joined Nov 2024)_
- Toledo Codes: `meetups · civic tech · mentorship`
- EmpoweredAI: `AI education · ages 7-12 · $40K city grant`
- AI Collective: `Regional Mgr · Great Lakes AI Week`

Note: Stats must be verified. Do not include unverified numbers (e.g., "1,650+ learners" is unverified for EmpoweredAI, "70K+ global" is outdated for AI Collective).

**Copy dependency:** Finalize node stat text before locking node positions. Changing stat text changes node dimensions, which shifts edge endpoints.

#### Detail Panel
- Below the graph, max-width 640px
- Auto-populated with Justin's info on load (no empty state)
- Updates on node click with fade-up animation (0.35s)
- `aria-live="polite"` for screen reader announcements
- On mobile, scrolls into view after node selection
- Clicking the already-selected node is a no-op (no toggle/deselect)

#### Node Detail Content (DRAFT — needs Justin's voice)

**Justin Beaudry** `SOFTWARE + HUMANS + COMMUNITY`
> Spent a decade at SF/Austin startups — CreativeLive, Instawork, United Airlines, Vida Health. Studied philosophy at Toledo, not CS. Moved back because the interesting problems aren't all on the coasts.
>
> _PUBLISHED RESEARCH_
> Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations — arXiv · 2025
> _(link to: https://arxiv.org/abs/2508.21164)_

**Actual Reality Technologies** `DIRECTOR OF ENGINEERING`
> Founding engineering leader at an AI consultancy. Building products, internal tools, and the engineering org — consulting, coding, mentoring engineers. Player-coach across the full stack.
>
> _(DRAFT — Justin to refine in his own voice.)_

**Toledo Codes** `FOUNDER`
> A developer community in Northwest Ohio. Regular meetups and a civic tech program where college students build real projects in a simulated startup environment — standups, code reviews, shipping. First project: Batting Cleanup, QR codes for reporting city maintenance issues.
>
> _(link to toledo.codes)_

**EmpoweredAI** `DIRECTOR OF TECHNOLOGY · BOARD TREASURER`
> Non-profit bringing AI education to kids ages 7-12 in Toledo. Backed by a $40K City of Toledo grant. Justin's role: guiding the technology roadmap and providing board oversight.
>
> _(DRAFT — verify any additional stats with EmpoweredAI before publishing)_

**AI Collective** `REGIONAL MANAGER — MIDWEST`
> Expanding AI access across Ohio and the Midwest. Founding partner of the Toledo chapter. On the host committee for Great Lakes AI Week and Columbus AI Week.
>
> _(DRAFT — drop any outdated membership stats)_

### Section 3: Contact (#contact)

- Location: `TOLEDO, OH`
- Three action links: `SCHEDULE A CALL` (Cal.com) | `LINKEDIN` | `GITHUB`
- No email address displayed
- **URLs needed before implementation:** Cal.com link, LinkedIn URL, GitHub URL

### Footer

- Subtle consultancy mention: "Available for consulting through Beaudry Software & Systems" (link to beaudry.dev)
- Copyright: `© 2026 JUSTIN BEAUDRY`
- Footer text at `#777` minimum

## Animation

### `prefers-reduced-motion`
When the user prefers reduced motion:
- All entrance animations are instant (no delays, no transitions)
- No edge drawing animation — edges appear immediately
- No breathing animation
- Detail panel content swaps instantly (no fade)
- Use Framer Motion's `useReducedMotion()` hook

### Hero Entrance (total ~1.3s)
1. Nav slides down (0.6s ease-out)
2. H1 fades up (0.8s, delay 0.2s)
3. Sub fades up (0.8s, delay 0.4s)
4. Body fades up (0.7s, delay 0.6s)
5. Anchor fades up (0.7s, delay 0.8s)

### Ecosystem Entrance (scroll-triggered via IntersectionObserver, threshold 0.12)
1. Section fades up
2. Nodes appear with scale-up (0.5s each, staggered: center 0ms, then 150ms, 280ms, 410ms, 540ms)
3. Edges draw via stroke-dashoffset animation (1s each). Use `getTotalLength()` to set dasharray dynamically. Hub edges stagger at 80ms intervals, cross edges start at 500ms with 80ms intervals.
4. After draw completes (2s + 200ms buffer = 2.2s timeout), transition to breathing:
   - Remove `drawing` class, clear inline dasharray/dashoffset
   - Add `breathing` class to non-active edges only
   - Breathing: `opacity` 1 → 0.5 over 6s cycle, staggered at 0.8s intervals

### Edge Animation State Machine
```
IDLE → (scroll reveal) → DRAWING → (2.2s timeout) → BREATHING
BREATHING → (node click) → ACTIVE (selected node's edges highlighted, others dimmed)
ACTIVE → (click Justin) → hub edges highlighted, cross edges at base, no breathing
```
Breathing does not resume after user interaction. Once the user clicks, the graph is in interactive mode.

### Interaction
- Node selection: gold border + glow, detail panel fades up (0.35s)
- Unconnected edges dim on non-Justin selection
- Contact buttons lift on hover (translateY -2px, box shadow)
- Research link color transition on hover

## Technical Implementation

### Stack
- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS 4 for base styles
- Framer Motion for hero/detail animations
- Raw SVG for graph edges (simpler than Framer for path animation)
- `next/font/google` for font loading

### Graph Rendering Strategy
The ecosystem graph is the primary implementation risk. Key decisions:

1. **`EcosystemGraph.tsx` must be a client component** (`'use client'`). It depends on DOM measurement and user interaction.
2. **Node positions:** Use percentage-based CSS positioning (same as mockup). Measure actual pixel positions via refs after layout.
3. **Edge coordinates:** Compute in `useLayoutEffect` after nodes are mounted. Store node center positions in a ref. Recompute on `ResizeObserver` callback (debounced, 150ms).
4. **Do not use `getBoundingClientRect` in `useEffect`** — it runs too late. Use `useLayoutEffect` to avoid edge-to-wrong-position flicker.
5. **SVG edges:** Render as a stable element list keyed by edge pair. Animate via CSS classes/transitions, not by rebuilding DOM on every click.
6. **Resize:** Attach a `ResizeObserver` to the graph container instead of `window.resize`. Debounce at 150ms.
7. **SSR:** The graph renders nothing on the server. Use a client-only wrapper or `dynamic(() => import('./EcosystemGraph'), { ssr: false })`.

### Data Types
```typescript
type NodeId = 'justin' | 'actual-reality' | 'toledo-codes' | 'empowered-ai' | 'ai-collective';

interface GraphNode {
  id: NodeId;
  name: string;
  role: string;
  stat: string;
  position: { left: string; top: string };
  variant: 'center' | 'peripheral';
  ariaLabel: string;
  detail: NodeDetail;
}

interface NodeDetail {
  name: string;
  role: string;
  description: string;
  link?: { text: string; url: string };
  research?: { label: string; title: string; meta: string; url: string };
}

interface EdgeDefinition {
  from: NodeId;
  to: NodeId;
  type: 'hub' | 'cross';
}
```

### Component Architecture
```
app/
  page.tsx              # Server component shell, imports client sections
  layout.tsx            # Root layout with metadata, fonts, JSON-LD
  globals.css           # CSS variables, grid background
  llms.txt/route.ts     # Plain text route handler
  not-found.tsx         # Custom 404 (dark theme, link back home)
components/
  Navigation.tsx        # Sticky nav with IntersectionObserver-based section tracking
  Hero.tsx              # Hero + personality anchor, Framer Motion entrance
  EcosystemGraph.tsx    # 'use client' — graph orchestrator, selection state, SVG edges
  EcosystemNode.tsx     # Individual node (center vs peripheral via variant prop)
  DetailPanel.tsx       # Receives selected node data via props, Framer AnimatePresence
  Contact.tsx           # Contact section
  Footer.tsx            # Footer with consultancy mention
lib/
  graph-data.ts         # Typed node/edge/detail data (see Data Types above)
  use-edge-layout.ts    # Hook: ResizeObserver + useLayoutEffect → node positions → edge paths
```

**State management:** Local component state in `EcosystemGraph.tsx`. Selected node ID in `useState`. Edge animation phase in a ref. No external store needed.

### Progressive Enhancement
- Nodes must be visible without JS. Set initial `opacity: 1` in CSS. JavaScript adds a `.js-loaded` class to the body and overrides to `opacity: 0` for animation entrance. Without JS, nodes display statically with no animation.
- Detail panel shows Justin's info as static HTML. JS enables click-to-switch.
- SVG edges are JS-only (they require DOM measurement). Without JS, the graph is a grid of cards without lines — acceptable degradation.

### SEO
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- Single `<h1>`, structured `<h2>`/`<h3>` hierarchy
- `<meta name="description">` tuned for "Justin Beaudry engineering leader Toledo"
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card meta tags
- Canonical URL
- **og:image:** Generate a static social card image (dark background, name, tagline). Store in `/public/og.png`. 1200x630px.
- **Favicon:** Create a minimal favicon (initials "JB" or a simple mark). Include apple-touch-icon.

### schema.org (JSON-LD in layout.tsx)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Justin Beaudry",
  "url": "https://justinbeaudry.com",
  "jobTitle": ["Director of Engineering", "Founder", "Director of Technology"],
  "worksFor": [
    { "@type": "Organization", "name": "Actual Reality Technologies", "url": "..." },
    { "@type": "Organization", "name": "Toledo Codes", "url": "https://toledo.codes" },
    { "@type": "Organization", "name": "EmpoweredAI", "url": "https://empoweredai.org" },
    { "@type": "Organization", "name": "AI Collective" }
  ],
  "sameAs": ["https://linkedin.com/in/justinbeaudry", "https://github.com/JustinBeaudry"],
  "knowsAbout": ["AI", "Engineering Leadership", "Community Building"]
}
```

Separate `ScholarlyArticle` entry:
```json
{
  "@type": "ScholarlyArticle",
  "name": "Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations",
  "author": [{"@type": "Person", "name": "Justin Beaudry"}, ...],
  "datePublished": "2025",
  "url": "https://arxiv.org/abs/2508.21164",
  "publisher": {"@type": "Organization", "name": "arXiv"}
}
```

### llms.txt
Serve `/llms.txt` at site root via route handler (`app/llms.txt/route.ts`):
```
# Justin Beaudry

> Engineering leader, community builder, Toledo OH

## Current Roles
- Director of Engineering, Actual Reality Technologies
- Founder, Toledo Codes
- Director of Technology & Board Treasurer, EmpoweredAI
- Regional Manager — Midwest, AI Collective

## About
[Brief bio — deliberate move from SF/Austin to Toledo, philosophy background, etc.]

## Research
- Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations (arXiv, 2025)

## Contact
- Schedule: [Cal.com link]
- LinkedIn: https://linkedin.com/in/justinbeaudry
- GitHub: https://github.com/JustinBeaudry
- Consulting: Beaudry Software & Systems (beaudry.dev)
```

### Accessibility
- Skip-to-content link (visible on focus, gold background)
- `tabindex="0"`, `role="button"`, `aria-label` (include stat info for screen readers) on graph nodes
- `aria-pressed` toggled on node selection
- `aria-live="polite"` on detail panel
- `:focus-visible` on all interactive elements (accent color outline, 2px, offset 2-3px)
- Keyboard navigation: Enter/Space to select nodes, Tab to traverse
- `<main>` landmark wrapping content
- All text meets WCAG AA contrast ratios
- All interactive targets minimum 44x44px (desktop and mobile)

### Responsive Breakpoints

**Desktop (>1024px):** Full graph with absolute positioning, SVG edges, all animations.

**Tablet (768-1024px):** Same layout as desktop but verify node positioning at 768px — nodes at 87% left may clip. Consider capping graph container at 100% width with horizontal padding. Test at 800px and 900px.

**Mobile (<768px):**
- Graph: 2x2 CSS grid (center node spans full width, peripherals in grid cells)
- SVG edges hidden
- `white-space: normal` on node names (allow wrapping)
- Center node max-width: 300px
- Detail panel scrolls into view on node selection
- Contact links: flex-wrap, min-width 140px
- All touch targets minimum 44x44px
- Node animation uses `scale(0.95)` without translate (no position:absolute on mobile)

### Miscellaneous
- **No analytics** for initial launch. Can add later if needed.
- **404 page:** Custom `not-found.tsx` with dark theme, "Page not found" message, link back to home.
- **Print styles:** Not required for initial launch.
- **Transition from current site:** Delete existing `page.tsx`, `globals.css`, and `tailwind.config.ts` content. Replace entirely — no code to preserve from the cyberpunk scaffold.

## Copy Status

All body copy is marked **DRAFT**. Justin will review and rewrite in his own voice during implementation. The design supports any copy length — detail panel scrolls, nodes accommodate varying stat text.

**Process:** Finalize node stat text first (these affect node dimensions and edge positions). Then finalize detail panel copy and hero copy (these don't affect layout).

Key copy principles established during brainstorming:
- No corporate-speak or LinkedIn language
- Show what you do, don't claim titles ("I organize the meetups I wished existed" > "community ecosystem architect")
- Specific over vague ("students build QR codes for city maintenance reporting" > "civic tech initiatives")
- Let the ecosystem graph do the "breadth" communication — copy should be terse
- Verified facts only — no unverified stats

## URLs Needed Before Implementation

| Link | URL | Status |
|------|-----|--------|
| Cal.com | ? | Needs from Justin |
| LinkedIn | https://linkedin.com/in/justinbeaudry | Confirmed |
| GitHub | https://github.com/JustinBeaudry | Confirmed |
| arXiv paper | https://arxiv.org/abs/2508.21164 | Confirmed |
| toledo.codes | https://toledo.codes | Needs verification |
| beaudry.dev | https://beaudry.dev | Needs verification |
| EmpoweredAI | https://empoweredai.org | Needs verification |
| AI Collective | ? | Needs from Justin |
| Actual Reality | ? | Needs from Justin |
