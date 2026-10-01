export const templateBCss = `
/* ==========================================================================
   Template B — Neo-Pop / Neo-Brutalist Scoped Stylesheet (.tpl-b)
   Faithfully ported from reference My-Portfolio with bold 3D solid shadows,
   polaroid frames, tape stickers, notebook card, dark mode, and zero dead spaces.
   Zero runtime dependencies, WCAG AA contrast, forced-colors safe.
   ========================================================================== */

.tpl-b {
  /* ── Light Mode Color Tokens (Default) ── */
  --tpl-b-bg: #faf7f2;
  --tpl-b-fg: #1e1b2e;
  --tpl-b-muted: #4a5568;
  --tpl-b-card-bg: #ffffff;
  --tpl-b-border: #1e1b2e;
  --tpl-b-shadow: 4px 4px 0px #1e1b2e;
  --tpl-b-shadow-sm: 2.5px 2.5px 0px #1e1b2e;
  --tpl-b-shadow-lg: 6px 6px 0px #1e1b2e;
  --tpl-b-shadow-xl: 8px 8px 0px #1e1b2e;

  /* Accent Colors */
  --tpl-b-accent-violet: #7c3aed;
  --tpl-b-accent-orange: #ea580c;
  --tpl-b-accent-amber: #f59e0b;
  --tpl-b-accent-emerald: #10b981;
  --tpl-b-accent-tape: #a7f3d0;
  --tpl-b-pill-bg: #f3f0ea;

  --tpl-b-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --tpl-b-radius-sm: 0.5rem;
  --tpl-b-radius-md: 1rem;
  --tpl-b-radius-lg: 1.5rem;
  --tpl-b-radius-xl: 2rem;
  --tpl-b-radius-full: 9999px;

  font-family: var(--tpl-b-font);
  color: var(--tpl-b-fg);
  background-color: var(--tpl-b-bg);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.tpl-b *,
.tpl-b *::before,
.tpl-b *::after {
  box-sizing: inherit;
}

/* ── Dark Mode Overrides ── */
.tpl-b[data-theme="dark"] {
  --tpl-b-bg: #131122;
  --tpl-b-fg: #f8fafc;
  --tpl-b-muted: #cbd5e1;
  --tpl-b-card-bg: #1c1830;
  --tpl-b-border: #ffffff;
  --tpl-b-shadow: 4px 4px 0px #ffffff;
  --tpl-b-shadow-sm: 2.5px 2.5px 0px #ffffff;
  --tpl-b-shadow-lg: 6px 6px 0px #ffffff;
  --tpl-b-shadow-xl: 8px 8px 0px #ffffff;

  --tpl-b-accent-violet: #8b5cf6;
  --tpl-b-accent-orange: #f97316;
  --tpl-b-accent-amber: #fbbf24;
  --tpl-b-accent-emerald: #10b981;
  --tpl-b-accent-tape: #064e3b;
  --tpl-b-pill-bg: #262142;
}

@media (prefers-color-scheme: dark) {
  .tpl-b:not([data-theme="light"]) {
    --tpl-b-bg: #131122;
    --tpl-b-fg: #f8fafc;
    --tpl-b-muted: #cbd5e1;
    --tpl-b-card-bg: #1c1830;
    --tpl-b-border: #ffffff;
    --tpl-b-shadow: 4px 4px 0px #ffffff;
    --tpl-b-shadow-sm: 2.5px 2.5px 0px #ffffff;
    --tpl-b-shadow-lg: 6px 6px 0px #ffffff;
    --tpl-b-shadow-xl: 8px 8px 0px #ffffff;

    --tpl-b-accent-violet: #8b5cf6;
    --tpl-b-accent-orange: #f97316;
    --tpl-b-accent-amber: #fbbf24;
    --tpl-b-accent-emerald: #10b981;
    --tpl-b-accent-tape: #064e3b;
    --tpl-b-pill-bg: #262142;
  }
}

/* --------------------------------------------------------------------------
   Layout Containers
   -------------------------------------------------------------------------- */
.tpl-b .tpl-container {
  width: 100%;
  max-width: 1220px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (max-width: 640px) {
  .tpl-b .tpl-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.tpl-b .tpl-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
  position: relative;
}

@media (max-width: 768px) {
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
  gap: 0.4rem;
  padding: 0.4rem 1.1rem;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffffff;
  background: var(--tpl-b-accent-emerald);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  margin-bottom: 0.85rem;
}

.tpl-b .tpl-title {
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 900;
  color: var(--tpl-b-fg);
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem 0;
  line-height: 1.15;
}

.tpl-b .tpl-subtitle {
  font-size: 1.1rem;
  color: var(--tpl-b-muted);
  font-weight: 600;
  margin: 0;
}

/* --------------------------------------------------------------------------
   Floating Pill Navbar
   -------------------------------------------------------------------------- */
.tpl-b .tpl-nav-wrap {
  position: sticky;
  top: 1.25rem;
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
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-full);
  padding: 0.6rem 1.25rem;
  max-width: 1040px;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tpl-b .tpl-brand-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1.18rem;
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
  gap: 0.65rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 860px) {
  .tpl-b .tpl-nav-links {
    display: none;
  }
}

.tpl-b .tpl-nav-link {
  color: var(--tpl-b-fg);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 800;
  padding: 0.4rem 0.95rem;
  border-radius: var(--tpl-b-radius-full);
  transition: all 0.2s ease;
}

.tpl-b .tpl-nav-link:hover {
  background: var(--tpl-b-pill-bg);
  transform: translateY(-1px);
}

.tpl-b .tpl-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.tpl-b .tpl-theme-toggle {
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  width: 2.6rem;
  height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tpl-b-fg);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tpl-b .tpl-theme-toggle:hover {
  transform: translate(-1.5px, -1.5px);
  box-shadow: 4px 4px 0px var(--tpl-b-border);
}

.tpl-b .tpl-theme-toggle:active {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1px 1px 0px var(--tpl-b-border);
}

.tpl-b .tpl-sun-icon { display: block; }
.tpl-b .tpl-moon-icon { display: none; }

.tpl-b[data-theme="dark"] .tpl-sun-icon { display: none; }
.tpl-b[data-theme="dark"] .tpl-moon-icon { display: block; }

@media (prefers-color-scheme: dark) {
  .tpl-b:not([data-theme="light"]) .tpl-sun-icon { display: none; }
  .tpl-b:not([data-theme="light"]) .tpl-moon-icon { display: block; }
}

.tpl-b .tpl-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: #ffffff;
  background: var(--tpl-b-accent-violet);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.tpl-b .tpl-cta-btn:hover {
  transform: translate(-1.5px, -1.5px);
  box-shadow: 4px 4px 0px var(--tpl-b-border);
}

.tpl-b .tpl-nav-toggle {
  display: none;
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-md);
  box-shadow: var(--tpl-b-shadow-sm);
  padding: 0.45rem;
  color: var(--tpl-b-fg);
  cursor: pointer;
}

@media (max-width: 860px) {
  .tpl-b .tpl-nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.tpl-b .tpl-mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.75rem;
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-lg);
  padding: 1.25rem;
  width: 100%;
  max-width: 1040px;
}

.tpl-b .tpl-mobile-menu.is-open {
  display: flex;
}

/* --------------------------------------------------------------------------
   Hero Section (Neo-Pop Typography + Polaroid Frame)
   -------------------------------------------------------------------------- */
.tpl-b .tpl-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 3.5rem;
  width: 100%;
}

.tpl-b .tpl-hero-grid.is-centered {
  grid-template-columns: 1fr;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.tpl-b .tpl-hero-greeting {
  font-size: clamp(1.15rem, 2.5vw, 1.6rem);
  font-weight: 900;
  color: var(--tpl-b-accent-orange);
  letter-spacing: 0.02em;
  margin-bottom: 0.25rem;
}

.tpl-b .tpl-hero-headline {
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #7c3aed 0%, #10b981 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tpl-b .tpl-hero-role {
  font-size: clamp(1.35rem, 3vw, 2.15rem);
  font-weight: 900;
  color: var(--tpl-b-accent-violet);
  margin-bottom: 1rem;
}

.tpl-b .tpl-availability-wrap {
  margin-bottom: 1.25rem;
}

.tpl-b .tpl-availability-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.15rem;
  border-radius: var(--tpl-b-radius-full);
  background: var(--tpl-b-pill-bg);
  color: var(--tpl-b-accent-violet);
  border: 2.5px solid var(--tpl-b-border);
  font-size: 0.82rem;
  font-weight: 900;
  box-shadow: var(--tpl-b-shadow-sm);
}

.tpl-b .tpl-availability-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--tpl-b-accent-emerald);
  box-shadow: 0 0 8px var(--tpl-b-accent-emerald);
}

.tpl-b .tpl-quote-card {
  position: relative;
  padding-left: 1.25rem;
  border-left: 4.5px solid var(--tpl-b-accent-violet);
  margin: 1.25rem 0;
}

.tpl-b .tpl-quote-text {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  font-weight: 800;
  font-style: italic;
  line-height: 1.5;
  color: var(--tpl-b-fg);
  margin: 0;
}

.tpl-b .tpl-hero-bio {
  font-size: 1.1rem;
  line-height: 1.65;
  color: var(--tpl-b-muted);
  font-weight: 500;
  max-width: 600px;
  margin: 0 0 1.75rem 0;
}

.tpl-b .tpl-hero-grid.is-centered .tpl-hero-bio {
  margin-left: auto;
  margin-right: auto;
}

.tpl-b .tpl-hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.tpl-b .tpl-hero-grid.is-centered .tpl-hero-actions {
  justify-content: center;
}

.tpl-b .tpl-btn-pop-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.95rem 2rem;
  font-size: 1rem;
  font-weight: 900;
  color: #ffffff;
  background: var(--tpl-b-accent-violet);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tpl-b .tpl-btn-pop-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--tpl-b-shadow-lg);
}

.tpl-b .tpl-btn-pop-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--tpl-b-border);
}

.tpl-b .tpl-btn-pop-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.95rem 1.85rem;
  font-size: 1rem;
  font-weight: 900;
  color: #1e1b2e;
  background: #fde047;
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tpl-b .tpl-btn-pop-secondary:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--tpl-b-shadow-lg);
  background: #facc15;
}

.tpl-b .tpl-btn-pop-secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--tpl-b-border);
}

/* Polaroid Card Photo Frame with Top Tape Sticker */
.tpl-b .tpl-polaroid-col {
  display: flex;
  justify-content: center;
}

.tpl-b .tpl-polaroid-wrap {
  position: relative;
  display: inline-block;
}

.tpl-b .tpl-tape-sticker {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%) rotate(-2.5deg);
  z-index: 20;
  padding: 0.35rem 1.25rem;
  background: #34d399;
  color: #1e1b2e;
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: 4px;
  white-space: nowrap;
}

.tpl-b .tpl-polaroid-card {
  position: relative;
  background: var(--tpl-b-card-bg);
  padding: 1.25rem 1.25rem 2.25rem 1.25rem;
  border-radius: var(--tpl-b-radius-xl);
  border: 3.5px solid #10b981;
  box-shadow: var(--tpl-b-shadow-lg);
  width: 100%;
  max-width: 380px;
  transition: transform 0.3s ease;
}

.tpl-b .tpl-polaroid-card:hover {
  transform: rotate(1deg) scale(1.02);
}

.tpl-b .tpl-polaroid-inner {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--tpl-b-radius-lg);
  overflow: hidden;
  border: 2.5px solid var(--tpl-b-border);
  background: var(--tpl-b-pill-bg);
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
  background: linear-gradient(135deg, #ede9fe 0%, #d8b4fe 100%);
  color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-polaroid-placeholder svg {
  width: 50%;
  height: 50%;
  opacity: 0.7;
}

/* Floating bounce badge on Polaroid corner */
.tpl-b .tpl-polaroid-orb {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--tpl-b-accent-violet);
  border: 2.5px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tpl-b .tpl-polaroid-orb span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
}

@media (max-width: 960px) {
  .tpl-b .tpl-hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  .tpl-b .tpl-hero-actions {
    justify-content: center;
  }
  .tpl-b .tpl-polaroid-col {
    order: -1;
  }
  .tpl-b .tpl-polaroid-card {
    max-width: 300px;
  }
}

/* --------------------------------------------------------------------------
   Notebook Entry #01 Card (Eliminates Blank Space between Hero & Sections)
   -------------------------------------------------------------------------- */
.tpl-b .tpl-notebook-card {
  position: relative;
  background: var(--tpl-b-card-bg);
  background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(124, 58, 237, 0.1) 28px);
  border: 3.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-lg);
  border-radius: var(--tpl-b-radius-xl);
  padding: 3rem;
  margin-top: 3.5rem;
}

@media (max-width: 768px) {
  .tpl-b .tpl-notebook-card {
    padding: 1.75rem;
    margin-top: 2rem;
  }
}

.tpl-b .tpl-notebook-top-badge {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.tpl-b .tpl-notebook-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1.15rem;
  border-radius: var(--tpl-b-radius-full);
  background: #ffe4e6;
  color: #be123c;
  border: 2.5px solid var(--tpl-b-border);
  font-size: 0.78rem;
  font-weight: 900;
  box-shadow: var(--tpl-b-shadow-sm);
}

.tpl-b .tpl-notebook-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  align-items: center;
  gap: 3rem;
}

@media (max-width: 900px) {
  .tpl-b .tpl-notebook-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Terminal Graphic Mockup Box */
.tpl-b .tpl-terminal-box {
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-lg);
  padding: 1.25rem;
  font-family: monospace;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tpl-b .tpl-terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--tpl-b-border);
  padding-bottom: 0.65rem;
}

.tpl-b .tpl-terminal-dots {
  display: flex;
  gap: 0.4rem;
}

.tpl-b .tpl-dot-red { width: 10px; height: 10px; border-radius: 50%; background: #ef4444; }
.tpl-b .tpl-dot-yellow { width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; }
.tpl-b .tpl-dot-green { width: 10px; height: 10px; border-radius: 50%; background: #10b981; }

.tpl-b .tpl-terminal-code {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--tpl-b-fg);
}

.tpl-b .tpl-code-purple { color: var(--tpl-b-accent-violet); font-weight: 800; }
.tpl-b .tpl-code-green { color: var(--tpl-b-accent-emerald); }
.tpl-b .tpl-code-amber { color: var(--tpl-b-accent-amber); }

.tpl-b .tpl-terminal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1.5px solid var(--tpl-b-border);
  padding-top: 0.65rem;
  font-size: 0.72rem;
  font-weight: 900;
  color: var(--tpl-b-muted);
}

/* Sticky Note Badges (tilted playful pills) */
.tpl-b .tpl-sticky-notes-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.tpl-b .tpl-sticky-note {
  padding: 0.5rem 1.15rem;
  border-radius: var(--tpl-b-radius-md);
  font-size: 0.8rem;
  font-weight: 900;
  color: #1e1b2e;
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  transition: transform 0.2s ease;
}

.tpl-b .tpl-sticky-amber { background: #fef08a; transform: rotate(-1.5deg); }
.tpl-b .tpl-sticky-sky { background: #bae6fd; transform: rotate(1.5deg); }
.tpl-b .tpl-sticky-emerald { background: #a7f3d0; transform: rotate(-1deg); }

.tpl-b .tpl-sticky-note:hover {
  transform: scale(1.08) rotate(0deg);
}

/* --------------------------------------------------------------------------
   About Section
   -------------------------------------------------------------------------- */
.tpl-b .tpl-about-card {
  background: var(--tpl-b-card-bg);
  border: 3.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-lg);
  border-radius: var(--tpl-b-radius-xl);
  padding: 2.75rem;
}

@media (max-width: 768px) {
  .tpl-b .tpl-about-card {
    padding: 1.75rem;
  }
}

.tpl-b .tpl-about-bio {
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--tpl-b-fg);
  font-weight: 500;
  margin: 0;
}

.tpl-b .tpl-about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.75rem;
  border-top: 2px dashed var(--tpl-b-border);
}

.tpl-b .tpl-about-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--tpl-b-pill-bg);
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  padding: 0.4rem 1.1rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--tpl-b-fg);
}

/* --------------------------------------------------------------------------
   Skills Section (Neo-Pop Cards Grid)
   -------------------------------------------------------------------------- */
.tpl-b .tpl-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
}

.tpl-b .tpl-skill-pill {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-md);
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.tpl-b .tpl-skill-pill:hover {
  transform: translate(-3px, -3px) rotate(1deg);
  box-shadow: var(--tpl-b-shadow);
  border-color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-skill-cat {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--tpl-b-accent-violet);
  text-transform: uppercase;
}

/* --------------------------------------------------------------------------
   Projects Section (Neo-Pop Cards, Tag Pills, Fluid Grid)
   -------------------------------------------------------------------------- */
.tpl-b .tpl-b-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.tpl-b .tpl-b-filter-btn {
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tpl-b .tpl-b-filter-btn:hover {
  transform: translate(-1.5px, -1.5px);
  box-shadow: 4px 4px 0px var(--tpl-b-border);
}

.tpl-b .tpl-b-filter-btn.active {
  background: var(--tpl-b-accent-violet);
  color: #ffffff;
  transform: translate(-1.5px, -1.5px);
  box-shadow: 4px 4px 0px var(--tpl-b-border);
}

.tpl-b .tpl-b-project-count {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--tpl-b-muted);
  margin-bottom: 2rem;
}

.tpl-b .tpl-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

@media (max-width: 640px) {
  .tpl-b .tpl-projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.tpl-b .tpl-project-card {
  display: flex;
  flex-direction: column;
  background: var(--tpl-b-card-bg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  border-radius: var(--tpl-b-radius-lg);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-b .tpl-project-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: var(--tpl-b-shadow-xl);
}

.tpl-b .tpl-project-card.is-hidden {
  display: none !important;
}

.tpl-b .tpl-project-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 2.5px solid var(--tpl-b-border);
  background: var(--tpl-b-pill-bg);
}

.tpl-b .tpl-project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.tpl-b .tpl-project-card:hover .tpl-project-img {
  transform: scale(1.05);
}

.tpl-b .tpl-project-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tpl-b .tpl-project-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.015em;
}

.tpl-b .tpl-project-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--tpl-b-muted);
  font-weight: 500;
  margin: 0 0 1.25rem 0;
  flex: 1;
}

.tpl-b .tpl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
}

.tpl-b .tpl-tag {
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
  background: var(--tpl-b-pill-bg);
  border: 1.5px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-full);
  padding: 0.2rem 0.75rem;
}

.tpl-b .tpl-project-links {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding-top: 1.25rem;
  border-top: 2px dashed var(--tpl-b-border);
}

.tpl-b .tpl-action-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  background: var(--tpl-b-card-bg);
  border: 2px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  border-radius: var(--tpl-b-radius-full);
  text-decoration: none;
  transition: all 0.15s ease;
}

.tpl-b .tpl-action-link:hover {
  transform: translate(-1.5px, -1.5px);
  box-shadow: 3.5px 3.5px 0px var(--tpl-b-border);
  color: var(--tpl-b-accent-violet);
}

/* --------------------------------------------------------------------------
   Timeline (Experience & Education)
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tpl-b .tpl-career-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: var(--tpl-b-shadow-lg);
}

.tpl-b .tpl-career-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.tpl-b .tpl-career-role {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0;
}

.tpl-b .tpl-career-company {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--tpl-b-accent-violet);
  margin-top: 0.2rem;
}

.tpl-b .tpl-career-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tpl-b .tpl-pop-pill-sm {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
  background: var(--tpl-b-pill-bg);
  border: 1.5px solid var(--tpl-b-border);
  border-radius: var(--tpl-b-radius-full);
  padding: 0.25rem 0.75rem;
}

.tpl-b .tpl-career-desc {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--tpl-b-muted);
  font-weight: 500;
  margin: 0;
}

/* --------------------------------------------------------------------------
   Contact Section
   -------------------------------------------------------------------------- */
.tpl-b .tpl-contact-box {
  background: var(--tpl-b-card-bg);
  border: 3.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-xl);
  border-radius: var(--tpl-b-radius-xl);
  padding: 3rem;
}

@media (max-width: 768px) {
  .tpl-b .tpl-contact-box {
    padding: 1.75rem;
  }
}

.tpl-b .tpl-contact-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
}

@media (max-width: 860px) {
  .tpl-b .tpl-contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.tpl-b .tpl-contact-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin: 0 0 0.5rem 0;
  line-height: 1.15;
}

.tpl-b .tpl-contact-sub {
  font-size: 1.05rem;
  color: var(--tpl-b-muted);
  font-weight: 600;
  margin: 0 0 2rem 0;
}

.tpl-b .tpl-contact-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tpl-b .tpl-contact-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--tpl-b-fg);
  text-decoration: none;
  transition: color 0.15s ease;
}

.tpl-b .tpl-contact-row:hover {
  color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-connect-heading {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--tpl-b-fg);
  margin-bottom: 1rem;
}

.tpl-b .tpl-social-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.tpl-b .tpl-social-pop {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: var(--tpl-b-card-bg);
  border: 2.5px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tpl-b-fg);
  text-decoration: none;
  transition: all 0.15s ease;
}

.tpl-b .tpl-social-pop:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--tpl-b-shadow);
  color: var(--tpl-b-accent-violet);
}

.tpl-b .tpl-social-pop:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--tpl-b-border);
}

.tpl-b .tpl-btn-full {
  width: 100%;
  justify-content: center;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
.tpl-b .tpl-footer {
  border-top: 3px solid var(--tpl-b-border);
  background: var(--tpl-b-card-bg);
  padding: 2.5rem 0;
  position: relative;
}

.tpl-b .tpl-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--tpl-b-muted);
}

.tpl-b .tpl-scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--tpl-b-radius-md);
  background: var(--tpl-b-card-bg);
  color: var(--tpl-b-fg);
  border: 3px solid var(--tpl-b-border);
  box-shadow: var(--tpl-b-shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-b .tpl-scroll-top.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.tpl-b .tpl-scroll-top:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--tpl-b-shadow-lg);
}

.tpl-b .tpl-scroll-top:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--tpl-b-border);
}

/* Scroll reveal helper */
.tpl-b .tpl-b-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-b .tpl-b-reveal.is-revealed {
  opacity: 1;
  transform: translateY(0);
}
`.trim();
