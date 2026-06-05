# Harmonizing the Foundation

An interactive executive briefing on why **Master Data Management** and **Databricks** must coexist — anchored on a single rotary-kiln shutdown scenario across three plants.

## Layout

```
.
├── design-flow.md          # Original product requirement document
├── app/                    # The React + Vite app — what gets deployed
│   ├── src/
│   │   ├── App.jsx
│   │   ├── slides/         # 5 slides, one per file
│   │   └── index.css       # Theme tokens (light + dark)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Deck

1. **Title** — Anchors on the K-101 shutdown
2. **The BOM** — 15 SKUs for what's actually 5 parts
3. **MDM at Work** — Match → Approve → Publish, with stewardship AI agents
4. **Two Systems** — System of Record + System of Intelligence
5. **Architecture** — Per-source ODS → parallel MDM/Bronze lanes → Gold → Analytics

Light/dark theme toggle in the top right. Keyboard navigation: ← / → / Home / End.

## Run locally

```bash
cd app
npm install
npm run dev
```

The dev server starts at http://localhost:5173.

## Build

```bash
cd app
npm run build      # outputs to app/dist
npm run preview    # serves the production build locally
```

## Deploy on Vercel

This repo is configured so Vercel deploys the `app/` subdirectory.

1. Import the repo at https://vercel.com/new
2. Set **Root Directory** to `app`
3. Framework preset auto-detects as **Vite**
4. Leave Build Command, Output Directory, and Install Command at their Vite defaults
5. Click Deploy

Future commits to `main` auto-deploy.

## Tech

React 19 · Vite · Tailwind CSS 3 · Framer Motion · lucide-react
