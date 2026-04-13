# CLAUDE.md

## Project

Personal website for Justin Beaudry (v2). Single-page cyberpunk noir aesthetic built with Next.js App Router.

## Stack

- **Runtime/PM:** Bun
- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Commands

```bash
bun run dev          # Dev server (http://localhost:3000)
bun run build        # Production build
bun run start        # Start production server
bun run lint         # ESLint
```

## Structure

```
app/
  page.tsx           # Main landing page (client component)
  layout.tsx         # Root layout with metadata
  globals.css        # Global styles, grid/scanline animations
tailwind.config.ts   # Theme: deep-black, neon-cyan, Space Mono + Inter
```

## Design System

- **Background:** Deep black (#0a0a0a)
- **Accent:** Neon cyan (#00ffff)
- **Display font:** Space Mono (monospace)
- **Body font:** Inter (sans-serif)
- **Effects:** Animated grid background, CRT scanline overlay, terminal prompt header
