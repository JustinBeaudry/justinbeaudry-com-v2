# Personal Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal site with an interactive ecosystem graph as the centerpiece, replacing the existing cyberpunk scaffold.

**Architecture:** Server component shell renders static sections (hero, contact, footer). The ecosystem graph is a client-only component (`ssr: false`) that uses percentage-based node positioning, SVG quadratic bezier edges computed via `useLayoutEffect` + `ResizeObserver`, and CSS class-based animation state machine. All data is static in `lib/graph-data.ts`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, Framer Motion, raw SVG edges, `next/font/google`

**Spec:** `docs/superpowers/specs/2026-04-13-personal-site-redesign-design.md`

### Known Issues (fix during implementation)

1. **Task 3 — Nav entrance animation missing.** Spec requires 0.6s slide-down. Add `motion.nav` wrapper with Framer Motion.
2. **Task 8 — `phaseRef` mutations don't trigger re-renders.** The edge class logic reads `phaseRef.current` at render time but ref changes don't cause re-renders. Fix: use `useState` for animation phase instead of `useRef`, or add a `forceUpdate` counter after phase transitions.
3. **Task 8 — Edge dimming logic for Justin-selected is unreachable.** The `else if (isJustinSelected && type === 'hub')` branch is dead code once `phaseRef = 'interactive'`. Fix: restructure the conditional to handle Justin-selected inside the interactive block.
4. **Progressive enhancement not implemented.** Spec requires `.js-loaded` body class pattern so nodes are visible without JS. Fix: add `document.body.classList.add('js-loaded')` in a useEffect, define `.js-loaded .node-initial { opacity: 0 }` in CSS, set nodes to `opacity: 1` by default.
5. **Task 5 — `estimateQuadLength` should use `getTotalLength()`.** The hook should call `getTotalLength()` on the SVG path element after render instead of approximating. Requires a ref to the SVG path elements.
6. **og:image and favicon** are technical deliverables, not copy-dependent. Should be created during implementation, not deferred to post-implementation.

---

### Task 1: Foundation — Fonts, CSS Variables, Layout Shell

**Files:**
- Modify: `app/layout.tsx`
- Rewrite: `app/globals.css`
- Modify: `tailwind.config.ts`
- Delete contents of: `app/page.tsx` (will be rebuilt in Task 2)

- [ ] **Step 1: Set up fonts in layout.tsx**

Replace the entire file:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Justin Beaudry | Engineering Leader & Community Builder',
  description:
    'Engineering leader and community builder in Toledo, OH. Director of Engineering at Actual Reality Technologies. Founder of Toledo Codes.',
  metadataBase: new URL('https://justinbeaudry.com'),
  openGraph: {
    title: 'Justin Beaudry',
    description:
      'Engineering leader and community builder in Toledo, OH.',
    url: 'https://justinbeaudry.com',
    siteName: 'Justin Beaudry',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Justin Beaudry',
    description:
      'Engineering leader and community builder in Toledo, OH.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased bg-[var(--bg)] text-[var(--text-primary)] font-[family-name:var(--font-outfit)]">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Rewrite globals.css**

Replace the entire file:

```css
/* app/globals.css */
@import 'tailwindcss';

@layer base {
  :root {
    --bg: #0a0a0a;
    --accent: #c8a455;
    --accent-dim: rgba(200, 164, 85, 0.15);
    --accent-glow: rgba(200, 164, 85, 0.06);
    --text-bright: #ffffff;
    --text-primary: #c8c8c8;
    --text-secondary: #999999;
    --text-muted: #888888;
    --border: rgba(255, 255, 255, 0.1);
    --border-hover: rgba(255, 255, 255, 0.25);
    --edge-base: rgba(255, 255, 255, 0.1);
    --edge-cross: rgba(255, 255, 255, 0.06);
  }

  body {
    background: var(--bg);
    color: var(--text-primary);
  }
}

@layer components {
  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
}

@layer utilities {
  /* Focus ring for all interactive elements */
  .focus-accent:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  /* Edge animations */
  @keyframes breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .edge-breathing {
    animation: breathe 6s ease-in-out infinite;
  }
}
```

- [ ] **Step 3: Update tailwind.config.ts**

Replace the entire file:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Create a minimal page.tsx placeholder**

```tsx
// app/page.tsx
export default function Home() {
  return (
    <>
      <div className="grid-bg" />
      <div className="relative z-10">
        <main id="main-content">
          <p className="text-center py-20 text-[var(--text-muted)]">Site under construction</p>
        </main>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify it builds and renders**

Run: `cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2 && bun run build`
Expected: Build succeeds with no errors.

Run: `bun run dev` and check http://localhost:3000
Expected: Dark background with subtle grid, "Site under construction" text in gray, Outfit font loaded.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css app/page.tsx tailwind.config.ts
git commit -m "feat: foundation — fonts, CSS variables, grid background"
```

---

### Task 2: Graph Data Layer

**Files:**
- Create: `lib/graph-data.ts`

- [ ] **Step 1: Create the typed data file**

```ts
// lib/graph-data.ts

export type NodeId =
  | 'justin'
  | 'actual-reality'
  | 'toledo-codes'
  | 'empowered-ai'
  | 'ai-collective';

export interface NodeDetail {
  name: string;
  role: string;
  description: string;
  link?: { text: string; url: string };
  research?: { label: string; title: string; meta: string; url: string };
}

export interface GraphNode {
  id: NodeId;
  name: string;
  role: string;
  stat: string;
  position: { left: string; top: string };
  variant: 'center' | 'peripheral';
  ariaLabel: string;
  detail: NodeDetail;
}

export interface EdgeDefinition {
  from: NodeId;
  to: NodeId;
  type: 'hub' | 'cross';
}

export const NODES: GraphNode[] = [
  {
    id: 'justin',
    name: 'JUSTIN BEAUDRY',
    role: 'Software + Humans + Community',
    stat: '15+ yrs · 5 orgs · Toledo, OH',
    position: { left: '47%', top: '48%' },
    variant: 'center',
    ariaLabel: 'View details for Justin Beaudry — 15 plus years, 5 organizations, Toledo Ohio',
    detail: {
      name: 'Justin Beaudry',
      role: 'SOFTWARE + HUMANS + COMMUNITY',
      description:
        "Spent a decade at SF/Austin startups — CreativeLive, Instawork, United Airlines, Vida Health. Studied philosophy at Toledo, not CS. Moved back because the interesting problems aren't all on the coasts.",
      research: {
        label: 'PUBLISHED RESEARCH',
        title: 'Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations',
        meta: 'arXiv · 2025',
        url: 'https://arxiv.org/abs/2508.21164',
      },
    },
  },
  {
    id: 'actual-reality',
    name: 'ACTUAL REALITY',
    role: 'Dir. of Engineering',
    stat: 'AI consultancy · founded 2023',
    position: { left: '32%', top: '8%' },
    variant: 'peripheral',
    ariaLabel: 'View details for Actual Reality Technologies — AI consultancy founded 2023',
    detail: {
      name: 'Actual Reality Technologies',
      role: 'DIRECTOR OF ENGINEERING',
      description:
        'Founding engineering leader at an AI consultancy. Building products, internal tools, and the engineering org — consulting, coding, mentoring engineers. Player-coach across the full stack.',
    },
  },
  {
    id: 'toledo-codes',
    name: 'TOLEDO CODES',
    role: 'Founder',
    stat: 'meetups · civic tech · mentorship',
    position: { left: '87%', top: '34%' },
    variant: 'peripheral',
    ariaLabel: 'View details for Toledo Codes — meetups, civic tech, mentorship',
    detail: {
      name: 'Toledo Codes',
      role: 'FOUNDER',
      description:
        "A developer community in Northwest Ohio. Regular meetups and a civic tech program where college students build real projects in a simulated startup environment — standups, code reviews, shipping. First project: Batting Cleanup, QR codes for reporting city maintenance issues.",
      link: { text: 'toledo.codes →', url: 'https://toledo.codes' },
    },
  },
  {
    id: 'empowered-ai',
    name: 'EMPOWERED AI',
    role: 'Dir. of Technology',
    stat: 'AI education · ages 7-12 · $40K city grant',
    position: { left: '10%', top: '66%' },
    variant: 'peripheral',
    ariaLabel: 'View details for EmpoweredAI — AI education, ages 7 to 12, 40K city grant',
    detail: {
      name: 'EmpoweredAI',
      role: 'DIRECTOR OF TECHNOLOGY · BOARD TREASURER',
      description:
        "Non-profit bringing AI education to kids ages 7-12 in Toledo. Backed by a $40K City of Toledo grant. Justin's role: guiding the technology roadmap and providing board oversight.",
    },
  },
  {
    id: 'ai-collective',
    name: 'AI COLLECTIVE',
    role: 'Regional Mgr, Midwest',
    stat: 'Great Lakes AI Week · Columbus AI Week',
    position: { left: '72%', top: '88%' },
    variant: 'peripheral',
    ariaLabel:
      'View details for AI Collective — Great Lakes AI Week, Columbus AI Week',
    detail: {
      name: 'AI Collective',
      role: 'REGIONAL MANAGER — MIDWEST',
      description:
        'Getting developers, businesses, and policymakers in the same room across Ohio and the Midwest. Co-hosting Great Lakes AI Week. The conversations that need to happen before the tools get built.',
      link: { text: 'Learn more →', url: '#' },
    },
  },
];

export const EDGES: EdgeDefinition[] = [
  { from: 'justin', to: 'actual-reality', type: 'hub' },
  { from: 'justin', to: 'toledo-codes', type: 'hub' },
  { from: 'justin', to: 'empowered-ai', type: 'hub' },
  { from: 'justin', to: 'ai-collective', type: 'hub' },
  { from: 'actual-reality', to: 'empowered-ai', type: 'cross' },
  { from: 'toledo-codes', to: 'ai-collective', type: 'cross' },
  { from: 'empowered-ai', to: 'ai-collective', type: 'cross' },
];

export const DEFAULT_NODE: NodeId = 'justin';
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2 && npx tsc --noEmit lib/graph-data.ts`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/graph-data.ts
git commit -m "feat: graph data layer — typed nodes, edges, detail content"
```

---

### Task 3: Navigation Component

**Files:**
- Create: `components/Navigation.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Navigation component**

```tsx
// components/Navigation.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { href: '#about', label: 'HOME' },
  { href: '#work', label: 'WORK' },
  { href: '#contact', label: 'CONTACT' },
] as const;

export function Navigation() {
  const [activeSection, setActiveSection] = useState('about');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    sections.forEach((section) => observerRef.current?.observe(section));
    return () => observerRef.current?.disconnect();
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="sticky top-0 z-100 flex items-center justify-between px-10 py-5 border-b border-[var(--border)] bg-[rgba(10,10,10,0.92)] backdrop-blur-[12px] font-mono text-[11px] tracking-[2px]">
      <span className="font-bold text-[var(--text-bright)]">JUSTIN BEAUDRY</span>
      <div className="flex gap-7">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleClick(e, href)}
            className={`focus-accent transition-colors duration-200 ${
              activeSection === href.slice(1)
                ? 'text-[var(--text-bright)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-bright)]'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Add Navigation and skip link to page.tsx**

```tsx
// app/page.tsx
import { Navigation } from '@/components/Navigation';

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute top-[-100px] left-4 z-[200] bg-[var(--accent)] text-[var(--bg)] px-4 py-2 font-mono text-xs tracking-wider no-underline focus:top-2"
      >
        Skip to content
      </a>
      <div className="grid-bg" />
      <div className="relative z-10">
        <Navigation />
        <main id="main-content">
          <section id="about" className="py-20 text-center">
            <p className="text-[var(--text-muted)]">Hero placeholder</p>
          </section>
          <section id="work" className="py-20 text-center">
            <p className="text-[var(--text-muted)]">Work placeholder</p>
          </section>
          <section id="contact" className="py-20 text-center">
            <p className="text-[var(--text-muted)]">Contact placeholder</p>
          </section>
        </main>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify navigation renders and scrolls**

Run: `bun run dev`
Expected: Sticky nav at top, three links, smooth scroll on click, active state tracking.

- [ ] **Step 4: Commit**

```bash
git add components/Navigation.tsx app/page.tsx
git commit -m "feat: sticky navigation with section tracking"
```

---

### Task 4: Hero Component

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Hero component**

```tsx
// components/Hero.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' },
});

export function Hero() {
  const reduceMotion = useReducedMotion();

  const anim = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1, y: 0 } }
      : fadeUp(delay);

  return (
    <section id="about">
      <div className="mx-auto max-w-[700px] px-10 pt-[100px] pb-7 text-center">
        <motion.h1
          {...anim(0.2)}
          className="text-[40px] font-bold leading-[1.3] text-[var(--text-bright)] mb-3.5"
        >
          A decade of startups in San Francisco and Austin.
        </motion.h1>
        <motion.div
          {...anim(0.4)}
          className="text-[22px] font-normal leading-[1.5] text-[var(--text-primary)] mb-4"
        >
          Then a deliberate move home to Toledo.
        </motion.div>
        <motion.p
          {...anim(0.6)}
          className="text-base font-normal leading-[1.7] text-[var(--text-secondary)]"
        >
          Now I lead engineering at an AI consultancy, run a developer community,
          and serve on the board of a non-profit bringing AI education to Toledo.
        </motion.p>
      </div>
      <motion.div
        {...anim(0.8)}
        className="mx-auto max-w-[700px] px-10 pb-14 text-center"
      >
        <p className="font-mono text-[15px] tracking-wider text-[var(--accent)] mb-2">
          Studied philosophy. Writes code. Builds communities.
        </p>
        <span className="text-sm italic text-[var(--text-muted)]">
          Currently thinking about what AI-first and &ldquo;local tech ecosystem&rdquo; actually mean.
        </span>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Wire Hero into page.tsx**

Replace the `#about` section placeholder in `app/page.tsx`:

```tsx
// app/page.tsx
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute top-[-100px] left-4 z-[200] bg-[var(--accent)] text-[var(--bg)] px-4 py-2 font-mono text-xs tracking-wider no-underline focus:top-2"
      >
        Skip to content
      </a>
      <div className="grid-bg" />
      <div className="relative z-10">
        <Navigation />
        <main id="main-content">
          <Hero />
          <section id="work" className="py-20 text-center">
            <p className="text-[var(--text-muted)]">Work placeholder</p>
          </section>
          <section id="contact" className="py-20 text-center">
            <p className="text-[var(--text-muted)]">Contact placeholder</p>
          </section>
        </main>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify hero renders with animation**

Run: `bun run dev`
Expected: Staggered fade-up entrance. Gold tagline. Italic aside. Refresh page to re-trigger.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: hero section with staggered entrance animation"
```

---

### Task 5: Edge Layout Hook

**Files:**
- Create: `lib/use-edge-layout.ts`

- [ ] **Step 1: Create the hook**

```ts
// lib/use-edge-layout.ts
'use client';

import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import type { NodeId, EdgeDefinition } from './graph-data';

export interface Point {
  x: number;
  y: number;
}

export interface ComputedEdge {
  from: NodeId;
  to: NodeId;
  type: 'hub' | 'cross';
  path: string;
  length: number;
}

function computeControlPoint(p1: Point, p2: Point, curveFactor: number): Point {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return {
    x: mx - dy * curveFactor,
    y: my + dx * curveFactor,
  };
}

function estimateQuadLength(p1: Point, cp: Point, p2: Point): number {
  // Approximate via 4 line segments
  const steps = 4;
  let length = 0;
  let prev = p1;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cp.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cp.y + t * t * p2.y;
    length += Math.hypot(x - prev.x, y - prev.y);
    prev = { x, y };
  }
  return length;
}

export function useEdgeLayout(
  containerRef: React.RefObject<HTMLDivElement | null>,
  nodeRefs: React.MutableRefObject<Map<NodeId, HTMLDivElement>>,
  edges: EdgeDefinition[]
) {
  const [computedEdges, setComputedEdges] = useState<ComputedEdge[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const compute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const results: ComputedEdge[] = [];

    for (const edge of edges) {
      const fromEl = nodeRefs.current.get(edge.from);
      const toEl = nodeRefs.current.get(edge.to);
      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const p1: Point = {
        x: fromRect.left + fromRect.width / 2 - containerRect.left,
        y: fromRect.top + fromRect.height / 2 - containerRect.top,
      };
      const p2: Point = {
        x: toRect.left + toRect.width / 2 - containerRect.left,
        y: toRect.top + toRect.height / 2 - containerRect.top,
      };

      const curveFactor = edge.type === 'hub' ? 0.22 : 0.15;
      const cp = computeControlPoint(p1, p2, curveFactor);
      const path = `M${p1.x},${p1.y} Q${cp.x},${cp.y} ${p2.x},${p2.y}`;
      const length = estimateQuadLength(p1, cp, p2);

      results.push({ from: edge.from, to: edge.to, type: edge.type, path, length });
    }

    setComputedEdges(results);
  }, [containerRef, nodeRefs, edges]);

  useLayoutEffect(() => {
    compute();
  }, [compute]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(compute, 150);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, compute]);

  return computedEdges;
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2 && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/use-edge-layout.ts
git commit -m "feat: useEdgeLayout hook — ResizeObserver + bezier edge computation"
```

---

### Task 6: Ecosystem Node Component

**Files:**
- Create: `components/EcosystemNode.tsx`

- [ ] **Step 1: Create the node component**

```tsx
// components/EcosystemNode.tsx
import { forwardRef } from 'react';
import type { GraphNode } from '@/lib/graph-data';

interface EcosystemNodeProps {
  node: GraphNode;
  isSelected: boolean;
  onSelect: () => void;
}

export const EcosystemNode = forwardRef<HTMLDivElement, EcosystemNodeProps>(
  function EcosystemNode({ node, isSelected, onSelect }, ref) {
    const isCenter = node.variant === 'center';

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect();
      }
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={node.ariaLabel}
        aria-pressed={isSelected}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        style={{ left: node.position.left, top: node.position.top }}
        className={`
          absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none
          transition-all duration-300 ease-out
          max-md:relative max-md:left-auto max-md:top-auto max-md:translate-x-0 max-md:translate-y-0
        `}
      >
        <div
          className={`
            border text-center transition-all duration-300 ease-out
            ${isCenter
              ? 'px-9 py-7 bg-[rgba(200,164,85,0.03)] border-[rgba(200,164,85,0.15)]'
              : 'px-5 py-3.5 bg-[rgba(255,255,255,0.02)] border-[var(--border)]'
            }
            ${isSelected
              ? 'border-[var(--accent)] bg-[var(--accent-glow)] shadow-[0_0_30px_var(--accent-glow)]'
              : 'hover:border-[var(--border-hover)] hover:bg-[rgba(255,255,255,0.04)] hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]'
            }
          `}
        >
          <div
            className={`font-mono font-bold tracking-wider text-[var(--text-bright)] ${
              isCenter ? 'text-[16px] tracking-[2px]' : 'text-[11px] tracking-[1px]'
            } max-md:whitespace-normal`}
          >
            {node.name}
          </div>
          <div
            className={`text-[var(--text-secondary)] mt-0.5 ${
              isCenter ? 'text-[13px]' : 'text-[11px]'
            } max-md:whitespace-normal`}
          >
            {node.role}
          </div>
          <div
            className={`font-mono text-[var(--accent)] mt-1.5 ${
              isCenter ? 'text-[11px] mt-2' : 'text-[10px] tracking-[0.5px]'
            }`}
          >
            {node.stat}
          </div>
        </div>
      </div>
    );
  }
);
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/EcosystemNode.tsx
git commit -m "feat: EcosystemNode component — center and peripheral variants"
```

---

### Task 7: Detail Panel Component

**Files:**
- Create: `components/DetailPanel.tsx`

- [ ] **Step 1: Create the detail panel**

```tsx
// components/DetailPanel.tsx
'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { NodeDetail } from '@/lib/graph-data';

interface DetailPanelProps {
  detail: NodeDetail;
  nodeId: string;
}

export function DetailPanel({ detail, nodeId }: DetailPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="mx-auto max-w-[640px] px-10 min-h-[180px]"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={nodeId}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
          className="border-t border-[var(--border)] pt-7"
        >
          <h3 className="text-xl font-semibold text-[var(--text-bright)] mb-1">
            {detail.name}
          </h3>
          <div className="font-mono text-[11px] tracking-wider text-[var(--text-secondary)] mb-3.5">
            {detail.role}
          </div>
          <p className="text-[15px] font-normal leading-[1.75] text-[var(--text-primary)]">
            {detail.description}
          </p>
          {detail.link && (
            <a
              href={detail.link.url}
              className="inline-block mt-4 font-mono text-[11px] tracking-wider text-[var(--accent)] no-underline border-b border-[rgba(200,164,85,0.3)] pb-0.5 transition-all duration-200 hover:text-[var(--text-bright)] hover:border-[var(--text-bright)] focus-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {detail.link.text}
            </a>
          )}
          {detail.research && (
            <div className="mt-4 pt-3.5 border-t border-[rgba(255,255,255,0.05)]">
              <span className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] block mb-1">
                {detail.research.label}
              </span>
              <a
                href={detail.research.url}
                className="text-[13px] text-[var(--text-secondary)] no-underline leading-[1.5] transition-colors duration-200 hover:text-[var(--accent)] focus-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                {detail.research.title}
                <span className="text-[10px] text-[var(--text-muted)]">
                  {' '}— {detail.research.meta}
                </span>
              </a>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/DetailPanel.tsx
git commit -m "feat: DetailPanel with AnimatePresence and research inline"
```

---

### Task 8: Ecosystem Graph — Assembly

**Files:**
- Create: `components/EcosystemGraph.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create the graph orchestrator**

```tsx
// components/EcosystemGraph.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { NODES, EDGES, DEFAULT_NODE } from '@/lib/graph-data';
import type { NodeId } from '@/lib/graph-data';
import { useEdgeLayout } from '@/lib/use-edge-layout';
import { EcosystemNode } from './EcosystemNode';
import { DetailPanel } from './DetailPanel';

type AnimPhase = 'idle' | 'entering' | 'drawing' | 'breathing' | 'interactive';

export function EcosystemGraph() {
  const [selectedNode, setSelectedNode] = useState<NodeId>(DEFAULT_NODE);
  const phaseRef = useRef<AnimPhase>('idle');
  const reduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<NodeId, HTMLDivElement>>(new Map());
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });

  const computedEdges = useEdgeLayout(containerRef, nodeRefs, EDGES);

  const setNodeRef = useCallback((id: NodeId, el: HTMLDivElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  function handleSelect(id: NodeId) {
    if (id === selectedNode) return;
    setSelectedNode(id);
    phaseRef.current = 'interactive';

    // Scroll detail into view on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        document.getElementById('detail-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }
  }

  // Trigger entrance animation
  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if (isInView && !hasEntered) {
      if (reduceMotion) {
        setHasEntered(true);
        phaseRef.current = 'interactive';
      } else {
        setHasEntered(true);
        phaseRef.current = 'entering';
        // Transition: entering → drawing → breathing
        setTimeout(() => {
          phaseRef.current = 'drawing';
        }, 600); // after nodes enter
        setTimeout(() => {
          phaseRef.current = 'breathing';
        }, 2800); // after edges draw
      }
    }
  }, [isInView, hasEntered, reduceMotion]);

  const selectedDetail = NODES.find((n) => n.id === selectedNode)?.detail;

  // Edge rendering helpers
  function getEdgeClasses(from: NodeId, to: NodeId, type: 'hub' | 'cross'): string {
    const isInteractive = phaseRef.current === 'interactive';
    const isConnected = from === selectedNode || to === selectedNode;
    const isJustinSelected = selectedNode === 'justin';

    let classes = 'fill-none transition-all duration-400 ease-out';

    // Stroke style
    if (type === 'cross') {
      classes += ' stroke-[var(--edge-cross)]';
      if (!isInteractive) classes += ' [stroke-dasharray:4_4]';
    } else {
      classes += ' stroke-[var(--edge-base)]';
    }

    // Interactive state
    if (isInteractive) {
      if (isConnected) {
        classes += ' !stroke-[rgba(200,164,85,0.25)] !stroke-[1.5px]';
      } else if (!isJustinSelected) {
        classes += ' opacity-30';
      }
    } else if (isJustinSelected && type === 'hub') {
      classes += ' !stroke-[rgba(200,164,85,0.25)] !stroke-[1.5px]';
    }

    // Breathing
    if (phaseRef.current === 'breathing' && !isConnected) {
      classes += ' edge-breathing';
    }

    return classes;
  }

  // Node entrance stagger delays
  const nodeDelays = [0, 0.15, 0.28, 0.41, 0.54];

  return (
    <section id="work" ref={sectionRef}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mx-auto max-w-[960px] px-10 pt-12 pb-15"
      >
        <div className="font-mono text-[11px] tracking-[3px] text-[var(--text-muted)] text-center mb-10">
          WHAT I&apos;M BUILDING
        </div>

        {/* Graph container */}
        <div
          ref={containerRef}
          className="relative w-full h-[400px] max-md:h-auto max-md:grid max-md:grid-cols-2 max-md:gap-2.5 max-md:justify-items-center"
        >
          {/* SVG edges — desktop only */}
          <svg className="absolute inset-0 w-full h-full max-md:hidden">
            {hasEntered &&
              computedEdges.map((edge) => {
                const isDrawing = phaseRef.current === 'drawing' || phaseRef.current === 'entering';
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={edge.path}
                    strokeWidth={1}
                    className={getEdgeClasses(edge.from, edge.to, edge.type)}
                    style={
                      isDrawing && !reduceMotion
                        ? {
                            strokeDasharray: edge.length,
                            strokeDashoffset: edge.length,
                            animation: `drawLine 1s ease-out forwards`,
                            animationDelay: `${
                              edge.type === 'hub'
                                ? EDGES.filter((e) => e.type === 'hub').indexOf(
                                    EDGES.find(
                                      (e) => e.from === edge.from && e.to === edge.to
                                    )!
                                  ) * 0.08
                                : 0.5 +
                                  EDGES.filter((e) => e.type === 'cross').indexOf(
                                    EDGES.find(
                                      (e) => e.from === edge.from && e.to === edge.to
                                    )!
                                  ) * 0.08
                            }s`,
                          }
                        : undefined
                    }
                  />
                );
              })}
          </svg>

          {/* Nodes */}
          {NODES.map((node, i) => (
            <motion.div
              key={node.id}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={hasEntered ? { opacity: 1, scale: 1 } : undefined}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                delay: reduceMotion ? 0 : nodeDelays[i] ?? 0,
                ease: 'easeOut',
              }}
              className={`${node.variant === 'center' ? 'max-md:col-span-2 max-md:max-w-[300px]' : ''} max-md:w-full`}
            >
              <EcosystemNode
                ref={(el) => setNodeRef(node.id, el)}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={() => handleSelect(node.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Detail Panel */}
        <div id="detail-panel" className="mt-4">
          {selectedDetail && (
            <DetailPanel detail={selectedDetail} nodeId={selectedNode} />
          )}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Add drawLine keyframe to globals.css**

Add inside `@layer utilities`:

```css
  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }
```

- [ ] **Step 3: Wire into page.tsx**

Replace the `#work` placeholder in `app/page.tsx` with a dynamic import:

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';

const EcosystemGraph = dynamic(
  () => import('@/components/EcosystemGraph').then((m) => m.EcosystemGraph),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute top-[-100px] left-4 z-[200] bg-[var(--accent)] text-[var(--bg)] px-4 py-2 font-mono text-xs tracking-wider no-underline focus:top-2"
      >
        Skip to content
      </a>
      <div className="grid-bg" />
      <div className="relative z-10">
        <Navigation />
        <main id="main-content">
          <Hero />
          <EcosystemGraph />
          <section id="contact" className="py-20 text-center">
            <p className="text-[var(--text-muted)]">Contact placeholder</p>
          </section>
        </main>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify full graph renders**

Run: `bun run dev`
Expected: Scroll down to see ecosystem section. Nodes appear with stagger. Edges draw with curves. Clicking nodes highlights edges, updates detail panel. Justin selected by default.

- [ ] **Step 5: Commit**

```bash
git add components/EcosystemGraph.tsx app/globals.css app/page.tsx
git commit -m "feat: ecosystem graph — nodes, edges, animations, detail panel"
```

---

### Task 9: Contact and Footer Components

**Files:**
- Create: `components/Contact.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Contact component**

```tsx
// components/Contact.tsx
const LINKS = [
  { label: 'SCHEDULE A CALL', href: '#' },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/justinbeaudry' },
  { label: 'GITHUB', href: 'https://github.com/JustinBeaudry' },
] as const;

export function Contact() {
  return (
    <section id="contact">
      <div className="mx-auto max-w-[640px] px-10 pt-20 pb-10 text-center border-t border-[rgba(255,255,255,0.06)]">
        <div className="font-mono text-[11px] tracking-[2px] text-[var(--text-muted)] mb-6">
          TOLEDO, OH
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="font-mono text-[11px] tracking-wider text-[var(--text-secondary)] no-underline px-5 py-2.5 border border-[var(--border)] transition-all duration-250 ease-out hover:text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-[0_0_16px_var(--accent-glow)] hover:-translate-y-0.5 focus-accent min-w-[140px] text-center"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer component**

```tsx
// components/Footer.tsx
export function Footer() {
  return (
    <footer className="text-center px-10 pt-12 pb-6 font-mono">
      <div className="text-[11px] text-[#777] tracking-wider mb-4">
        Available for consulting through{' '}
        <a
          href="https://beaudry.dev"
          className="text-[#888] no-underline border-b border-[#555] pb-px transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)] focus-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          Beaudry Software &amp; Systems
        </a>
      </div>
      <div className="text-[10px] text-[#555] tracking-wider">
        &copy; {new Date().getFullYear()} JUSTIN BEAUDRY
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wire into page.tsx**

Replace the `#contact` placeholder and add the footer:

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const EcosystemGraph = dynamic(
  () => import('@/components/EcosystemGraph').then((m) => m.EcosystemGraph),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute top-[-100px] left-4 z-[200] bg-[var(--accent)] text-[var(--bg)] px-4 py-2 font-mono text-xs tracking-wider no-underline focus:top-2"
      >
        Skip to content
      </a>
      <div className="grid-bg" />
      <div className="relative z-10">
        <Navigation />
        <main id="main-content">
          <Hero />
          <EcosystemGraph />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify the full page**

Run: `bun run dev`
Expected: Full page — hero, ecosystem graph, contact, footer. All sections visible. Nav tracks active section.

- [ ] **Step 5: Commit**

```bash
git add components/Contact.tsx components/Footer.tsx app/page.tsx
git commit -m "feat: contact section and footer"
```

---

### Task 10: SEO, JSON-LD, llms.txt, 404

**Files:**
- Modify: `app/layout.tsx` (add JSON-LD)
- Create: `app/llms.txt/route.ts`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Add JSON-LD to layout.tsx**

Add a `<script type="application/ld+json">` inside the `<head>` section of `layout.tsx`, right before `{children}`:

```tsx
// Inside RootLayout, before {children}:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          name: 'Justin Beaudry',
          url: 'https://justinbeaudry.com',
          jobTitle: ['Director of Engineering', 'Founder', 'Director of Technology'],
          worksFor: [
            { '@type': 'Organization', name: 'Actual Reality Technologies' },
            { '@type': 'Organization', name: 'Toledo Codes', url: 'https://toledo.codes' },
            { '@type': 'Organization', name: 'EmpoweredAI', url: 'https://empoweredai.org' },
            { '@type': 'Organization', name: 'AI Collective' },
          ],
          sameAs: [
            'https://linkedin.com/in/justinbeaudry',
            'https://github.com/JustinBeaudry',
          ],
          knowsAbout: ['AI', 'Engineering Leadership', 'Community Building'],
        },
        {
          '@type': 'ScholarlyArticle',
          name: 'Quantifying Label-Induced Bias in LLM Self- and Cross-Evaluations',
          author: [{ '@type': 'Person', name: 'Justin Beaudry' }],
          datePublished: '2025',
          url: 'https://arxiv.org/abs/2508.21164',
          publisher: { '@type': 'Organization', name: 'arXiv' },
        },
      ],
    }),
  }}
/>
```

- [ ] **Step 2: Create llms.txt route handler**

```ts
// app/llms.txt/route.ts
export function GET() {
  const content = `# Justin Beaudry

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
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

- [ ] **Step 3: Create 404 page**

```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <h1 className="font-mono text-[var(--text-muted)] text-sm tracking-[3px] mb-4">
          PAGE NOT FOUND
        </h1>
        <Link
          href="/"
          className="font-mono text-[11px] tracking-wider text-[var(--accent)] no-underline border-b border-[rgba(200,164,85,0.3)] pb-0.5 hover:text-[var(--text-bright)] hover:border-[var(--text-bright)]"
        >
          Back to home →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `bun run dev`
- Check http://localhost:3000/llms.txt — should return plain text
- Check http://localhost:3000/nonexistent — should show custom 404
- View page source — JSON-LD script tag should be present

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/llms.txt/route.ts app/not-found.tsx
git commit -m "feat: JSON-LD structured data, llms.txt, custom 404"
```

---

### Task 11: Final Build Verification and Cleanup

**Files:**
- Delete: old assets from `public/` (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
- Delete: screenshot PNGs from project root

- [ ] **Step 1: Clean up unused files**

```bash
cd /Users/justinbeaudry/Projects/justinbeaudry-com-v2
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
rm -f *-full.png
```

- [ ] **Step 2: Run lint**

Run: `bun run lint`
Expected: No errors. Fix any that appear.

- [ ] **Step 3: Run production build**

Run: `bun run build`
Expected: Build succeeds. Note the output bundle sizes.

- [ ] **Step 4: Test production server**

Run: `bun run start`
Expected: Full site works at http://localhost:3000. Hero animates. Graph renders on scroll. Node clicks work. Nav tracks sections. /llms.txt returns text. /nonexistent shows 404.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove unused assets, verify production build"
```

---

## Post-Implementation Checklist

These items are **not tasks** — they require Justin's input and can't be implemented without it:

- [ ] **Finalize all DRAFT copy** — Justin rewrites hero body, node detail descriptions in his own voice
- [ ] **Provide missing URLs** — Cal.com scheduling link, AI Collective link, Actual Reality link
- [ ] **Verify toledo.codes and beaudry.dev** resolve correctly
- [ ] **Verify Actual Reality founding date** (2023 vs. when Justin joined in Nov 2024)
- [ ] **Verify EmpoweredAI stats** with the organization before adding any beyond the $40K grant
- [ ] **Create og:image** — dark background, name, tagline, 1200x630px, save as `/public/og.png`
- [ ] **Create favicon** — minimal mark or "JB" initials, save as `/public/favicon.ico` + apple-touch-icon
