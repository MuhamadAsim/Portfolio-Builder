export const templateACss = `
/* ==========================================================================
   Template A — Plain Scoped Stylesheet (.tpl-a)
   Zero runtime dependencies, system font stack, static & iframe safe.
   ========================================================================== */

.tpl-a {
  --tpl-bg: #f8fafc;
  --tpl-fg: #0f172a;
  --tpl-muted: #64748b;
  --tpl-primary: #3b2874;
  --tpl-primary-light: #523b9e;
  --tpl-primary-subtle: rgba(59, 40, 116, 0.07);
  --tpl-card-bg: rgba(255, 255, 255, 0.85);
  --tpl-card-border: #e2e8f0;
  --tpl-border-focus: #3b2874;
  --tpl-pill-bg: #f1f5f9;
  --tpl-radius-sm: 0.5rem;
  --tpl-radius-md: 0.75rem;
  --tpl-radius-lg: 1.25rem;
  --tpl-radius-full: 9999px;
  --tpl-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  --tpl-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --tpl-shadow-md: 0 4px 12px rgba(59, 40, 116, 0.08);
  --tpl-shadow-lg: 0 12px 28px rgba(59, 40, 116, 0.12);

  font-family: var(--tpl-font);
  color: var(--tpl-fg);
  background-color: var(--tpl-bg);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

.tpl-a *,
.tpl-a *::before,
.tpl-a *::after {
  box-sizing: inherit;
}

/* --------------------------------------------------------------------------
   Layout & Container
   -------------------------------------------------------------------------- */
.tpl-a .tpl-container {
  width: 100%;
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.tpl-a .tpl-section {
  padding-top: 5rem;
  padding-bottom: 5rem;
  position: relative;
}

@media (max-width: 640px) {
  .tpl-a .tpl-section {
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;
  }
}

.tpl-a .tpl-header-block {
  text-align: center;
  margin-bottom: 3rem;
}

.tpl-a .tpl-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tpl-primary);
  background: var(--tpl-primary-subtle);
  border-radius: var(--tpl-radius-full);
  margin-bottom: 0.75rem;
}

.tpl-a .tpl-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--tpl-fg);
  letter-spacing: -0.025em;
  margin: 0 0 0.5rem 0;
}

@media (max-width: 640px) {
  .tpl-a .tpl-title {
    font-size: 1.75rem;
  }
}

.tpl-a .tpl-subtitle {
  font-size: 1.05rem;
  color: var(--tpl-muted);
  max-width: 650px;
  margin: 0 auto;
}

/* --------------------------------------------------------------------------
   Navbar
   -------------------------------------------------------------------------- */
.tpl-a .tpl-nav-wrap {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(248, 250, 252, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--tpl-card-border);
  transition: all 0.3s ease;
}

.tpl-a .tpl-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
  gap: 1rem;
}

.tpl-a .tpl-brand {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--tpl-primary);
  text-decoration: none;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.tpl-a .tpl-nav-links {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.tpl-a .tpl-nav-link {
  color: var(--tpl-muted);
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.tpl-a .tpl-nav-link:hover,
.tpl-a .tpl-nav-link:focus-visible {
  color: var(--tpl-primary);
}

.tpl-a .tpl-resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.15rem;
  background: var(--tpl-primary);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: var(--tpl-radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tpl-a .tpl-resume-btn:hover {
  background: var(--tpl-primary-light);
  transform: translateY(-1px);
}

.tpl-a .tpl-nav-toggle {
  display: none;
  background: none;
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-sm);
  padding: 0.5rem;
  color: var(--tpl-fg);
  cursor: pointer;
}

.tpl-a .tpl-mobile-menu {
  display: none;
  padding: 1rem 0 1.5rem 0;
  border-top: 1px solid var(--tpl-card-border);
}

@media (max-width: 768px) {
  .tpl-a .tpl-nav-links {
    display: none;
  }
  .tpl-a .tpl-nav-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tpl-a .tpl-mobile-menu.is-open {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .tpl-a .tpl-mobile-menu .tpl-nav-link {
    padding: 0.5rem 0;
    font-size: 1rem;
  }
}

/* --------------------------------------------------------------------------
   Hero Section
   -------------------------------------------------------------------------- */
.tpl-a .tpl-hero {
  padding-top: 4rem;
  padding-bottom: 6rem;
  background: linear-gradient(180deg, #f5f3ff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
}

.tpl-a .tpl-hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 3rem;
}

@media (max-width: 900px) {
  .tpl-a .tpl-hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2.5rem;
  }
}

.tpl-a .tpl-hero-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tpl-a .tpl-hero-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tpl-a .tpl-availability-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #065f46;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: var(--tpl-radius-full);
}

.tpl-a .tpl-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px #d1fae5;
}

.tpl-a .tpl-hero-title {
  font-size: 3.25rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--tpl-fg);
  margin: 0;
}

@media (max-width: 640px) {
  .tpl-a .tpl-hero-title {
    font-size: 2.25rem;
  }
}

.tpl-a .tpl-hero-role {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--tpl-primary);
  margin: 0;
}

.tpl-a .tpl-hero-bio {
  font-size: 1.1rem;
  color: var(--tpl-muted);
  line-height: 1.7;
  margin: 0.5rem 0 1rem 0;
}

.tpl-a .tpl-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 900px) {
  .tpl-a .tpl-hero-actions {
    justify-content: center;
  }
}

.tpl-a .tpl-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.6rem;
  background: var(--tpl-primary);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: var(--tpl-radius-full);
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: var(--tpl-shadow-md);
}

.tpl-a .tpl-btn-primary:hover {
  background: var(--tpl-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--tpl-shadow-lg);
}

.tpl-a .tpl-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.6rem;
  background: #ffffff;
  color: var(--tpl-primary);
  border: 1px solid var(--tpl-card-border);
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: var(--tpl-radius-full);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tpl-a .tpl-btn-secondary:hover {
  border-color: var(--tpl-primary);
  transform: translateY(-2px);
}

.tpl-a .tpl-hero-image-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tpl-a .tpl-avatar {
  width: 280px;
  height: 280px;
  border-radius: var(--tpl-radius-lg);
  object-fit: cover;
  box-shadow: var(--tpl-shadow-lg);
  border: 4px solid #ffffff;
  background: #ffffff;
}

.tpl-a .tpl-avatar-placeholder {
  width: 280px;
  height: 280px;
  border-radius: var(--tpl-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%);
  color: var(--tpl-primary);
  box-shadow: var(--tpl-shadow-lg);
  border: 4px solid #ffffff;
}

@media (max-width: 640px) {
  .tpl-a .tpl-avatar,
  .tpl-a .tpl-avatar-placeholder {
    width: 200px;
    height: 200px;
  }
}

/* --------------------------------------------------------------------------
   SVG Section Dividers
   -------------------------------------------------------------------------- */
.tpl-a .tpl-divider {
  width: 100%;
  height: 48px;
  display: block;
  fill: currentColor;
}

/* --------------------------------------------------------------------------
   About Section
   -------------------------------------------------------------------------- */
.tpl-a .tpl-about {
  background: #ffffff;
}

.tpl-a .tpl-about-card {
  background: var(--tpl-card-bg);
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-lg);
  padding: 2.5rem;
  box-shadow: var(--tpl-shadow-sm);
  max-width: 850px;
  margin: 0 auto;
}

.tpl-a .tpl-about-quote {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--tpl-primary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 4px solid var(--tpl-primary);
}

.tpl-a .tpl-about-text {
  font-size: 1.05rem;
  color: var(--tpl-fg);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.tpl-a .tpl-about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--tpl-card-border);
  font-size: 0.9rem;
  color: var(--tpl-muted);
}

.tpl-a .tpl-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* --------------------------------------------------------------------------
   Projects Section
   -------------------------------------------------------------------------- */
.tpl-a .tpl-projects {
  background: var(--tpl-bg);
}

.tpl-a .tpl-filter-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.tpl-a .tpl-filter-btn {
  padding: 0.45rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--tpl-radius-full);
  border: 1px solid var(--tpl-card-border);
  background: #ffffff;
  color: var(--tpl-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tpl-a .tpl-filter-btn:hover {
  border-color: var(--tpl-primary);
  color: var(--tpl-primary);
}

.tpl-a .tpl-filter-btn.active {
  background: var(--tpl-primary);
  color: #ffffff;
  border-color: var(--tpl-primary);
}

.tpl-a .tpl-projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 992px) {
  .tpl-a .tpl-projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .tpl-a .tpl-projects-grid {
    grid-template-columns: 1fr;
  }
}

.tpl-a .tpl-project-card {
  background: #ffffff;
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--tpl-shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tpl-a .tpl-project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--tpl-shadow-md);
}

.tpl-a .tpl-project-card.is-hidden {
  display: none;
}

.tpl-a .tpl-project-thumb {
  width: 100%;
  height: 200px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid var(--tpl-card-border);
}

.tpl-a .tpl-project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tpl-a .tpl-project-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tpl-a .tpl-project-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--tpl-fg);
  margin: 0 0 0.5rem 0;
}

.tpl-a .tpl-project-desc {
  font-size: 0.925rem;
  color: var(--tpl-muted);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.tpl-a .tpl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.tpl-a .tpl-tag {
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  background: var(--tpl-pill-bg);
  color: var(--tpl-primary);
  border-radius: var(--tpl-radius-full);
}

.tpl-a .tpl-project-links {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--tpl-card-border);
}

.tpl-a .tpl-project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--tpl-primary);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.tpl-a .tpl-project-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* --------------------------------------------------------------------------
   Skills Section
   -------------------------------------------------------------------------- */
.tpl-a .tpl-skills {
  background: #ffffff;
}

.tpl-a .tpl-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.tpl-a .tpl-skill-card {
  background: var(--tpl-bg);
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-md);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.tpl-a .tpl-skill-card:hover {
  border-color: var(--tpl-primary);
  transform: translateY(-2px);
}

.tpl-a .tpl-skill-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--tpl-fg);
}

.tpl-a .tpl-skill-cat {
  font-size: 0.75rem;
  color: var(--tpl-muted);
}

/* --------------------------------------------------------------------------
   Experience & Education Timeline
   -------------------------------------------------------------------------- */
.tpl-a .tpl-timeline-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 850px;
  margin: 0 auto;
}

.tpl-a .tpl-timeline-card {
  background: #ffffff;
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-lg);
  padding: 2rem;
  box-shadow: var(--tpl-shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

.tpl-a .tpl-timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tpl-a .tpl-timeline-role {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--tpl-fg);
  margin: 0;
}

.tpl-a .tpl-timeline-org {
  font-size: 1rem;
  font-weight: 700;
  color: var(--tpl-primary);
}

.tpl-a .tpl-timeline-date {
  font-size: 0.825rem;
  font-weight: 700;
  color: var(--tpl-muted);
  background: var(--tpl-pill-bg);
  padding: 0.25rem 0.75rem;
  border-radius: var(--tpl-radius-full);
}

.tpl-a .tpl-timeline-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--tpl-muted);
}

.tpl-a .tpl-timeline-desc {
  font-size: 0.95rem;
  color: var(--tpl-fg);
  line-height: 1.7;
  margin: 0;
}

/* --------------------------------------------------------------------------
   Contact Section
   -------------------------------------------------------------------------- */
.tpl-a .tpl-contact {
  background: linear-gradient(180deg, #f8fafc 0%, #f5f3ff 100%);
}

.tpl-a .tpl-contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .tpl-a .tpl-contact-grid {
    grid-template-columns: 1fr;
  }
}

.tpl-a .tpl-contact-card {
  background: #ffffff;
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-lg);
  padding: 2.25rem;
  box-shadow: var(--tpl-shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tpl-a .tpl-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.tpl-a .tpl-contact-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--tpl-radius-full);
  background: var(--tpl-primary-subtle);
  color: var(--tpl-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tpl-a .tpl-contact-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--tpl-muted);
  margin: 0 0 0.15rem 0;
}

.tpl-a .tpl-contact-val {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--tpl-fg);
  text-decoration: none;
  word-break: break-all;
}

.tpl-a .tpl-contact-val:hover {
  color: var(--tpl-primary);
}

.tpl-a .tpl-social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.tpl-a .tpl-social-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--tpl-radius-full);
  background: #ffffff;
  border: 1px solid var(--tpl-card-border);
  color: var(--tpl-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tpl-a .tpl-social-btn:hover {
  background: var(--tpl-primary);
  color: #ffffff;
  border-color: var(--tpl-primary);
  transform: translateY(-2px);
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
.tpl-a .tpl-footer {
  background: #ffffff;
  border-top: 1px solid var(--tpl-card-border);
  padding: 2.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--tpl-muted);
}

.tpl-a .tpl-footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 640px) {
  .tpl-a .tpl-footer-inner {
    flex-direction: column;
  }
}

.tpl-a .tpl-scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--tpl-radius-full);
  background: var(--tpl-primary);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--tpl-shadow-lg);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 90;
}

.tpl-a .tpl-scroll-top.is-visible {
  opacity: 1;
  visibility: visible;
}

.tpl-a .tpl-scroll-top:hover {
  background: var(--tpl-primary-light);
  transform: translateY(-2px);
}

/* --------------------------------------------------------------------------
   Accessibility & Reduced Motion
   -------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .tpl-a *,
  .tpl-a *::before,
  .tpl-a *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
