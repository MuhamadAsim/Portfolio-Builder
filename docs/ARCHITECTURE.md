# ARCHITECTURE

## Core idea
A template is a **pure function of data**: `PortfolioData → static HTML + CSS`.
The same template powers three things, so nothing is built twice:
1. Live preview in the builder
2. The published page at `<slug>.<ROOT_DOMAIN>`
3. The downloadable ZIP export

## Folder structure
```
references/                  # READ-ONLY. The two original portfolios (do not edit)
src/
  app/
    page.tsx                 # Home: template chooser
    create/                  # Multi-step form + live preview
    edit/                    # Slug + edit token entry, then edit form
    p/[slug]/page.tsx        # Path-based portfolio view (dev fallback)
    _sites/[slug]/page.tsx   # Subdomain target (rewritten to by proxy/middleware)
    api/
      portfolios/route.ts            # POST create
      portfolios/[slug]/route.ts     # GET (edit) / PUT / DELETE (requires edit token)
      portfolios/[slug]/export/route.ts  # GET -> ZIP
      slug-check/route.ts            # GET availability
      upload/route.ts                # POST image upload
  templates/
    types.ts                 # Template contract
    registry.ts              # id -> template map
    template-a/              # Ported from reference A
      index.tsx              # export function render(data): ReactElement
      styles.css             # PLAIN CSS, self-contained (no Tailwind)
      assets/
    template-b/              # Ported from reference B (same structure)
  lib/
    schema/portfolio.ts      # Zod schema = single source of truth
    db.ts                    # Prisma client
    slug.ts                  # validation + reserved words
    tokens.ts                # generate + hash edit tokens
    images.ts                # sharp processing
    export/buildZip.ts       # render -> static HTML -> ZIP
    rate-limit.ts
  components/                # App UI only (form, stepper, template cards)
prisma/schema.prisma
uploads/                     # Runtime image storage (gitignored)
```

## Template contract (`src/templates/types.ts`)
```ts
export interface PortfolioTemplate {
  id: 'template-a' | 'template-b';
  name: string;
  description: string;
  previewImage: string;
  /** Pure: same input -> same output. No fetching, no DB, no browser APIs. */
  render(data: PortfolioData, opts: { assetBase: string }): React.ReactElement;
  /** In-memory plain scoped CSS string. Works for server pages, iframe srcDoc, and ZIP export. */
  css: string;
}
```
Rules for templates:
- Output must be static HTML. Interactivity (mobile menu, dark-mode toggle, smooth scroll) uses
  a tiny inline vanilla `<script>` — no React hydration required on generated pages.
- Styling is a **plain CSS string per template**, not Tailwind, so the export can ship it as-is.
- Images are referenced via `assetBase` (`/uploads/...` live, `./assets/...` in the ZIP).
- Never use `dangerouslySetInnerHTML` with user data. Escape everything.
- Handle missing optional sections gracefully (hide the section, don't render empty headings).

## Rendering
- **Live/published:** served by a route handler returning a full static HTML string (not a React
  Server Component), so client interaction scripts run naturally without React hydration overhead,
  and the exact same static HTML string is reused for ZIP export. Note: A Content Security Policy (CSP)
  header is planned for Phase 6.
- **Preview:** the builder calls the same `render` on the client-side form state (render is pure,
  so it is safe in both environments). Show it in an `<iframe srcDoc>` to isolate template CSS
  from app CSS.
- **Export:** `renderToStaticMarkup(template.render(data, { assetBase: './assets' }))` → wrap in
  a full HTML document → write `index.html`, copy `styles.css`, copy only the images this
  portfolio uses into `assets/`, add `README.txt` (hosting instructions for Netlify/GitHub
  Pages/Vercel) → stream as ZIP.

## Subdomain routing
- `ROOT_DOMAIN` env var (`localhost:3000` in dev).
- Middleware (Next.js 16 renamed this convention to `proxy` — check the installed version's
  docs) reads the `Host` header. If host is `<slug>.<ROOT_DOMAIN>` and slug isn't reserved,
  rewrite to `/_sites/<slug>`. If host is the bare root domain, do nothing.
- Chrome and Firefox resolve `*.localhost` to 127.0.0.1 automatically, so
  `http://john.localhost:3000` works with no config. Also support `/p/<slug>` as a fallback
  (Safari, or tools that don't resolve `*.localhost`).
- In production later: wildcard DNS `*.yourdomain.com` + wildcard SSL, pointing at the app.

## Data and storage
- SQLite via Prisma (`prisma/dev.db`). Portfolio content is stored as validated JSON text in one
  column (see `docs/DATA_SCHEMA.md`). This keeps the schema stable while templates evolve.
- Images on local disk under `uploads/<portfolioId>/<random>.webp`. Keep storage behind a
  small interface in `images.ts` so it can move to S3/R2 later without touching callers.

## Edit access without accounts
On create, generate a random edit token (≥32 bytes, base64url). Show it once. Store only a
SHA-256 hash. `PUT`/`DELETE` require the token in a header; compare hashes with a
constant-time check.

## Key decisions (and why)
| Decision | Reason |
|---|---|
| Template = pure function | One implementation serves preview, publish, and export |
| Plain CSS per template | Export works without a build step; easy to hand to users |
| JSON column for content | Fewer migrations as fields evolve; Zod guards integrity |
| Path fallback `/p/[slug]` | Subdomains on localhost aren't universal |
| Edit token instead of accounts | Meets "no accounts" requirement with minimal risk |
