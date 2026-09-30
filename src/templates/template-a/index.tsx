/* eslint-disable @next/next/no-img-element */
import React from "react";
import type { PortfolioData, Project } from "@/lib/schema/portfolio";
import type { PortfolioTemplate, RenderOptions } from "../types";
import { templateACss } from "./styles";
import { templateAScript } from "./script";

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
