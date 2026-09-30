# TEMPLATES — porting the two reference portfolios

## Reference sources (READ-ONLY — never edit)
- `references/portfolio-react/`   → becomes **template-a**
- `references/portfolio-nextjs/`  → becomes **template-b**

> Folder names above are placeholders. Adjust to match the real folders before starting.

## Step 1 — Audit (do this before writing any code)
For each reference, produce a short audit and wait for approval:
- Sections present (hero, about, skills, projects, experience, contact, ...)
- Every piece of hard-coded content that must become a data field
- Fonts, color palette, spacing, animations, dark mode support
- Dependencies used (UI libs, icon sets, animation libs)
- Anything that needs client-side JS
- Fields that don't exist in `docs/DATA_SCHEMA.md` (list them; don't add them yet)

## Step 2 — Port rules
1. Recreate the **visual design faithfully** (layout, typography, colors, spacing, hover states).
   Preserve the look; rebuild the implementation.
2. Replace all hard-coded content with fields from `PortfolioData`.
3. Convert styling to **one plain CSS file** (`styles.css`) with CSS custom properties for
   colors and fonts. If the reference uses Tailwind or CSS-in-JS, translate it to plain CSS.
   Scope selectors under a root class (`.tpl-a`, `.tpl-b`) to avoid collisions.
4. Remove runtime dependencies from the output. Replace animation libraries and icon
   packages with CSS animations and inline SVG icons.
5. Fonts: use system font stacks or self-hosted font files copied into `assets/`. Do not
   depend on a CDN, since exports must work offline. (Google Fonts links are acceptable only
   if you document it in the export README — prefer self-hosting.)
6. Interactivity (mobile nav, theme toggle, scroll effects) → small vanilla `<script>` inlined
   in the template output. Keep under ~2 KB.
7. Every section is optional except basics + contact. If `projects` is empty, don't render the
   Projects heading or nav link. Nav links must reflect only the sections that exist.
8. Accessibility: semantic landmarks (`header/main/section/footer`), heading order, `alt` text
   from the person's name or project title, visible focus states, AA color contrast.
9. Add `<title>`, meta description, and Open Graph tags from `basics`.
10. Sample data: create `src/templates/sample-data.ts` with one realistic `PortfolioData`
    object used for previews, tests, and the home page template cards.

## Step 3 — Verify each template
- Renders with the sample data, with a minimal dataset (only required fields), and with a
  maximal dataset (all limits reached, long text, special characters like `<script>` and `&`).
- User-supplied `<script>alert(1)</script>` in every text field renders as visible text.
- Looks correct at 360px, 768px, and 1280px widths.
- The exported ZIP opens offline via `index.html` and looks identical to the live page.
- Lighthouse accessibility score ≥ 90.

## Template card metadata (for the chooser page)
Each template provides: `id`, `name`, `description` (one line), and a `previewImage`
screenshot generated from the sample data.
