import type { PortfolioData } from "@/lib/schema/portfolio";

/**
 * Canonical fictional sample portfolio data for template previews, tests, and chooser cards.
 * All names, emails, phones, domains, and profile links are completely fictional.
 */
export const samplePortfolioData: PortfolioData = {
  basics: {
    fullName: "Jordan Vance",
    title: "Full Stack Engineer & AI Specialist",
    bio: "Passionate software engineer focused on building modern, performant, and reliable web applications. Experienced across TypeScript, Next.js, Node.js, Python, and scalable cloud architectures. Interested in integrating intelligent AI models and workflows into production-grade systems with robust observability.",
    bioQuote:
      "Crafting clean code and intuitive digital experiences with purpose and attention to detail.",
    location: "Austin, Texas",
    photo: "sample-profile.png",
  },
  contact: {
    email: "jordan.vance@example.com",
    phone: "+1-555-0142",
    github: "https://github.com/example-jordan",
    linkedin: "https://linkedin.com/in/example-jordan",
    twitter: "https://twitter.com/example_jordan",
    website: "https://jordanvance.example.com",
    resumeUrl: "https://jordanvance.example.com/resume.pdf",
  },
  skills: [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Express", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "FastAPI", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "Docker", category: "DevOps" },
    { name: "AWS", category: "DevOps" },
    { name: "LLM Integration", category: "AI" },
    { name: "RAG Systems", category: "AI" },
  ],
  experience: [
    {
      company: "Apex Cloud Solutions",
      role: "Senior Full Stack Engineer",
      startDate: "2022-03",
      endDate: "Present",
      description:
        "Architected and deployed customer-facing SaaS dashboards with micro-frontends and serverless backends. Reduced API response times by 35% and improved test automation coverage.",
      location: "Austin, TX (Remote)",
      workType: "Full-time",
    },
    {
      company: "Modern Web Labs",
      role: "Software Developer",
      startDate: "2019-08",
      endDate: "2022-02",
      description:
        "Built responsive client portals, optimized database queries in PostgreSQL, and collaborated with design teams to maintain design system components.",
      location: "Dallas, TX",
      workType: "Full-time",
    },
  ],
  education: [
    {
      institution: "State University of Technology",
      degree: "B.S. in Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
    },
  ],
  projects: [
    {
      title: "OmniSearch AI Assistant",
      description:
        "An intelligent semantic search and documentation assistant built with RAG vector indexing, fast embeddings retrieval, and a streamlined markdown interface.",
      tags: ["Next.js", "Python", "FastAPI", "Vector DB"],
      liveUrl: "https://omnisearch.example.com",
      repoUrl: "https://github.com/example-jordan/omnisearch",
      image: "project-omnisearch.png",
    },
    {
      title: "PulseFlow Analytics Dashboard",
      description:
        "Real-time analytics engine visualizing operational throughput, custom alerts, and performance metrics across distributed services.",
      tags: ["React", "TypeScript", "PostgreSQL", "Tailwind"],
      liveUrl: "https://pulseflow.example.com",
      repoUrl: "https://github.com/example-jordan/pulseflow",
      image: "project-pulseflow.png",
    },
    {
      title: "CartCraft E-Commerce Store",
      description:
        "A modular, mobile-first headless e-commerce store with real-time stock sync, localized payments, and an accessible shopping flow.",
      tags: ["Next.js", "TypeScript", "Stripe API", "Node.js"],
      liveUrl: "https://cartcraft.example.com",
      repoUrl: "https://github.com/example-jordan/cartcraft",
      image: "project-cartcraft.png",
    },
  ],
};
