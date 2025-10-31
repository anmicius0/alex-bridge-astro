# Bridge mit Alexander — Maintenance Guide

[![Astro](https://img.shields.io/badge/Astro-v5-blue?logo=astro)](https://astro.build)
[![Vercel](https://img.shields.io/badge/Adapter-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

A small, maintainable Astro website for "Bridge mit Alexander". This README focuses on maintenance: how the project is organized, the maintenance logic, common tasks, and troubleshooting steps for operators and developers.

## Quick start

All commands run from the project root.

- Install dependencies:

```bash
bun install
```

- Start local development (Astro + SASS watcher):

```bash
bun run dev
```

- Build for production:

```bash
bun run build
```

- Preview the production build locally:

```bash
bun run preview
```

Notes: This project uses Bun as the package manager. Use `bun run <script>` for all scripts.

## What this project contains

- `src/pages` — route pages (news, holiday, file, user, api)
- `src/content` — markdown content used by Astro Content Collections (news, holiday, file)
- `src/components` — UI components organized by feature (ui, layout, home, content)
- `src/lib` — helpers and low-level utilities (api, ui, validation)
- `src/services` — business logic and content helpers (e.g., slug generation)
- `src/assets` — images processed by Astro (optimized)
- `public` — static assets (site manifest, admin config, downloadable files)
- `src/content.config.ts` — Astro content collections (schemas)
- `src/middleware.ts` — route protection middleware
- `src/pages/api` — API routes

## Maintenance logic — principles and responsibilities

This site follows clear separation of concerns so maintenance tasks are predictable:

- UI is isolated under `src/components/*` and should contain only presentational code.
- Business logic (content processing, slug generation) lives in `src/services/*`.
- Small reusable helpers and platform-specific utilities live in `src/lib/*` grouped by purpose: `api/`, `ui/`, `validation/`.
- Static assets that should be optimized are placed in `src/assets/` (Astro processes them). Files that must be served raw stay in `public/`.

File-move rationale you might see in this repo:

- Move helpers that are domain-specific (content slug resolution) to `src/services/` to emphasize they are part of content handling.
- Move small utilities intended for reuse across apps to `src/lib/`.

If you add new code, ask: is it purely display (components), domain logic (services), or a small general helper (lib)? Place accordingly.

## How-to: Common maintenance tasks

1. Add a new content type (e.g., `events`):
   - Update `src/content.config.ts` and add a new collection using `defineCollection`.
   - Create `src/content/events/` and add markdown files with frontmatter.
   - Update `public/admin/config.yml` to expose the new collection in Decap CMS.
   - Add or reuse components in `src/components/content/` if presentation differs.

2. Add or update a CMS field:
   - Edit `public/admin/config.yml` (editor config) and test locally via `/admin.html`.
   - If CMS uploads media, ensure `public/files/` is writable by the CMS backend you use.

3. Fix an API route or add a new one:
   - Write routes under `src/pages/api/`.
   - Use `src/lib/api/cors.ts` and `src/lib/api/error-handler.ts` for consistent headers and errors.
   - Keep business logic in `src/services/` and call from the API route to keep handlers thin.

4. Update image assets for optimization:
   - Put images in `src/assets/` and import them with `astro:assets` to enable optimization (responsive sizes, compression).
   - Use `public/` for files that must be served unmodified (e.g., CMS uploads, manifest icons).

## Environment variables

Client-safe (must be prefixed with `PUBLIC_`):

- `PUBLIC_APP_ORIGIN` (optional — used by CORS helper)

Server-side secrets (keep secret):

- Any provider-specific server keys (set on your deployment platform)

Tip: `src/lib/env.ts` (if present) validates critical server env vars at startup and reports missing values.

## Project structure quick map (for maintainers)

- src/
  - components/
  - ui/ (Button, Input, DateDisplay)
  - layout/ (Header, Footer, MenuButton)
  - home/ (Hero, FeaturesGrid)
  - content/ (Card)
  - lib/
  - api/ (cors.ts, error-handler.ts)
  - ui/ (mobile-menu.ts, smooth-scroll.ts)
  - services/
  - content-slug.ts
  - content/ (news, holiday, file)
  - pages/ (routes and api)
  - assets/ (images optimized by Astro)

## Troubleshooting

- Build errors about missing env vars: check server-side variables. The build or runtime will fail if required server secrets are missing.

- If you removed an external provider, ensure no provider-specific env vars remain referenced in code or deployment settings.

- Broken imports after a refactor: the codebase uses grouped directories. Use `rg 'components/molecules|components/atoms|services/content-slug'` to find references and update imports to their new homes.

## Developer checklist (daily maintenance)

- Pull latest, run tests (if any), and run a local dev server.
- Check `src/content` for newly added markdown that needs review or image uploads.
- When reviewing PRs, verify that: UI changes are limited to `src/components/*`, business logic to `src/services/*`, and small helpers to `src/lib/*`.
- Update `public/admin/config.yml` carefully when changing collection fields.

## CI / Deploy notes

- Default adapter is Vercel (`astro.config.mjs`). Ensure env vars for server secrets are configured in Vercel.
- Build command: `bun run build`.

---

If you want, I can:

- Add a small `.env.example` file listing required env vars.
- Add a short PR checklist to `CONTRIBUTING.md` for maintainers.
- Run a local build to confirm everything (I can run it for you and report errors if any).
