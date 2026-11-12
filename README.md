# NITYA — React + TypeScript starter

A responsive frontend foundation for NITYA, built with Vite, React, TypeScript, React Router, CSS and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run typecheck
npm run build
```

## Structure

- `src/components/<Component>/index.tsx` and `index.css`: reusable UI components.
- `src/pages/<Page>/`: route-level screens.
- `src/layouts/`: shared application shells.
- `src/features/`: domain logic, grouped by feature.
- `src/assets/`: imported assets and asset documentation.
- `public/images/`: replaceable SVG artwork referenced by stable paths.
- `src/styles/`: design tokens, global styles and responsive rules.

## Current scope

Implemented starter screens: Home, Explore, My Growth (Journey / Learnings / Practice Log tabs), Account, and a four-step lesson experience. The initial sample data is local and illustrative. Backend persistence, authentication, editorially verified lesson content, and final milestone acceptance thresholds are not connected yet.

## Lotus milestone safety

`src/utils/lotus.ts` deliberately implements only the approved Seed → Sprout gate: a user remains at Seed until at least one qualifying learning journey is completed. Later milestone qualification is intentionally not inferred from activity counters; it must be defined in backend acceptance criteria before automatic progression is enabled.

## Replaceable artwork

Replace `public/images/landscape.svg` and the files under `public/images/lotus/` while keeping their filenames, or update the corresponding asset references in one place.
