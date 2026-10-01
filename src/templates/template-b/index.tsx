/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { PortfolioData, Project } from "@/lib/schema/portfolio";
import type { PortfolioTemplate, RenderOptions } from "../types";
import { templateBCss } from "./styles";
import { templateBEarlyScript, templateBScript } from "./script";
import { sanitizeHref } from "../shared/sanitize";
import {
  MenuIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
  GlobeIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  AvatarPlaceholder,
  ProjectPlaceholder,
} from "../shared/icons";

export function render(data: PortfolioData, opts: RenderOptions): React.ReactElement {
  const { basics, contact, skills, experience, education, projects } = data;

  const hasSkills = skills && skills.length > 0;
  const hasProjects = projects && projects.length > 0;
  const hasExperience = experience && experience.length > 0;
  const hasEducation = education && education.length > 0;

  // Extract unique tags across projects for dynamic filter
  const allProjectTags = Array.from(
    new Set(
      projects.flatMap((p: Project) => p.tags || []).map((t) => t.trim())
    )
  ).filter(Boolean);

  const safeResumeUrl = sanitizeHref(contact.resumeUrl);
  const safeGithub = sanitizeHref(contact.github);
  const safeLinkedin = sanitizeHref(contact.linkedin);
  const safeTwitter = sanitizeHref(contact.twitter);
  const safeWebsite = sanitizeHref(contact.website);
  const safeEmailHref = contact.email ? `mailto:${contact.email.trim()}` : undefined;
  const safePhoneHref = contact.phone ? `tel:${contact.phone.replace(/[^+\d]/g, "")}` : undefined;

  return (
    <div className="tpl-b">
      {/* Anti-flash inline script to restore theme before first paint */}
      <script dangerouslySetInnerHTML={{ __html: templateBEarlyScript }} />

      {/* ── Floating Pill Navbar ────────────────────────────────────────── */}
      <div className="tpl-nav-wrap">
        <header className="tpl-nav-pill">
          {/* Brand Logo Pill */}
          <a href="#hero" className="tpl-brand-pill">
            <span>{basics.fullName}</span>
            <span className="tpl-brand-star" aria-hidden="true">
              ✦
            </span>
          </a>

          {/* Center Navigation Links */}
          <nav aria-label="Main navigation">
            <ul className="tpl-nav-links">
              <li>
                <a href="#about" className="tpl-nav-link">
                  About
                </a>
              </li>
              {hasProjects && (
                <li>
                  <a href="#projects" className="tpl-nav-link">
                    Projects
                  </a>
                </li>
              )}
              {hasSkills && (
                <li>
                  <a href="#skills" className="tpl-nav-link">
                    Skills
                  </a>
                </li>
              )}
              {(hasExperience || hasEducation) && (
                <li>
                  <a href="#experience" className="tpl-nav-link">
                    Experience
                  </a>
                </li>
              )}
              <li>
                <a href="#contact" className="tpl-nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Actions: Theme Toggle, CTA, and Mobile Toggle */}
          <div className="tpl-nav-actions">
            <button
              type="button"
              className="tpl-theme-toggle"
              aria-label="Toggle dark mode theme"
              aria-pressed="false"
            >
              <span className="tpl-sun-icon" aria-hidden="true">
                <SunIcon />
              </span>
              <span className="tpl-moon-icon" aria-hidden="true">
                <MoonIcon />
              </span>
            </button>

            {safeResumeUrl ? (
              <a
                href={safeResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tpl-cta-btn"
              >
                <span>Resume</span>
                <ArrowUpRightIcon />
              </a>
            ) : safeEmailHref ? (
              <a href={safeEmailHref} className="tpl-cta-btn">
                <span>Let&apos;s Talk</span>
                <SparklesIcon />
              </a>
            ) : null}

            <button
              type="button"
              className="tpl-nav-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <MenuIcon />
            </button>
          </div>
        </header>

        {/* Mobile dropdown menu */}
        <div className="tpl-mobile-menu">
          <a href="#about" className="tpl-nav-link">
            About
          </a>
          {hasProjects && (
            <a href="#projects" className="tpl-nav-link">
              Projects
            </a>
          )}
          {hasSkills && (
            <a href="#skills" className="tpl-nav-link">
              Skills
            </a>
          )}
          {(hasExperience || hasEducation) && (
            <a href="#experience" className="tpl-nav-link">
              Experience
            </a>
          )}
          <a href="#contact" className="tpl-nav-link">
            Contact
          </a>
        </div>
      </div>

      <main>
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section id="hero" className="tpl-section">
          <div className="tpl-container">
            <div className={`tpl-hero-grid ${basics.photo ? "" : "is-centered"}`}>
              {/* Left Column: Typography & CTAs */}
              <div className="tpl-b-reveal">
                {basics.availability && (
                  <div className="tpl-availability-wrap">
                    <span className="tpl-availability-pill">
                      <span className="tpl-availability-dot" aria-hidden="true" />
                      <span>{basics.availability}</span>
                    </span>
                  </div>
                )}
                <div className="tpl-hero-greeting">Hi there, I&apos;m</div>
                <h1 className="tpl-hero-headline">{basics.fullName}</h1>
                <div className="tpl-hero-role">{basics.title}</div>

                {basics.bioQuote && (
                  <div className="tpl-quote-card">
                    <p className="tpl-quote-text">&ldquo;{basics.bioQuote}&rdquo;</p>
                  </div>
                )}

                <p className="tpl-hero-bio">{basics.bio}</p>

                <div className="tpl-hero-actions">
                  <a href="#contact" className="tpl-btn-pop-primary">
                    <span>Let&apos;s Connect</span>
                    <ArrowUpRightIcon />
                  </a>
                  {hasProjects && (
                    <a href="#projects" className="tpl-btn-pop-secondary">
                      <span>View Work</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Polaroid Photo Card with Tape Sticker */}
              <div className="tpl-polaroid-col tpl-b-reveal">
                <div className="tpl-polaroid-wrap">
                  {/* Tape sticker text derived from basics.title, not hardcoded */}
                  {basics.title && (
                    <div className="tpl-tape-sticker">
                      {`/// ${basics.title} ///`}
                    </div>
                  )}

                  <div className="tpl-polaroid-card">
                    <div className="tpl-polaroid-inner">
                      {basics.photo ? (
                        <img
                          src={`${opts.assetBase}/${encodeURIComponent(basics.photo)}`}
                          alt={basics.fullName}
                          className="tpl-polaroid-img"
                        />
                      ) : (
                        <div
                          className="tpl-polaroid-placeholder"
                          aria-label={basics.fullName}
                        >
                          <AvatarPlaceholder />
                        </div>
                      )}
                      <div className="tpl-polaroid-orb" aria-hidden="true">
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PART 2: Notebook Entry #01 Card (Eliminates Blank Space between Hero & Sections) */}
            <div className="tpl-notebook-card tpl-b-reveal">
              <div className="tpl-notebook-top-badge">
                <div className="tpl-notebook-pill">
                  <SparklesIcon />
                  <span>Notebook Entry #01</span>
                </div>
              </div>

              <div className="tpl-notebook-grid">
                {/* Left: Terminal Code Mock */}
                <div className="tpl-terminal-box">
                  <div className="tpl-terminal-header">
                    <div className="tpl-terminal-dots">
                      <span className="tpl-dot-red" />
                      <span className="tpl-dot-yellow" />
                      <span className="tpl-dot-green" />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--tpl-b-muted)" }}>
                      terminal.ts
                    </span>
                  </div>

                  <div className="tpl-terminal-code">
                    <div>
                      <span className="tpl-code-purple">const</span> creator = &#123;
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      name: <span className="tpl-code-green">&quot;{basics.fullName}&quot;</span>,
                    </div>
                    {basics.title && (
                      <div style={{ paddingLeft: "1rem" }}>
                        role: <span className="tpl-code-amber">&quot;{basics.title}&quot;</span>,
                      </div>
                    )}
                    <div style={{ paddingLeft: "1rem" }}>
                      status: <span className="tpl-code-green">&quot;{basics.availability || "Building Digital Magic"}&quot;</span>
                    </div>
                    <div>&#125;;</div>
                  </div>

                  <div className="tpl-terminal-footer">
                    <span>{"/// CRAFTING CODE ///"}</span>
                    <span>✦ ACTIVE</span>
                  </div>
                </div>

                {/* Right: Narrative Story + Sticky Note Badges */}
                <div>
                  <h3 style={{ fontSize: "1.75rem", fontWeight: 900, margin: "0 0 0.75rem 0", color: "var(--tpl-b-fg)", letterSpacing: "-0.02em" }}>
                    Curious Creator & Problem Solver
                  </h3>
                  <p style={{ fontSize: "1.05rem", color: "var(--tpl-b-muted)", lineHeight: 1.65, margin: "0 0 1rem 0", fontWeight: 500 }}>
                    Turning ideas into colorful, tactile digital experiences with robust architecture, thoughtful animations, and accessible design.
                  </p>

                  <div className="tpl-sticky-notes-row">
                    <div className="tpl-sticky-note tpl-sticky-amber">
                      &quot;make it interactive! 🚀&quot;
                    </div>
                    <div className="tpl-sticky-note tpl-sticky-sky">
                      &quot;coffee ➔ code ➔ repeat ☕&quot;
                    </div>
                    <div className="tpl-sticky-note tpl-sticky-emerald">
                      &quot;love good UI ✦&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About Section ─────────────────────────────────────────────── */}
        <section id="about" className="tpl-section">
          <div className="tpl-container">
            <div className="tpl-header-block tpl-b-reveal">
              <span className="tpl-badge">
                <SparklesIcon />
                <span>OVERVIEW</span>
              </span>
              <h2 className="tpl-title">About Me</h2>
              <p className="tpl-subtitle">Background, values, and core professional experience.</p>
            </div>

            <div className="tpl-about-card tpl-b-reveal">
              <p className="tpl-about-bio">{basics.bio}</p>

              {(basics.location || contact.email) && (
                <div className="tpl-about-meta">
                  {basics.location && (
                    <span className="tpl-about-meta-item">
                      <MapPinIcon />
                      <span>{basics.location}</span>
                    </span>
                  )}
                  {contact.email && (
                    <span className="tpl-about-meta-item">
                      <MailIcon />
                      <span>{contact.email}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Projects Section ─────────────────────────────────────────── */}
        {hasProjects && (
          <section id="projects" className="tpl-section">
            <div className="tpl-container">
              <div className="tpl-header-block tpl-b-reveal">
                <span className="tpl-badge">
                  <SparklesIcon />
                  <span>SHOWCASE</span>
                </span>
                <h2 className="tpl-title">Featured Projects</h2>
                <p className="tpl-subtitle">Selected work, projects, and case studies.</p>
              </div>

              {/* Tag filtering pills */}
              {allProjectTags.length > 0 && (
                <div className="tpl-b-filter-row tpl-b-reveal" role="group" aria-label="Filter projects by tag">
                  <button
                    type="button"
                    className="tpl-b-filter-btn active"
                    data-filter="all"
                  >
                    All ({projects.length})
                  </button>
                  {allProjectTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="tpl-b-filter-btn"
                      data-filter={tag}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <p className="tpl-b-project-count" aria-live="polite">
                Showing {projects.length} of {projects.length} projects
              </p>

              <div className="tpl-projects-grid">
                {projects.map((project, idx) => {
                  const safeLive = sanitizeHref(project.liveUrl);
                  const safeRepo = sanitizeHref(project.repoUrl);
                  const tagsJoin = (project.tags || []).join("||");

                  return (
                    <article
                      key={idx}
                      className="tpl-project-card tpl-b-reveal"
                      data-tags={tagsJoin}
                    >
                      <div className="tpl-project-thumb">
                        {project.image ? (
                          <img
                            src={`${opts.assetBase}/${encodeURIComponent(project.image)}`}
                            alt={project.title}
                            className="tpl-project-img"
                            loading="lazy"
                          />
                        ) : (
                          <ProjectPlaceholder />
                        )}
                      </div>

                      <div className="tpl-project-body">
                        <h3 className="tpl-project-title">{project.title}</h3>
                        <p className="tpl-project-desc">{project.description}</p>

                        {project.tags && project.tags.length > 0 && (
                          <div className="tpl-tags">
                            {project.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="tpl-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {(safeLive || safeRepo) && (
                          <div className="tpl-project-links">
                            {safeLive && (
                              <a
                                href={safeLive}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tpl-action-link"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRightIcon />
                              </a>
                            )}
                            {safeRepo && (
                              <a
                                href={safeRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tpl-action-link"
                              >
                                <span>Code</span>
                                <ArrowUpRightIcon />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Skills Section ───────────────────────────────────────────── */}
        {hasSkills && (
          <section id="skills" className="tpl-section">
            <div className="tpl-container">
              <div className="tpl-header-block tpl-b-reveal">
                <span className="tpl-badge">
                  <SparklesIcon />
                  <span>EXPERTISE</span>
                </span>
                <h2 className="tpl-title">Skills & Capabilities</h2>
                <p className="tpl-subtitle">Core proficiencies, skills, and tools.</p>
              </div>

              <div className="tpl-skills-grid">
                {skills.map((skill, sIdx) => (
                  <div key={sIdx} className="tpl-skill-pill tpl-b-reveal">
                    <span>{skill.name}</span>
                    {skill.category && (
                      <span className="tpl-skill-cat">{skill.category}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Experience & Education Section ───────────────────────────── */}
        {(hasExperience || hasEducation) && (
          <section id="experience" className="tpl-section">
            <div className="tpl-container">
              <div className="tpl-header-block tpl-b-reveal">
                <span className="tpl-badge">
                  <SparklesIcon />
                  <span>CAREER PATH</span>
                </span>
                <h2 className="tpl-title">Experience & Education</h2>
                <p className="tpl-subtitle">Professional track record and educational background.</p>
              </div>

              <div className="tpl-timeline-wrap">
                {hasExperience &&
                  experience.map((exp, eIdx) => (
                    <div key={eIdx} className="tpl-career-card tpl-b-reveal">
                      <div className="tpl-career-header">
                        <div>
                          <h3 className="tpl-career-role">{exp.role}</h3>
                          <div className="tpl-career-company">{exp.company}</div>
                        </div>

                        <div className="tpl-career-pills">
                          <span className="tpl-pop-pill-sm">
                            {exp.startDate} – {exp.endDate || "Present"}
                          </span>
                          {exp.workType && (
                            <span className="tpl-pop-pill-sm">{exp.workType}</span>
                          )}
                          {exp.location && (
                            <span className="tpl-pop-pill-sm">{exp.location}</span>
                          )}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="tpl-career-desc">{exp.description}</p>
                      )}
                    </div>
                  ))}

                {hasEducation &&
                  education.map((edu, eduIdx) => (
                    <div key={eduIdx} className="tpl-career-card tpl-b-reveal">
                      <div className="tpl-career-header">
                        <div>
                          <h3 className="tpl-career-role">{edu.degree}</h3>
                          <div className="tpl-career-company">{edu.institution}</div>
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <span className="tpl-pop-pill-sm">
                            {edu.startDate || ""}
                            {edu.startDate && edu.endDate ? " – " : ""}
                            {edu.endDate || ""}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ──────────────────────────────────────────── */}
        <section id="contact" className="tpl-section">
          <div className="tpl-container">
            <div className="tpl-contact-box tpl-b-reveal">
              <div className="tpl-contact-grid">
                <div>
                  <h2 className="tpl-contact-title">Let&apos;s Work Together</h2>
                  <p className="tpl-contact-sub">
                    Open for new opportunities, collaborations, and projects.
                  </p>

                  <div className="tpl-contact-details">
                    {safeEmailHref && (
                      <a href={safeEmailHref} className="tpl-contact-row">
                        <MailIcon />
                        <span>{contact.email}</span>
                      </a>
                    )}
                    {safePhoneHref && (
                      <a href={safePhoneHref} className="tpl-contact-row">
                        <PhoneIcon />
                        <span>{contact.phone}</span>
                      </a>
                    )}
                    {basics.location && (
                      <div className="tpl-contact-row">
                        <MapPinIcon />
                        <span>{basics.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="tpl-connect-heading">Connect & Follow</div>
                  <div className="tpl-social-grid">
                    {safeGithub && (
                      <a
                        href={safeGithub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tpl-social-pop"
                        aria-label="GitHub profile"
                      >
                        <GitHubIcon />
                      </a>
                    )}
                    {safeLinkedin && (
                      <a
                        href={safeLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tpl-social-pop"
                        aria-label="LinkedIn profile"
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                    {safeTwitter && (
                      <a
                        href={safeTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tpl-social-pop"
                        aria-label="Twitter profile"
                      >
                        <TwitterIcon />
                      </a>
                    )}
                    {safeWebsite && (
                      <a
                        href={safeWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tpl-social-pop"
                        aria-label="Personal Website"
                      >
                        <GlobeIcon />
                      </a>
                    )}
                  </div>

                  {safeEmailHref && (
                    <div style={{ marginTop: "1.5rem" }}>
                      <a
                        href={safeEmailHref}
                        className="tpl-btn-pop-primary tpl-btn-full"
                      >
                        Send an Email
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="tpl-footer">
        <div className="tpl-container">
          <div className="tpl-footer-inner">
            <span>© {new Date().getFullYear()} {basics.fullName}. All rights reserved.</span>
            <span>✦ Neo-Pop Portfolio powered by Portfolio Builder</span>
          </div>
        </div>

        <button
          type="button"
          className="tpl-scroll-top"
          aria-label="Scroll back to top"
        >
          <ArrowUpIcon />
        </button>
      </footer>

      {/* Tiny static interaction script (< 2 KB) */}
      <script dangerouslySetInnerHTML={{ __html: templateBScript }} />
    </div>
  );
}

export const templateB: PortfolioTemplate = {
  id: "template-b",
  name: "Neo-Pop",
  description: "A bold, playful neo-brutalist aesthetic with hard shadows, polaroid frames, terminal cards, and dark mode.",
  previewImage: "/previews/template-b.png",
  render,
  css: templateBCss,
};
