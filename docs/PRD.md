# PRD — Portfolio Builder

## Goal
Let anyone create a professional portfolio site in a few minutes: fill a form, pick a template,
preview it, then either get a live link or download a static site to host themselves.

## Users and flow (no accounts)
1. Visitor lands on the home page and sees both template previews.
2. Visitor picks **Template A** or **Template B**.
3. Visitor fills a multi-step form (details below) with live validation.
4. Visitor sees a **live preview** (rendered by the chosen template, using the form data).
5. Visitor chooses a slug (e.g. `john`) → availability is checked in real time.
6. Visitor clicks **Publish** → portfolio is saved and available at
   `http://john.localhost:3000` (later `https://john.<our-domain>`).
7. Visitor sees a success screen with: the live URL, a **Download ZIP** button, and a one-time
   **edit token** with a warning to save it.
8. To edit later, visitor goes to `/edit` and enters slug + edit token. (No login.)

## Form sections (fields defined in `docs/DATA_SCHEMA.md`)
- Basics: full name, professional title, short bio, location, profile photo
- Contact & socials: email, phone (optional), GitHub, LinkedIn, Twitter/X, website
- Skills: list with optional category/level
- Experience: company, role, dates, description
- Education: institution, degree, dates
- Projects: title, description, tech tags, live link, repo link, image
- Optional: resume/CV link (URL only, no file upload for now)

## Functional requirements
- **FR1** Two templates, ported from the reference portfolios, selectable per portfolio.
- **FR2** Live preview identical to the final published page (same render function).
- **FR3** Publish to `<slug>.<ROOT_DOMAIN>`; locally works via `*.localhost`; path fallback
  `/p/<slug>` must also work.
- **FR4** Export to ZIP: a self-contained static site (`index.html`, `styles.css`, `assets/`,
  `README.txt`) that opens by double-clicking `index.html` and works on any static host.
- **FR5** Edit/delete an existing portfolio using its edit token.
- **FR6** Slug rules: 3–30 chars, lowercase letters/numbers/hyphens, unique, not reserved.
- **FR7** Responsive (mobile-first) and accessible (semantic HTML, alt text, contrast, keyboard).
- **FR8** Basic SEO on generated pages: title, meta description, Open Graph tags.

## Non-functional requirements
- Simple to run locally: `npm install && npx prisma migrate dev && npm run dev`.
- Generated portfolio pages need no client-side framework to display (static-friendly).
- Sensible limits: max 12 projects, 10 experience entries, 30 skills, 2 MB per image.
- Basic rate limiting on publish/upload endpoints.

## Out of scope (for now)
Accounts/login, payments, custom domains, analytics, more templates, AI writing help,
resume file uploads, multi-language support, email sending.

## Definition of done (MVP)
A tester can create a portfolio with each template, view it at `name.localhost:3000`,
download the ZIP, unzip it, and open it offline with identical appearance.
