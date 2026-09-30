# TASKS — phased plan

Work **one phase at a time**. At the end of each phase: run `typecheck`, `lint`, `test`,
`build`, do a manual check, report, and **stop for approval** before starting the next phase.
Mark tasks `[x]` as they are completed.

## Phase 0 — Setup
- [x] Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint) in the project root.
      Keep `references/`, `AGENTS.md`, and `docs/` in place.
- [x] Add Prisma + SQLite, Zod, React Hook Form, sharp, archiver, Vitest (check current docs).
- [x] Add `.env.example` (`DATABASE_URL`, `ROOT_DOMAIN=localhost:3000`) and gitignore
      `.env`, `prisma/*.db`, `uploads/`.
- [x] Add npm scripts (`typecheck`, `test`) and update the Commands section in `AGENTS.md`.
- [x] Verify: app boots, build passes.

## Phase 1 — Reference audit (no code)
- [x] Audit both reference portfolios per `docs/TEMPLATES.md` Step 1.
- [x] Report: sections, hard-coded content, dependencies, missing schema fields.
- [x] Propose schema additions if needed. **Wait for approval.**

## Phase 2 — Data layer
- [x] Implement `src/lib/schema/portfolio.ts` per `docs/DATA_SCHEMA.md` (with approved changes).
- [x] Prisma model + first migration.
- [x] `slug.ts` (validation + reserved words), `tokens.ts` (generate/hash/verify).
- [x] Unit tests for slug rules, token hashing, and schema edge cases.


## Phase 3 — Template A
- [x] Define the template contract and registry.
- [x] Create sample data.
- [x] Port reference A into `src/templates/template-a/` (pure render + plain CSS).
- [x] Temporary dev route to render it with sample data. Run the template verification
      checklist (minimal / maximal / XSS / responsive).

## Phase 4 — Template B
- [x] Port reference B into `src/templates/template-b/` with the same contract and checks.

## Phase 5 — Builder UI
- [x] Home page with both template cards and previews.
- [x] Multi-step form (React Hook Form + shared Zod schema), add/remove list items.
- [x] Image upload endpoint + client component (validation, sharp re-encode, size limit).
- [x] Live preview via `<iframe srcDoc>` using the chosen template's `render`.
- [x] Slug field with debounced availability check.

## Phase 6 — Publish and view
- [x] `POST /api/portfolios`: validate, create, return slug + one-time edit token.
- [x] Success screen: live URL, Download ZIP button, edit token with copy button + warning.
- [x] `/p/[slug]` and `_sites/[slug]` pages, plus subdomain rewrite in middleware/proxy.
- [x] Verify `http://<slug>.localhost:3000` in Chrome and the `/p/<slug>` fallback.
- [x] 404 page for unknown slugs.

## Phase 7 — Export
- [ ] `GET /api/portfolios/[slug]/export` → ZIP (`index.html`, `styles.css`, `assets/`,
      `README.txt` with Netlify / GitHub Pages / Vercel steps).
- [ ] Test: unzip, open `index.html` offline, compare visually to the live page.

## Phase 8 — Edit and delete
- [ ] `/edit` page: slug + token → load data into the form.
- [ ] `PUT` and `DELETE` endpoints with token check (constant-time compare).
- [ ] Delete also removes the portfolio's uploaded images.

## Phase 9 — Hardening and polish
- [ ] Rate limiting on publish, upload, and slug-check.
- [ ] Security review against the rules in `AGENTS.md` (XSS, URL validation, upload checks).
- [ ] Remove temporary dev preview route (`/preview`) before final release.
- [ ] Error and empty states, loading states, accessibility pass, mobile pass.
- [ ] Root `README.md`: setup, env vars, how subdomains work locally, how to deploy later
      (wildcard DNS + SSL).
- [ ] Final full verification of the Definition of Done in `docs/PRD.md`.
