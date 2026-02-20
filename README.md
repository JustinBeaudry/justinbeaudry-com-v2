# Justin Beaudry - Personal Website v2

A Next.js personal website with a **Cyberpunk Noir** aesthetic inspired by William Gibson's industrial futurism.

## 🎨 Design Features

- **Deep Black Background** (#0a0a0a) with subtle neon cyan accents (#00ffff)
- **Animated Grid Background** - Scrolling cyberpunk-style grid overlay
- **Scanline Effect** - Subtle CRT monitor scanline animation
- **Terminal-Inspired UI** - Command prompt header with blinking cursor
- **Typography** - Space Mono (headers) and Inter (body text)
- **Framer Motion Animations** - Smooth entrance animations for content

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## 🚀 Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
justinbeaudry-com-v2/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles & animations
├── tailwind.config.ts    # Tailwind theme configuration
└── package.json
```

## 🎯 Key Components

- **Terminal Header** - Animated command prompt with location
- **Bio Section** - Formatted professional bio with highlighted keywords
- **Data Overlay** - Status indicators (location, online status)
- **Corner Accents** - Decorative border elements

## 📝 Customization

### Colors
Edit `tailwind.config.ts` to modify the color scheme:
```typescript
colors: {
  'deep-black': '#0a0a0a',
  'neon-cyan': '#00ffff',
}
```

### Animations
Modify animation speeds in `globals.css`:
- `grid-scroll` - Grid movement speed
- `scanline` - Scanline animation speed

---

**Built with AI-first tooling** | [Toledo Codes](https://toledocodes.org) | [AI Collective](https://www.aicollective.us/)
