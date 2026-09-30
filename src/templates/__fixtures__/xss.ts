import type { PortfolioData } from "@/lib/schema/portfolio";

export const xssProbePayload = "<script>alert('xss-probe')</script><img src=x onerror=alert('xss-img')>";

/**
 * Fixture containing XSS probes across every text field.
 * All URLs remain schema-compliant (https) so portfolioDataSchema validation passes,
 * but all text fields contain raw HTML tags and script injections to verify escaping.
 */
export const xssTextFixture: PortfolioData = {
  basics: {
    fullName: `Alex <script>alert('xss-name')</script>`,
    title: `Lead Engineer <img src=x onerror=alert('xss-title')>`,
    bio: `Bio content with <script>alert('xss-bio')</script> and <b>bold tags</b> & special "quotes" & ampersands.`,
    bioQuote: `Quote with <script>alert('xss-quote')</script>`,
    location: `City <script>alert('xss-loc')</script>`,
    photo: "00000000-0000-4000-8000-000000000066.webp",
  },
  contact: {
    email: "xss-tester@example.com",
    phone: "+1-555-0100",
    github: "https://github.com/example-xss",
    linkedin: "https://linkedin.com/in/example-xss",
    twitter: "https://twitter.com/example_xss",
    website: "https://example.com/site",
    resumeUrl: "https://example.com/cv.pdf",
  },
  skills: [
    {
      name: `React <script>alert('xss-skill')</script>`,
      category: `Frontend <script>alert('xss-cat')</script>`,
    },
  ],
  experience: [
    {
      company: `Acme Corp <script>alert('xss-company')</script>`,
      role: `Architect <script>alert('xss-role')</script>`,
      startDate: "2020-01",
      endDate: "Present",
      description: `Description with <script>alert('xss-desc')</script>`,
      location: `Remote <script>alert('xss-exploc')</script>`,
      workType: `Full-time <script>alert('xss-worktype')</script>`,
    },
  ],
  education: [
    {
      institution: `University <script>alert('xss-inst')</script>`,
      degree: `B.S. <script>alert('xss-deg')</script>`,
      startDate: "2016-09",
      endDate: "2020-06",
    },
  ],
  projects: [
    {
      title: `Project <script>alert('xss-proj')</script>`,
      description: `Project description <script>alert('xss-projdesc')</script>`,
      tags: [`Tag <script>alert('xss-tag')</script>`],
      liveUrl: "https://example.com/live",
      repoUrl: "https://example.com/repo",
      image: "00000000-0000-4000-8000-000000000077.webp",
    },
  ],
};

/**
 * Malicious URL payloads to verify schema rejection of javascript: and data: URIs.
 */
export const maliciousUrlPayloads = [
  "javascript:alert('xss')",
  "javascript://%0aalert(1)",
  "JAVASCRIPT:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
  "vbscript:msgbox(1)",
  "http://insecure-http.example.com",
];
