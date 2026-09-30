# AGENTS.md — Portfolio Builder

A web app where a visitor fills in a form, picks one of two portfolio templates, and gets a
generated portfolio site. Portfolios are viewable at `<slug>.<ROOT_DOMAIN>` (localhost for now)
and downloadable as a static ZIP for self-hosting. **No accounts, no subscriptions, no payments.**

## Read these first (before planning any task)
- `docs/PRD.md` — what we are building and what is out of scope
- `docs/ARCHITECTURE.md` — structure, rendering + export design, routing
- `docs/DATA_SCHEMA.md` — Zod schema and DB model (single source of truth for data)
- `docs/TEMPLATES.md` — how to port the two reference portfolios into templates
- `docs/TASKS.md` — phased plan; work one phase at a time

## Stack
Next.js (App Router, latest stable) · TypeScript (strict) · Tailwind CSS (app UI only) ·
Zod + React Hook Form · Prisma + SQLite · sharp (image processing) · archiver (ZIP export).
Before installing or configuring any library, check its current official docs — APIs change
between major versions. Do not rely on memory for setup steps.

## Commands
Fill these in during Phase 0 and keep them accurate.
```
npm run dev         # local dev server
npm run build       # production build (must pass)
npm run lint        # ESLint (must pass)
npm run typecheck   # tsc --noEmit (must pass)
npm run test        # unit tests (Vitest)
npx prisma migrate dev
```

## Workflow (follow for every task)
1. **Explore** — read relevant files and docs. Do not write code yet.
2. **Plan** — state a short plan and list the files you'll create/change. Wait for approval on
   anything touching the DB schema, the data schema, or the template contract.
3. **Implement** — small, focused changes. One phase at a time from `docs/TASKS.md`.
4. **Verify** — run `typecheck`, `lint`, `test`, and `build`. Then run the app and check the
   feature manually. Never say a task is done without running these.
5. **Report** — summarize what changed, what you verified, and anything left open.

## Code standards
- TypeScript strict; no `any` (use `unknown` + narrowing or Zod parsing).
- Validate all external input (forms, API bodies, uploads) with the Zod schema in
  `src/lib/schema/portfolio.ts`. The client and server must share the same schema.
- Server logic lives in `src/lib/` or route handlers/server actions, never inside components.
- Components are small and typed. Prefer Server Components; add `"use client"` only when needed.
- Comment the *why*, not the *what*. Keep functions short and named clearly.
- Handle errors explicitly and return user-friendly messages. No silent catches.
- Use environment variables for config (`ROOT_DOMAIN`, `DATABASE_URL`). Never hard-code domains.

## Security rules (non-negotiable)
- Never render user content with `dangerouslySetInnerHTML`. Escape everything.
- Only allow `https://` (or `mailto:`) URLs in user-supplied links.
- Validate uploads: allowed MIME types (jpeg/png/webp), max 2 MB, re-encode with sharp,
  generate random filenames. Never trust the uploaded filename or extension.
- Reserved slugs (`www`, `api`, `admin`, `app`, `_next`, etc.) must be rejected.
- Edit tokens are shown once and stored only as a hash.

## Boundaries
**Always:** run verification before finishing; keep templates pure and static-exportable;
follow the schema in `docs/DATA_SCHEMA.md`.
**Ask first:** adding a new dependency; changing the DB schema or the `PortfolioData` type;
changing the template contract; deleting files.
**Never:** modify anything inside `references/` (read-only); add auth/accounts/payments;
commit secrets or `.env`; skip failing tests or lint errors by disabling them.

## Out of scope (do not build)
User accounts, login, subscriptions/payments, custom domains, analytics, CMS features,
more than two templates, AI content generation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
