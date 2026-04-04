# Easy DevOps Documentation Site

A world-class documentation site for the Easy DevOps CLI tool, built with Next.js 15.

## Tech Stack

- **Next.js 15** — App Router, React Server Components
- **TypeScript** — Fully typed
- **Tailwind CSS v3** — Styling
- **next-themes** — Dark/light mode
- **react-syntax-highlighter** — Code block syntax highlighting
- **framer-motion** — Animations
- **lucide-react** — Icons

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
app/
├── layout.tsx          — Root layout (fonts, theme provider, global styles)
├── page.tsx            — Landing/marketing page with animated hero
└── docs/
    ├── layout.tsx      — Docs layout (sidebar + theme toggle)
    ├── page.tsx        — Redirects to /docs/overview
    ├── overview/       — Overview page
    ├── features/       — Features page
    ├── installation/   — Installation page with OS tabs
    ├── quickstart/     — Quick start guide
    ├── commands/       — Command reference with search/filter
    ├── ssl/            — SSL Manager documentation
    ├── api/            — Dashboard API reference
    ├── configuration/  — Configuration reference
    ├── platform/       — Platform support matrix
    └── faq/            — FAQ & Troubleshooting

components/
├── CodeBlock.tsx       — Syntax-highlighted code with copy
├── CmdTable.tsx        — Searchable command reference table
├── InstallTabs.tsx     — OS-specific installation tabs (auto-detects OS)
├── Accordion.tsx       — FAQ accordion component
├── DocsPagination.tsx  — Prev/Next navigation between docs pages
├── DocsSidebar.tsx     — Collapsible sidebar with active page highlighting
├── TableOfContents.tsx — Right-side floating TOC
├── MotionSection.tsx   — Scroll-triggered animation wrapper
└── Navbar.tsx          — Landing page navbar
```

## Deploy

Deploy to Vercel:

```bash
vercel deploy --prod
```

Or build static files:

```bash
npm run build
```

## License

MIT
