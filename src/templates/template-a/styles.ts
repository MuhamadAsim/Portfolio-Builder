export const templateACss = `
/* ==========================================================================
   Template A — Plain Scoped Stylesheet (.tpl-a)
   Faithfully ported from reference my-portfolio-001 with rich aesthetics,
   particle network, glassmorphism, fluid typography, and zero dead spaces.
   Zero runtime dependencies, static & iframe safe.
   ========================================================================== */

.tpl-a {
  --tpl-bg: #f8fafc;
  --tpl-fg: #0f172a;
  --tpl-muted: #64748b;
  --tpl-primary: #3b2874;
  --tpl-primary-light: #5b42a8;
  --tpl-primary-dark: #26164d;
  --tpl-primary-subtle: rgba(59, 40, 116, 0.08);
  --tpl-accent: #a855f7;
  --tpl-accent-subtle: rgba(168, 85, 247, 0.12);
  --tpl-card-bg: rgba(255, 255, 255, 0.82);
  --tpl-card-border: rgba(226, 232, 240, 0.85);
  --tpl-border-focus: #3b2874;
  --tpl-radius-sm: 0.5rem;
  --tpl-radius-md: 0.85rem;
  --tpl-radius-lg: 1.25rem;
  --tpl-radius-xl: 1.75rem;
  --tpl-radius-full: 9999px;
  --tpl-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --tpl-shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.04);
  --tpl-shadow-md: 0 8px 24px -4px rgba(59, 40, 116, 0.1);
  --tpl-shadow-lg: 0 20px 40px -8px rgba(59, 40, 116, 0.16);
  --tpl-shadow-glow: 0 0 35px rgba(168, 85, 247, 0.25);

  font-family: var(--tpl-font);
  color: var(--tpl-fg);
  background-color: var(--tpl-bg);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.tpl-a *,
.tpl-a *::before,
.tpl-a *::after {
  box-sizing: inherit;
}

/* --------------------------------------------------------------------------
   Layout Containers
   -------------------------------------------------------------------------- */
.tpl-a .tpl-container {
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (max-width: 640px) {
  .tpl-a .tpl-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.tpl-a .tpl-section {
  padding-top: 5.5rem;
  padding-bottom: 5.5rem;
  position: relative;
}

@media (max-width: 768px) {
  .tpl-a .tpl-section {
    padding-top: 3.75rem;
    padding-bottom: 3.75rem;
  }
}

.tpl-a .tpl-header-block {
  text-align: center;
  margin-bottom: 3.5rem;
  position: relative;
  z-index: 2;
}

.tpl-a .tpl-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1.1rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tpl-primary);
  background: var(--tpl-primary-subtle);
  border: 1px solid rgba(59, 40, 116, 0.14);
  border-radius: var(--tpl-radius-full);
  margin-bottom: 0.85rem;
}

.tpl-a .tpl-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--tpl-primary);
  letter-spacing: -0.025em;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.tpl-a .tpl-subtitle {
  font-size: 1.05rem;
  color: var(--tpl-muted);
  max-width: 620px;
  margin: 0 auto;
}

/* --------------------------------------------------------------------------
   Navigation Bar (Glassmorphic)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-nav-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.tpl-a .tpl-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
}

.tpl-a .tpl-brand {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--tpl-primary);
  text-decoration: none;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;
}

.tpl-a .tpl-brand:hover {
  color: var(--tpl-accent);
}

.tpl-a .tpl-nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 840px) {
  .tpl-a .tpl-nav-links {
    display: none;
  }
}

.tpl-a .tpl-nav-link {
  position: relative;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--tpl-fg);
  text-decoration: none;
  transition: color 0.2s ease;
  padding-bottom: 4px;
}

.tpl-a .tpl-nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--tpl-accent);
  transition: width 0.25s ease-out;
  border-radius: 2px;
}

.tpl-a .tpl-nav-link:hover {
  color: var(--tpl-accent);
}

.tpl-a .tpl-nav-link:hover::after {
  width: 100%;
}

.tpl-a .tpl-resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  background: var(--tpl-primary);
  border-radius: var(--tpl-radius-full);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(59, 40, 116, 0.2);
}

.tpl-a .tpl-resume-btn:hover {
  background: var(--tpl-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(59, 40, 116, 0.28);
}

.tpl-a .tpl-nav-toggle {
  display: none;
  background: none;
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-sm);
  padding: 0.5rem;
  color: var(--tpl-primary);
  cursor: pointer;
}

@media (max-width: 840px) {
  .tpl-a .tpl-nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.tpl-a .tpl-mobile-menu {
  display: none;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 0.5rem 1.5rem 0.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.tpl-a .tpl-mobile-menu.is-open {
  display: flex;
}

/* --------------------------------------------------------------------------
   Hero Section & Interactive Particles
   -------------------------------------------------------------------------- */
.tpl-a .tpl-hero {
  position: relative;
  min-height: 82vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(180deg, #faf5ff 0%, #ffffff 60%, #ffffff 100%);
  padding-top: 4rem;
  padding-bottom: 5rem;
}

.tpl-a .tpl-hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.tpl-a .tpl-hero-glow-blob {
  position: absolute;
  width: 40rem;
  height: 40rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(59, 40, 116, 0.04) 50%, transparent 70%);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 1;
  filter: blur(50px);
}

.tpl-a .tpl-hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 3.5rem;
  width: 100%;
}

.tpl-a .tpl-hero-grid.is-centered {
  grid-template-columns: 1fr;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.tpl-a .tpl-hero-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tpl-a .tpl-hero-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tpl-a .tpl-hero-grid.is-centered .tpl-hero-meta-row {
  justify-content: center;
}

.tpl-a .tpl-availability-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.95rem;
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--tpl-radius-full);
  font-size: 0.82rem;
  font-weight: 600;
}

.tpl-a .tpl-status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
  animation: tplPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.tpl-a .tpl-hero-title {
  font-size: clamp(2.5rem, 5.5vw, 4.25rem);
  font-weight: 900;
  line-height: 1.08;
  color: var(--tpl-primary);
  letter-spacing: -0.035em;
  margin: 0;
}

/* Big outlined / stroked text matching reference Hero */
.tpl-a .tpl-hero-role-outline {
  display: block;
  font-size: clamp(1.75rem, 4.2vw, 3.25rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: transparent;
  -webkit-text-stroke: 1.5px var(--tpl-accent);
  margin-top: 0.25rem;
}

.tpl-a .tpl-hero-bio {
  font-size: 1.15rem;
  line-height: 1.65;
  color: var(--tpl-muted);
  max-width: 600px;
  margin: 0;
}

.tpl-a .tpl-hero-grid.is-centered .tpl-hero-bio {
  margin-left: auto;
  margin-right: auto;
}

.tpl-a .tpl-hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
}

.tpl-a .tpl-hero-grid.is-centered .tpl-hero-actions {
  justify-content: center;
}

.tpl-a .tpl-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.85rem;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  background: var(--tpl-primary);
  border-radius: var(--tpl-radius-full);
  text-decoration: none;
  box-shadow: var(--tpl-shadow-md);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-a .tpl-btn-primary:hover {
  background: var(--tpl-primary-light);
  transform: translateY(-3px);
  box-shadow: var(--tpl-shadow-lg);
}

.tpl-a .tpl-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--tpl-primary);
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(59, 40, 116, 0.2);
  border-radius: var(--tpl-radius-full);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-a .tpl-btn-secondary:hover {
  border-color: var(--tpl-primary);
  background: #ffffff;
  transform: translateY(-3px);
  box-shadow: var(--tpl-shadow-sm);
}

/* Hero Image presentation with 3D depth and glow */
.tpl-a .tpl-hero-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tpl-a .tpl-avatar-aura {
  position: absolute;
  inset: -1.5rem;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(25px);
  z-index: 1;
}

.tpl-a .tpl-avatar-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 440px;
  aspect-ratio: 1 / 1;
  border-radius: var(--tpl-radius-xl);
  overflow: hidden;
  box-shadow: var(--tpl-shadow-lg);
  border: 4px solid #ffffff;
  background: #ffffff;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-a .tpl-avatar-frame:hover {
  transform: scale(1.03) translateY(-4px);
}

.tpl-a .tpl-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.tpl-a .tpl-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: var(--tpl-primary);
}

.tpl-a .tpl-avatar-placeholder svg {
  width: 45%;
  height: 45%;
  opacity: 0.6;
}

@media (max-width: 960px) {
  .tpl-a .tpl-hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2.5rem;
  }
  .tpl-a .tpl-hero-meta-row,
  .tpl-a .tpl-hero-actions {
    justify-content: center;
  }
  .tpl-a .tpl-hero-bio {
    margin-left: auto;
    margin-right: auto;
  }
  .tpl-a .tpl-hero-image-wrap {
    order: -1;
  }
  .tpl-a .tpl-avatar-frame {
    max-width: 300px;
  }
}

/* --------------------------------------------------------------------------
   Curved Transitions (Hero -> About, and About -> Next)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-wave-to-about {
  display: block;
  width: 100%;
  height: 70px;
  margin-top: -1px;
  fill: var(--tpl-primary-dark);
  background: #ffffff;
  pointer-events: none;
}

@media (max-width: 640px) {
  .tpl-a .tpl-wave-to-about {
    height: 45px;
  }
}

.tpl-a .tpl-wave-from-about {
  display: block;
  width: 100%;
  height: 70px;
  margin-bottom: -1px;
  fill: var(--tpl-bg);
  background: var(--tpl-primary-dark);
  pointer-events: none;
}

@media (max-width: 640px) {
  .tpl-a .tpl-wave-from-about {
    height: 45px;
  }
}

/* --------------------------------------------------------------------------
   About Section (Deep Royal Purple matching reference)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-about {
  background: var(--tpl-primary-dark);
  color: #ffffff;
  padding-top: 3.5rem;
  padding-bottom: 5rem;
}

.tpl-a .tpl-about .tpl-badge {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.tpl-a .tpl-about .tpl-title {
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.tpl-a .tpl-about-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--tpl-radius-xl);
  padding: 3rem;
  max-width: 1080px;
  margin: 0 auto;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .tpl-a .tpl-about-card {
    padding: 1.75rem;
  }
}

.tpl-a .tpl-about-quote {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.5;
  color: #f3e8ff;
  border-left: 4px solid var(--tpl-accent);
  padding-left: 1.5rem;
  margin-bottom: 2rem;
}

.tpl-a .tpl-about-text {
  font-size: 1.15rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
}

.tpl-a .tpl-about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2.25rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tpl-a .tpl-about .tpl-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.45rem 1.1rem;
  border-radius: var(--tpl-radius-full);
}

.tpl-a .tpl-about .tpl-meta-item svg {
  width: 16px;
  height: 16px;
  color: var(--tpl-accent);
}

/* --------------------------------------------------------------------------
   Skills Section (Interactive Badges + Orbital Tech Ring)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-skills {
  position: relative;
  overflow: hidden;
}

.tpl-a .tpl-skills-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 4rem;
}

@media (max-width: 960px) {
  .tpl-a .tpl-skills-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.tpl-a .tpl-skills-left {
  display: flex;
  flex-direction: column;
}

.tpl-a .tpl-skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.tpl-a .tpl-skill-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.22);
  border-radius: var(--tpl-radius-full);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--tpl-fg);
  box-shadow: var(--tpl-shadow-sm);
  cursor: default;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.tpl-a .tpl-skill-badge:hover {
  background: var(--tpl-primary);
  color: #ffffff;
  border-color: var(--tpl-primary);
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 10px 22px -4px rgba(59, 40, 116, 0.3);
}

.tpl-a .tpl-skill-badge .tpl-skill-cat {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--tpl-accent);
  background: var(--tpl-accent-subtle);
  padding: 0.2rem 0.5rem;
  border-radius: var(--tpl-radius-full);
}

.tpl-a .tpl-skill-badge:hover .tpl-skill-cat {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
}

/* Tech Orbit Showcase (Right side wheel simulation) */
.tpl-a .tpl-skills-orbit-wrap {
  position: relative;
  width: 100%;
  max-width: 380px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tpl-a .tpl-orbit-ring {
  position: absolute;
  width: 82%;
  height: 82%;
  border: 1.5px dashed rgba(168, 85, 247, 0.35);
  border-radius: 50%;
  animation: tplOrbit 26s linear infinite;
}

.tpl-a .tpl-orbit-ring-inner {
  position: absolute;
  width: 52%;
  height: 52%;
  border: 1px solid rgba(59, 40, 116, 0.15);
  border-radius: 50%;
  animation: tplOrbit 18s linear infinite reverse;
}

.tpl-a .tpl-orbit-center {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--tpl-primary) 0%, var(--tpl-primary-light) 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 5;
  text-align: center;
  padding: 0.5rem;
}

.tpl-a .tpl-orbit-node {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -1.75rem 0 0 -1.75rem;
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: var(--tpl-radius-md);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--tpl-primary);
  text-align: center;
  padding: 0.25rem;
  animation: tplCounterOrbit 26s linear infinite;
}

/* Node positions on the outer ring circle */
.tpl-a .tpl-node-1 { transform: rotate(0deg) translate(140px) rotate(0deg); }
.tpl-a .tpl-node-2 { transform: rotate(60deg) translate(140px) rotate(-60deg); }
.tpl-a .tpl-node-3 { transform: rotate(120deg) translate(140px) rotate(-120deg); }
.tpl-a .tpl-node-4 { transform: rotate(180deg) translate(140px) rotate(-180deg); }
.tpl-a .tpl-node-5 { transform: rotate(240deg) translate(140px) rotate(-240deg); }
.tpl-a .tpl-node-6 { transform: rotate(300deg) translate(140px) rotate(-300deg); }

@media (max-width: 640px) {
  .tpl-a .tpl-node-1 { transform: rotate(0deg) translate(105px) rotate(0deg); }
  .tpl-a .tpl-node-2 { transform: rotate(60deg) translate(105px) rotate(-60deg); }
  .tpl-a .tpl-node-3 { transform: rotate(120deg) translate(105px) rotate(-120deg); }
  .tpl-a .tpl-node-4 { transform: rotate(180deg) translate(105px) rotate(-180deg); }
  .tpl-a .tpl-node-5 { transform: rotate(240deg) translate(105px) rotate(-240deg); }
  .tpl-a .tpl-node-6 { transform: rotate(300deg) translate(105px) rotate(-300deg); }
}

/* --------------------------------------------------------------------------
   Projects Section (Cards, Zoom, Tag Filters, Glowing Blobs)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-projects {
  position: relative;
  overflow: hidden;
  background-color: var(--tpl-bg);
}

.tpl-a .tpl-blob-top-right {
  position: absolute;
  top: -8rem;
  right: -8rem;
  width: 26rem;
  height: 26rem;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(50px);
  pointer-events: none;
}

.tpl-a .tpl-blob-bottom-left {
  position: absolute;
  bottom: -10rem;
  left: -10rem;
  width: 32rem;
  height: 32rem;
  background: radial-gradient(circle, rgba(59, 40, 116, 0.09) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.tpl-a .tpl-filter-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 2.5rem;
}

.tpl-a .tpl-filter-btn {
  padding: 0.55rem 1.35rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--tpl-muted);
  background: #ffffff;
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-full);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.tpl-a .tpl-filter-btn:hover {
  color: var(--tpl-primary);
  border-color: var(--tpl-primary-light);
}

.tpl-a .tpl-filter-btn.active {
  background: var(--tpl-primary);
  color: #ffffff;
  border-color: var(--tpl-primary);
  box-shadow: 0 4px 14px rgba(59, 40, 116, 0.25);
}

.tpl-a .tpl-project-live-count {
  text-align: center;
  font-size: 0.88rem;
  color: var(--tpl-muted);
  margin-top: -1.25rem;
  margin-bottom: 2.75rem;
}

/* Fluid auto-fill grid eliminates dead white space on the right */
.tpl-a .tpl-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

@media (max-width: 640px) {
  .tpl-a .tpl-projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.tpl-a .tpl-project-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
  will-change: transform;
}

.tpl-a .tpl-project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 38px -10px rgba(59, 40, 116, 0.16);
  border-color: rgba(168, 85, 247, 0.35);
}

.tpl-a .tpl-project-card.is-hidden {
  display: none !important;
}

.tpl-a .tpl-project-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.tpl-a .tpl-project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-a .tpl-project-card:hover .tpl-project-img {
  transform: scale(1.06);
}

.tpl-a .tpl-project-thumb svg {
  width: 100%;
  height: 100%;
  color: var(--tpl-muted);
}

.tpl-a .tpl-project-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tpl-a .tpl-project-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--tpl-primary);
  margin: 0 0 0.6rem 0;
  letter-spacing: -0.015em;
}

.tpl-a .tpl-project-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--tpl-muted);
  margin: 0 0 1.25rem 0;
  flex: 1;
}

.tpl-a .tpl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
}

.tpl-a .tpl-tag {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--tpl-primary);
  background: var(--tpl-primary-subtle);
  border-radius: var(--tpl-radius-full);
  padding: 0.25rem 0.75rem;
}

.tpl-a .tpl-project-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
}

.tpl-a .tpl-project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--tpl-primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tpl-a .tpl-project-link:hover {
  color: var(--tpl-accent);
  transform: translateX(2px);
}

.tpl-a .tpl-project-link svg {
  width: 16px;
  height: 16px;
}

/* --------------------------------------------------------------------------
   Timeline (Experience & Education)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-timeline-wrap {
  position: relative;
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.tpl-a .tpl-timeline-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-lg);
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tpl-a .tpl-timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--tpl-shadow-md);
  border-color: rgba(168, 85, 247, 0.3);
}

.tpl-a .tpl-timeline-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.tpl-a .tpl-timeline-role {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--tpl-primary);
  margin: 0;
}

.tpl-a .tpl-timeline-org {
  font-size: 1rem;
  font-weight: 600;
  color: var(--tpl-accent);
  margin-top: 0.2rem;
}

.tpl-a .tpl-timeline-date {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--tpl-primary);
  background: var(--tpl-primary-subtle);
  border-radius: var(--tpl-radius-full);
  padding: 0.3rem 0.85rem;
}

.tpl-a .tpl-timeline-meta {
  font-size: 0.85rem;
  color: var(--tpl-muted);
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tpl-a .tpl-timeline-desc {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--tpl-fg);
  margin: 0;
}

/* --------------------------------------------------------------------------
   Contact Section (Faithful to Contact.tsx from reference)
   -------------------------------------------------------------------------- */
.tpl-a .tpl-contact {
  position: relative;
  background: linear-gradient(180deg, var(--tpl-bg) 0%, #faf5ff 100%);
}

.tpl-a .tpl-contact-pill-float {
  display: inline-block;
  animation: tplFloat 3s ease-in-out infinite;
}

.tpl-a .tpl-contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  max-width: 1040px;
  margin: 0 auto;
}

@media (max-width: 800px) {
  .tpl-a .tpl-contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.tpl-a .tpl-contact-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--tpl-card-border);
  border-radius: var(--tpl-radius-xl);
  padding: 2.5rem;
  box-shadow: var(--tpl-shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tpl-a .tpl-contact-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--tpl-shadow-lg);
  border-color: rgba(168, 85, 247, 0.35);
}

.tpl-a .tpl-contact-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.tpl-a .tpl-contact-icon {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--tpl-radius-md);
  background: var(--tpl-primary-subtle);
  color: var(--tpl-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.tpl-a .tpl-contact-item:hover .tpl-contact-icon {
  background: var(--tpl-primary);
  color: #ffffff;
  transform: scale(1.08);
}

.tpl-a .tpl-contact-icon svg {
  width: 22px;
  height: 22px;
}

.tpl-a .tpl-contact-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--tpl-muted);
  letter-spacing: 0.05em;
  margin-bottom: 0.2rem;
}

.tpl-a .tpl-contact-val {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--tpl-fg);
  text-decoration: none;
  transition: color 0.2s ease;
}

.tpl-a .tpl-contact-val:hover {
  color: var(--tpl-accent);
}

.tpl-a .tpl-social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

.tpl-a .tpl-social-btn {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid var(--tpl-card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tpl-primary);
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-a .tpl-social-btn:hover {
  transform: scale(1.15) translateY(-2px);
  background: var(--tpl-primary);
  color: #ffffff;
  border-color: var(--tpl-primary);
  box-shadow: 0 10px 20px -4px rgba(59, 40, 116, 0.35);
}

.tpl-a .tpl-social-btn svg {
  width: 20px;
  height: 20px;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
.tpl-a .tpl-footer {
  border-top: 1px solid var(--tpl-card-border);
  background: #ffffff;
  padding: 2.25rem 0;
  position: relative;
}

.tpl-a .tpl-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.88rem;
  color: var(--tpl-muted);
}

.tpl-a .tpl-scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--tpl-primary);
  color: #ffffff;
  border: none;
  box-shadow: var(--tpl-shadow-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-a .tpl-scroll-top.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.tpl-a .tpl-scroll-top:hover {
  background: var(--tpl-primary-light);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 28px rgba(59, 40, 116, 0.35);
}

.tpl-a .tpl-scroll-top svg {
  width: 20px;
  height: 20px;
}

/* --------------------------------------------------------------------------
   Keyframes & Animations
   -------------------------------------------------------------------------- */
@keyframes tplPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

@keyframes tplFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes tplOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes tplCounterOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

/* Scroll reveal helper */
.tpl-a .tpl-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.tpl-a .tpl-reveal.is-revealed {
  opacity: 1;
  transform: translateY(0);
}
`.trim();
