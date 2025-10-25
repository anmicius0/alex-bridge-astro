# Bridge mit Alexander — Maintenance Guide

This repository is an Astro site (Astro v5) with server output, Firebase authentication (admin + client), and Decap CMS (Decap/Netlify-CMS) for content editing.

Keep this README short and focused on maintenance tasks developers or operators need.

## Quick scripts

All commands run from the project root.

- Install dependencies:

```bash
bun install
```

- Start local dev (Astro + SASS watcher):

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

Notes: scripts are defined in `package.json`. The project uses Bun in examples but standard npm/yarn/pnpm will work if you adapt the commands.

## Important files & folders

- `src/pages` — route pages (news, holiday, file, user, api)
- `src/content` — markdown content used by Astro Content Collections (news, holiday, file)
- `src/components` — UI components (atoms / molecules)
- `src/firebase` — Firebase client (`client.ts`) and server/admin (`server.ts`) setup
- `src/lib` — helpers (CORS, env validation, error handling, slug helper)
- `public/files` — uploaded media and downloads referenced by content
- `public/admin/config.yml` — Decap CMS configuration
- `src/content.config.ts` — Astro content collections (schemas)

## Environment variables

Client-safe (must be PUBLIC\_ for Vite/Astro to expose to browser):

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`
- `PUBLIC_APP_ORIGIN` (optional — used by CORS helper)

Server / Firebase Admin (must be kept secret, set on the host / platform env):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY` (PEM string; newlines may be escaped — code replaces `\\n` with real newlines)
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`

Tip: `src/lib/env.ts` validates the presence of Admin env vars at server startup and logs a warning if the private key appears misformatted.

## Firebase setup

1. Create a Firebase project and generate a service account private key (Project Settings → Service accounts → Generate new private key).
2. Add the private key fields to your deployment environment. If using Vercel/Netlify, paste the multiline key but replace real newlines with `\n` (the code will unescape them).
3. Client config values (PUBLIC\_\*) go to the client environment variables so `src/firebase/client.ts` can initialize Firebase in the browser.
4. Server uses `firebase-admin` in `src/firebase/server.ts` to verify tokens and create session cookies.

Security note: Never commit `FIREBASE_PRIVATE_KEY` or other secrets to git.

## Content editing (Decap CMS)

- Decap (Netlify) CMS is configured in `public/admin/config.yml`. It writes to `src/content/{news,file,holiday}` and uploads media to `public/files`.
- Access the CMS UI at `/admin.html` when running the site (you may need the authentication backend configured in `config.yml`).

## APIs and auth

- Server routes: `src/pages/api/auth/*` — register, login, logout using Firebase Admin
- Helpers: `src/lib/cors.ts`, `src/lib/errorHandler.ts`
- Session cookie name used: `__session`

## Common maintenance tasks

- Add a new content type: update `src/content.config.ts` with a new collection, add a schema with `zod`, and add a folder under `src/content`.
- Update CMS fields: modify `public/admin/config.yml` to include the new collection and field definitions.
- Add environment variables in your deployment platform (Vercel, Netlify, etc.) before enabling auth features.

## Deploying

- This project is configured to use the Vercel adapter (`@astrojs/vercel`) in `astro.config.mjs`.
- On Vercel: make sure the server-side env vars (Firebase Admin) are set in the project settings. Build command is `bun run build` (or `npm run build`).

## Troubleshooting

- Build errors about missing env vars: verify Admin variables are present and non-empty; `src/lib/env.ts` throws a clear error listing any missing variables.
- Firebase private key PEM errors: ensure `FIREBASE_PRIVATE_KEY` contains `-----BEGIN PRIVATE KEY-----` or was uploaded with `\n` escaped (the code unescapes it).
- CMS unable to write files: make sure the repo/branch configured in `public/admin/config.yml` is accessible and the Git Gateway / backend is set up.

## Notes for contributors

- Keep UI components small and testable (see `src/components/atoms` and `molecules`).
- Use the `src/lib/errorHandler.ts` helpers for consistent logging and to return sanitized messages to clients.

---

If you'd like, I can also add a short developer checklist (local env example, sample .env template) or update the CMS config to remove placeholder secrets in `public/admin/config.yml`.
