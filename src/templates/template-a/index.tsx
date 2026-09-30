/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { PortfolioData, Project } from "@/lib/schema/portfolio";
import type { PortfolioTemplate, RenderOptions } from "../types";
import { templateACss } from "./styles";
import { templateAScript } from "./script";

/**
 * Sanitizes an external URL to only allow https:// or mailto: schemes.
 * Rejects javascript:, data:, and relative script injections.
 */
function sanitizeHref(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  return undefined;
}

// Inline SVGs for clean, zero-dependency rendering

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function AvatarPlaceholder() {
  return (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ProjectPlaceholder() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--tpl-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

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
    <div className="tpl-a">
      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <header className="tpl-nav-wrap">
        <div className="tpl-container">
          <nav className="tpl-nav" aria-label="Main navigation">
            <a href="#hero" className="tpl-brand">
              {basics.fullName}
            </a>

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

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {safeResumeUrl && (
                <a
                  href={safeResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tpl-resume-btn"
                >
                  <span>Resume</span>
                  <ArrowUpRightIcon />
                </a>
              )}

              <button
                type="button"
                className="tpl-nav-toggle"
                aria-label="Toggle navigation menu"
                aria-expanded="false"
              >
                <MenuIcon />
              </button>
            </div>
          </nav>

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
      </header>

      <main>
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section id="hero" className="tpl-hero">
          <div className="tpl-container">
            <div className="tpl-hero-grid">
              <div className="tpl-hero-text">
                <span className="tpl-badge">Portfolio</span>
                <h1 className="tpl-hero-title">{basics.fullName}</h1>
                <p className="tpl-hero-role">{basics.title}</p>
                <p className="tpl-hero-bio">{basics.bio}</p>

                <div className="tpl-hero-actions">
                  <a href="#contact" className="tpl-btn-primary">
                    Get in Touch
                  </a>
                  {hasProjects && (
                    <a href="#projects" className="tpl-btn-secondary">
                      View Work
                    </a>
                  )}
                </div>
              </div>

              <div className="tpl-hero-image-wrap">
                {basics.photo ? (
                  <img
                    src={`${opts.assetBase}/${encodeURIComponent(basics.photo)}`}
                    alt={basics.fullName}
                    className="tpl-avatar"
                  />
                ) : (
                  <div className="tpl-avatar-placeholder" aria-label={basics.fullName}>
                    <AvatarPlaceholder />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Curved SVG transition */}
        <svg
          className="tpl-divider"
          style={{ color: "#ffffff", background: "var(--tpl-bg)" }}
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 C300,48 900,48 1200,0 L1200,48 L0,48 Z" />
        </svg>

        {/* ── About Section ─────────────────────────────────────────────── */}
        <section id="about" className="tpl-section tpl-about">
          <div className="tpl-container">
            <div className="tpl-header-block">
              <span className="tpl-badge">Background</span>
              <h2 className="tpl-title">About Me</h2>
              <p className="tpl-subtitle">
                A brief overview of my engineering focus, journey, and technical values.
              </p>
            </div>

            <div className="tpl-about-card">
              {basics.bioQuote && (
                <div className="tpl-about-quote">
                  &ldquo;{basics.bioQuote}&rdquo;
                </div>
              )}
              <div className="tpl-about-text">{basics.bio}</div>

              {(basics.location || contact.email) && (
                <div className="tpl-about-meta">
                  {basics.location && (
                    <span className="tpl-meta-item">
                      <MapPinIcon />
                      <span>{basics.location}</span>
                    </span>
                  )}
                  {contact.email && (
                    <span className="tpl-meta-item">
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
          <section id="projects" className="tpl-section tpl-projects">
            <div className="tpl-container">
              <div className="tpl-header-block">
                <span className="tpl-badge">Featured Work</span>
                <h2 className="tpl-title">Projects</h2>
                <p className="tpl-subtitle">
                  Selected software applications, platforms, and open source repositories.
                </p>
              </div>

              {/* Tag filtering (omitted if no tags exist across projects) */}
              {allProjectTags.length > 0 && (
                <div className="tpl-filter-row" role="group" aria-label="Filter projects by tag">
                  <button
                    type="button"
                    className="tpl-filter-btn active"
                    data-filter="all"
                  >
                    All ({projects.length})
                  </button>
                  {allProjectTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="tpl-filter-btn"
                      data-filter={tag}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className="tpl-projects-grid">
                {projects.map((project, idx) => {
                  const safeLive = sanitizeHref(project.liveUrl);
                  const safeRepo = sanitizeHref(project.repoUrl);
                  const tagsJoin = (project.tags || []).join("||");

                  return (
                    <article
                      key={idx}
                      className="tpl-project-card"
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

                      <div className="tpl-project-content">
                        <h3 className="tpl-project-title">{project.title}</h3>
                        <p className="tpl-project-desc">{project.description}</p>

                        {project.tags && project.tags.length > 0 && (
                          <div className="tpl-tags">
                            {project.tags.map((t, tIdx) => (
                              <span key={tIdx} className="tpl-tag">
                                {t}
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
                                className="tpl-project-link"
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
                                className="tpl-project-link"
                              >
                                <span>Source Code</span>
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
          <section id="skills" className="tpl-section tpl-skills">
            <div className="tpl-container">
              <div className="tpl-header-block">
                <span className="tpl-badge">Core Competencies</span>
                <h2 className="tpl-title">Skills & Expertise</h2>
                <p className="tpl-subtitle">
                  Technologies, frameworks, and engineering tools applied across development.
                </p>
              </div>

              <div className="tpl-skills-grid">
                {skills.map((skill, sIdx) => (
                  <div key={sIdx} className="tpl-skill-card">
                    <span className="tpl-skill-name">{skill.name}</span>
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
          <section id="experience" className="tpl-section tpl-about">
            <div className="tpl-container">
              <div className="tpl-header-block">
                <span className="tpl-badge">Career & Learning</span>
                <h2 className="tpl-title">Experience & Education</h2>
                <p className="tpl-subtitle">
                  Professional roles, leadership impact, and academic background.
                </p>
              </div>

              <div className="tpl-timeline-wrap">
                {hasExperience &&
                  experience.map((exp, eIdx) => (
                    <div key={eIdx} className="tpl-timeline-card">
                      <div className="tpl-timeline-header">
                        <div>
                          <h3 className="tpl-timeline-role">{exp.role}</h3>
                          <div className="tpl-timeline-org">{exp.company}</div>
                        </div>
                        <span className="tpl-timeline-date">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      </div>

                      {(exp.location || exp.workType) && (
                        <div className="tpl-timeline-meta">
                          {exp.location && <span>{exp.location}</span>}
                          {exp.workType && <span>• {exp.workType}</span>}
                        </div>
                      )}

                      {exp.description && (
                        <p className="tpl-timeline-desc">{exp.description}</p>
                      )}
                    </div>
                  ))}

                {hasEducation &&
                  education.map((edu, eduIdx) => (
                    <div key={eduIdx} className="tpl-timeline-card">
                      <div className="tpl-timeline-header">
                        <div>
                          <h3 className="tpl-timeline-role">{edu.degree}</h3>
                          <div className="tpl-timeline-org">{edu.institution}</div>
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <span className="tpl-timeline-date">
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
        <section id="contact" className="tpl-section tpl-contact">
          <div className="tpl-container">
            <div className="tpl-header-block">
              <span className="tpl-badge">Let&apos;s Connect</span>
              <h2 className="tpl-title">Get in Touch</h2>
              <p className="tpl-subtitle">
                Available for engineering opportunities, collaborations, or inquiries.
              </p>
            </div>

            <div className="tpl-contact-grid">
              <div className="tpl-contact-card">
                <div className="tpl-contact-item">
                  <div className="tpl-contact-icon">
                    <MailIcon />
                  </div>
                  <div>
                    <div className="tpl-contact-label">Email</div>
                    {safeEmailHref ? (
                      <a href={safeEmailHref} className="tpl-contact-val">
                        {contact.email}
                      </a>
                    ) : (
                      <span className="tpl-contact-val">{contact.email}</span>
                    )}
                  </div>
                </div>

                {contact.phone && (
                  <div className="tpl-contact-item">
                    <div className="tpl-contact-icon">
                      <PhoneIcon />
                    </div>
                    <div>
                      <div className="tpl-contact-label">Phone</div>
                      {safePhoneHref ? (
                        <a href={safePhoneHref} className="tpl-contact-val">
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="tpl-contact-val">{contact.phone}</span>
                      )}
                    </div>
                  </div>
                )}

                {basics.location && (
                  <div className="tpl-contact-item">
                    <div className="tpl-contact-icon">
                      <MapPinIcon />
                    </div>
                    <div>
                      <div className="tpl-contact-label">Location</div>
                      <span className="tpl-contact-val">{basics.location}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="tpl-contact-card">
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  Profiles & Links
                </h3>
                <p style={{ fontSize: "0.925rem", color: "var(--tpl-muted)", margin: 0 }}>
                  Explore verified project repositories, professional profiles, and portfolio work.
                </p>

                <div className="tpl-social-row">
                  {safeGithub && (
                    <a
                      href={safeGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tpl-social-btn"
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
                      className="tpl-social-btn"
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
                      className="tpl-social-btn"
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
                      className="tpl-social-btn"
                      aria-label="Personal Website"
                    >
                      <GlobeIcon />
                    </a>
                  )}
                </div>

                {safeEmailHref && (
                  <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                    <a href={safeEmailHref} className="tpl-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                      Send an Email
                    </a>
                  </div>
                )}
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
            <span>Static-ready portfolio powered by Portfolio Builder.</span>
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

      {/* Tiny static interaction script (< 1.5 KB) */}
      <script dangerouslySetInnerHTML={{ __html: templateAScript }} />
    </div>
  );
}

export const templateA: PortfolioTemplate = {
  id: "template-a",
  name: "Clean Modern",
  description: "A refined, glassmorphic layout with elegant section dividers and tag-filtered showcases.",
  previewImage: "/previews/template-a.png",
  render,
  css: templateACss,
};
