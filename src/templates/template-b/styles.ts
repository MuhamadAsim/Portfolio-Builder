export const templateBCss = `
/* ==========================================================================
   Template B — Neo-Pop / Neo-Brutalist Scoped Stylesheet (.tpl-b)
   Zero runtime dependencies, WCAG AA contrast, dark mode, forced-colors safe.
   ========================================================================== */

.tpl-b {
  /* ── Light Mode Color Tokens (Default) ── */
  --tpl-b-bg: #faf8f5;
  --tpl-b-fg: #1e1b2e;             /* Contrast vs #faf8f5: 15.2:1 (WCAG AAA) */
  --tpl-b-muted: #4a5568;          /* Contrast vs #faf8f5: 7.5:1 (WCAG AAA) */
  --tpl-b-card-bg: #ffffff;        /* Contrast vs #1e1b2e: 16.1:1 (WCAG AAA) */
  --tpl-b-border: #1e1b2e;
  --tpl-b-shadow: 4px 4px 0px #1e1b2e;
  --tpl-b-shadow-lg: 6px 6px 0px #1e1b2e;
  --tpl-b-shadow-sm: 2px 2px 0px #1e1b2e;
  --tpl-b-shadow-hover: 7px 7px 0px #1e1b2e;

  /* Accent Fills & Borders (Text on fills meets WCAG AA >= 4.5:1) */
  --tpl-b-accent-violet: #6d28d9;  /* Contrast with white: 7.6:1 */
  --tpl-b-accent-orange: #c2410c;  /* Contrast with #faf8f5: 4.9:1, white: 4.8:1 */
  --tpl-b-accent-emerald: #047857; /* Contrast with white: 5.1:1 */
  --tpl-b-accent-tape: #a7f3d0;    /* Light mint tape background */
  --tpl-b-pill-bg: #f1f5f9;

  --tpl-b-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  --tpl-b-radius-sm: 0.5rem;
  --tpl-b-radius-md: 1rem;
  --tpl-b-radius-lg: 1.5rem;
  --tpl-b-radius-full: 9999px;

  font-family: var(--tpl-b-font);
  color: var(--tpl-b-fg);
  background-color: var(--tpl-b-bg);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.tpl-b *,
.tpl-b *::before,
.tpl-b *::after {
  box-sizing: inherit;
}

/* ── Dark Mode Overrides (Explicit Attribute OR No-JS Media Query) ── */
.tpl-b[data-theme="dark"] {
  --tpl-b-bg: #12101e;
  --tpl-b-fg: #f8fafc;             /* Contrast vs #12101e: 17.7:1 (WCAG AAA) */
  --tpl-b-muted: #cbd5e1;          /* Contrast vs #12101e: 12.6:1 (WCAG AAA) */
  --tpl-b-card-bg: #1a172a;        /* Contrast vs #f8fafc: 16.1:1 (WCAG AAA) */
  --tpl-b-border: #ffffff;
  --tpl-b-shadow: 4px 4px 0px #ffffff;
  --tpl-b-shadow-lg: 6px 6px 0px #ffffff;
  --tpl-b-shadow-sm: 2px 2px 0px #ffffff;
  --tpl-b-shadow-hover: 7px 7px 0px #ffffff;

  --tpl-b-accent-violet: #7c3aed;  /* Contrast with white: 5.5:1 */
  --tpl-b-accent-orange: #f97316;  /* Contrast vs #12101e: 6.5:1 (large text) */
  --tpl-b-accent-emerald: #10b981;
  --tpl-b-accent-tape: #064e3b;
  --tpl-b-pill-bg: #1e1b2e;
}

@media (prefers-color-scheme: dark) {
  .tpl-b:not([data-theme="light"]) {
    --tpl-b-bg: #12101e;
    --tpl-b-fg: #f8fafc;
    --tpl-b-muted: #cbd5e1;
    --tpl-b-card-bg: #1a172a;
    --tpl-b-border: #ffffff;
    --tpl-b-shadow: 4px 4px 0px #ffffff;
    --tpl-b-shadow-lg: 6px 6px 0px #ffffff;
    --tpl-b-shadow-sm: 2px 2px 0px #ffffff;
    --tpl-b-shadow-hover: 7px 7px 0px #ffffff;

    --tpl-b-accent-violet: #7c3aed;
    --tpl-b-accent-orange: #f97316;
    --tpl-b-accent-emerald: #10b981;
    --tpl-b-accent-tape: #064e3b;
    --tpl-b-pill-bg: #1e1b2e;
  }
}

/* --------------------------------------------------------------------------
   Layout & Container
   -------------------------------------------------------------------------- */
.tpl-b .tpl-container {
  width: 100%;
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.tpl-b .tpl-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
  position: relative;
}

@media (max-width: 640px) {
  .tpl-b .tpl-section {
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;
  }
}

.tpl-b .tpl-header-block {
  text-align: left;
  margin-bottom: 3rem;
}

.tpl-b .tpl-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffffff;
  background: var(--tpl-b-accent-emerald);
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  margin-bottom: 0.85rem;
}

.tpl-b .tpl-title {
  font-size: 2.75rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem 0;
  line-height: 1.15;
}

@media (max-width: 640px) {
  .tpl-b .tpl-title {
    font-size: 2rem;
  }
}

.tpl-b .tpl-subtitle {
  font-size: 1.1rem;
  color: var(--tpl-b-muted);
  font-weight: 500;
  margin: 0;
}

/* --------------------------------------------------------------------------
   Floating Pill Navbar
   -------------------------------------------------------------------------- */
.tpl-b .tpl-nav-wrap {
  position: sticky;
  top: 1rem;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.tpl-b .tpl-nav-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-full);
  padding: 0.5rem 1rem;
  max-width: 980px;
  width: 100%;
}

.tpl-b .tpl-brand-pill {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  text-decoration: none;
  white-space: nowrap;
}

.tpl-b .tpl-brand-star {
  color: var(--tpl-b-accent-violet);
  font-size: 1.25rem;
}

.tpl-b .tpl-nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tpl-b .tpl-nav-link {
  color: var(--tpl-b-fg);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 800;
  padding: 0.4rem 0.85rem;
  border-radius: var(--tpl-b-radius-full);
  transition: all 0.15s ease;
}

.tpl-b .tpl-nav-link:hover,
.tpl-b .tpl-nav-link:focus-visible {
  background: var(--tpl-b-pill-bg);
}

.tpl-b .tpl-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Theme Toggle Button */
.tpl-b .tpl-theme-toggle {
  background: var(--tpl-b-card-bg);
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tpl-b-fg);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.tpl-b .tpl-theme-toggle:hover {
  transform: translateY(-2px);
}

.tpl-b .tpl-sun-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tpl-b .tpl-moon-icon {
  display: none;
  align-items: center;
  justify-content: center;
}

.tpl-b[data-theme="dark"] .tpl-sun-icon {
  display: none;
}
.tpl-b[data-theme="dark"] .tpl-moon-icon {
  display: inline-flex;
}

@media (prefers-color-scheme: dark) {
  .tpl-b:not([data-theme="light"]) .tpl-sun-icon {
    display: none;
  }
  .tpl-b:not([data-theme="light"]) .tpl-moon-icon {
    display: inline-flex;
  }
}

.tpl-b .tpl-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1.25rem;
  background: var(--tpl-b-accent-violet);
  color: #ffffff;
  font-weight: 900;
  font-size: 0.875rem;
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.tpl-b .tpl-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--tpl-b-shadow);
}

.tpl-b .tpl-nav-toggle {
  display: none;
  background: var(--tpl-b-accent-violet);
  color: #ffffff;
  border: 2px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-full);
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.tpl-b .tpl-mobile-menu {
  display: none;
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 1rem;
  right: 1rem;
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-lg);
  border-radius: var(--tpl-b-radius-md);
  padding: 1rem;
  flex-direction: column;
  gap: 0.5rem;
}

.tpl-b .tpl-mobile-menu.is-open {
  display: flex;
}

@media (max-width: 860px) {
  .tpl-b .tpl-nav-links {
    display: none;
  }
  .tpl-b .tpl-nav-toggle {
    display: flex;
  }
  .tpl-b .tpl-cta-btn {
    display: none;
  }
}

/* --------------------------------------------------------------------------
   Hero Section
   -------------------------------------------------------------------------- */
.tpl-b .tpl-hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 3.5rem;
}

@media (max-width: 900px) {
  .tpl-b .tpl-hero-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .tpl-b .tpl-polaroid-col {
    order: -1;
    display: flex;
    justify-content: center;
  }
}

.tpl-b .tpl-hero-greeting {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--tpl-b-accent-orange);
  margin-bottom: 0.25rem;
}

/* Multi-stop gradient headline with solid color fallback and forced-colors safety */
.tpl-b .tpl-hero-headline {
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 0 0 0.5rem 0;
  color: var(--tpl-b-fg); /* Solid fallback */
  background: linear-gradient(135deg, var(--tpl-b-accent-violet) 0%, var(--tpl-b-accent-orange) 50%, var(--tpl-b-accent-emerald) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (forced-colors: active) {
  .tpl-b .tpl-hero-headline {
    color: CanvasText !important;
    -webkit-text-fill-color: CanvasText !important;
  }
}

@media (max-width: 640px) {
  .tpl-b .tpl-hero-headline {
    font-size: 2.75rem;
  }
}

.tpl-b .tpl-hero-role {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0 0 1.25rem 0;
}

.tpl-b .tpl-quote-card {
  border-left: 5px solid var(--tpl-b-accent-violet);
  padding-left: 1.25rem;
  margin-bottom: 1.5rem;
}

.tpl-b .tpl-quote-text {
  font-size: 1.2rem;
  font-weight: 800;
  font-style: italic;
  color: var(--tpl-b-fg);
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.tpl-b .tpl-hero-bio {
  font-size: 1.05rem;
  color: var(--tpl-b-muted);
  line-height: 1.7;
  margin: 0 0 1.75rem 0;
}

.tpl-b .tpl-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tpl-b .tpl-btn-pop-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.85rem;
  background: var(--tpl-b-accent-violet);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 900;
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  transition: all 0.15s ease;
}

.tpl-b .tpl-btn-pop-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--tpl-b-shadow-hover);
}

.tpl-b .tpl-btn-pop-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.85rem;
  background: var(--tpl-b-card-bg);
  color: var(--tpl-b-fg);
  font-size: 1rem;
  font-weight: 900;
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  transition: all 0.15s ease;
}

.tpl-b .tpl-btn-pop-secondary:hover {
  transform: translateY(-2px);
  box-shadow: var(--tpl-b-shadow-hover);
}

/* Polaroid Photo Card with Rotated Tape Sticker */
.tpl-b .tpl-polaroid-wrap {
  position: relative;
  max-width: 340px;
  width: 100%;
}

.tpl-b .tpl-tape-sticker {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  background: var(--tpl-b-accent-tape);
  color: #064e3b;
  font-size: 0.725rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 1.25rem;
  border: 2px solid var(--tpl-b-border);
  box-shadow: 2px 2px 0px var(--tpl-b-border);
  z-index: 10;
  white-space: nowrap;
}

.tpl-b[data-theme="dark"] .tpl-tape-sticker {
  background: #064e3b;
  color: #ecfdf5;
}

@media (prefers-color-scheme: dark) {
  .tpl-b:not([data-theme="light"]) .tpl-tape-sticker {
    background: #064e3b;
    color: #ecfdf5;
  }
}

.tpl-b .tpl-polaroid-card {
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-lg);
  border-radius: var(--tpl-b-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.tpl-b .tpl-polaroid-inner {
  width: 100%;
  aspect-ratio: 4/5;
  border: 2px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-md);
  overflow: hidden;
  background: #ede9fe;
}

.tpl-b .tpl-polaroid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tpl-b .tpl-polaroid-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tpl-b-accent-violet);
  background: linear-gradient(135deg, #ede9fe 0%, #fef3c7 100%);
}

/* --------------------------------------------------------------------------
   About Section
   -------------------------------------------------------------------------- */
.tpl-b .tpl-about-card {
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-lg);
  padding: 2.5rem;
}

.tpl-b .tpl-about-bio {
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0 0 1.5rem 0;
  color: var(--tpl-b-fg);
}

.tpl-b .tpl-about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed var(--tpl-b-border);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
}

.tpl-b .tpl-about-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* --------------------------------------------------------------------------
   Skills Section (Neo-Pop Pills)
   -------------------------------------------------------------------------- */
.tpl-b .tpl-skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.tpl-b .tpl-skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tpl-b .tpl-skill-pill:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--tpl-b-shadow);
}

.tpl-b .tpl-skill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-skill-cat {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--tpl-b-muted);
}

/* --------------------------------------------------------------------------
   Projects Section (Neo-Pop Cards)
   -------------------------------------------------------------------------- */
.tpl-b .tpl-projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.25rem;
}

@media (max-width: 992px) {
  .tpl-b .tpl-projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .tpl-b .tpl-projects-grid {
    grid-template-columns: 1fr;
  }
}

.tpl-b .tpl-project-card {
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tpl-b .tpl-project-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: var(--tpl-b-shadow-hover);
}

.tpl-b .tpl-project-thumb {
  width: 100%;
  height: 200px;
  border-bottom: 2.5px solid var(--tpl-b-border);
  background: #f1f5f9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tpl-b .tpl-project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tpl-b .tpl-project-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tpl-b .tpl-project-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0 0 0.5rem 0;
}

.tpl-b .tpl-project-desc {
  font-size: 0.95rem;
  color: var(--tpl-b-muted);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.tpl-b .tpl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.tpl-b .tpl-tag {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.65rem;
  background: var(--tpl-b-pill-bg);
  color: var(--tpl-b-fg);
  border: 1.5px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-full);
}

.tpl-b .tpl-project-links {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 2px dashed var(--tpl-b-border);
}

.tpl-b .tpl-action-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  text-decoration: none;
  padding: 0.35rem 0.75rem;
  border: 1.5px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-sm);
  background: var(--tpl-b-card-bg);
  box-shadow: 2px 2px 0px var(--tpl-b-border);
  transition: transform 0.1s ease;
}

.tpl-b .tpl-action-link:hover {
  transform: translateY(-1px);
}

/* --------------------------------------------------------------------------
   Career Experience & Education Timeline
   -------------------------------------------------------------------------- */
.tpl-b .tpl-timeline-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 900px;
}

.tpl-b .tpl-career-card {
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-lg);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tpl-b .tpl-career-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tpl-b .tpl-career-role {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0;
}

.tpl-b .tpl-career-company {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-career-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.tpl-b .tpl-pop-pill-sm {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: var(--tpl-b-radius-full);
  border: 1.5px solid var(--tpl-b-border);
  box-shadow: 1.5px 1.5px 0px var(--tpl-b-border);
  background: var(--tpl-b-pill-bg);
  color: var(--tpl-b-fg);
}

.tpl-b .tpl-career-desc {
  font-size: 0.95rem;
  color: var(--tpl-b-fg);
  line-height: 1.7;
  margin: 0;
}

/* --------------------------------------------------------------------------
   Contact Section
   -------------------------------------------------------------------------- */
.tpl-b .tpl-contact-box {
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-lg);
  border-radius: var(--tpl-b-radius-lg);
  padding: 3rem 2.5rem;
  max-width: 900px;
}

@media (max-width: 640px) {
  .tpl-b .tpl-contact-box {
    padding: 2rem 1.5rem;
  }
}

.tpl-b .tpl-contact-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 768px) {
  .tpl-b .tpl-contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.tpl-b .tpl-contact-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0 0 0.5rem 0;
}

.tpl-b .tpl-contact-sub {
  font-size: 1.05rem;
  color: var(--tpl-b-muted);
  margin: 0 0 1.5rem 0;
}

.tpl-b .tpl-contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tpl-b .tpl-contact-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
  text-decoration: none;
}

.tpl-b .tpl-contact-row:hover {
  color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-connect-heading {
  font-size: 1.1rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  color: var(--tpl-b-fg);
}

.tpl-b .tpl-social-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tpl-b .tpl-social-pop {
  width: 3rem;
  height: 3rem;
  border-radius: var(--tpl-b-radius-full);
  background: var(--tpl-b-card-bg);
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tpl-b-fg);
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tpl-b .tpl-social-pop:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--tpl-b-shadow);
  color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-btn-full {
  width: 100%;
  justify-content: center;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
.tpl-b .tpl-footer {
  padding: 3rem 0;
  border-top: 3px solid var(--tpl-b-border);
  background: var(--tpl-b-card-bg);
  text-align: center;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
}

.tpl-b .tpl-footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 640px) {
  .tpl-b .tpl-footer-inner {
    flex-direction: column;
  }
}

.tpl-b .tpl-scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: var(--tpl-b-radius-full);
  background: var(--tpl-b-card-bg);
  color: var(--tpl-b-fg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 90;
}

.tpl-b .tpl-scroll-top.is-visible {
  opacity: 1;
  visibility: visible;
}

.tpl-b .tpl-scroll-top:hover {
  transform: translateY(-2px);
  box-shadow: var(--tpl-b-shadow-hover);
}

/* --------------------------------------------------------------------------
   Accessibility & Reduced Motion
   -------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .tpl-b *,
  .tpl-b *::before,
  .tpl-b *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
