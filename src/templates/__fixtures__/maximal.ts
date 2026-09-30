import type { PortfolioData } from "@/lib/schema/portfolio";

export const maximalFixture: PortfolioData = {
  basics: {
    fullName: "Alexandria Bartholomew Constantine-Montgomery the Third",
    title:
      "Principal Distributed Systems Architect, Cloud Infrastructure Specialist & Senior Staff Engineer",
    bio: "Passionate systems engineer with over fifteen years of industry experience crafting resilient, fault-tolerant microservices, high-throughput distributed message queues, and cross-platform native interfaces. Expert in distributed database consensus, event-driven architectures, and developer tooling. Dedicated to mentoring teams, advocating for inclusive engineering practices, and writing clean, maintainable, and observable production code across multiple cloud providers.",
    bioQuote:
      "Simplicity is prerequisite for reliability, and elegant software architecture enables velocity.",
    location: "San Francisco, California, United States",
    photo: "00000000-0000-4000-8000-000000000099.webp",
  },
  contact: {
    email: "alexandria.constantine@example.com",
    phone: "+1-555-0199",
    github: "https://github.com/example-alexandria",
    linkedin: "https://linkedin.com/in/example-alexandria",
    twitter: "https://twitter.com/example_alex",
    website: "https://alexandria-systems.example.com",
    resumeUrl: "https://alexandria-systems.example.com/resume.pdf",
  },
  skills: Array.from({ length: 30 }, (_, i) => ({
    name: `Technical Skill ${i + 1}`,
    category: i < 10 ? "Systems Engineering" : i < 20 ? "Cloud Architecture" : "Core Languages",
  })),
  experience: Array.from({ length: 10 }, (_, i) => ({
    company: `Enterprise Technologies Global Group ${i + 1}`,
    role: `Staff Infrastructure Architect Level ${i + 1}`,
    startDate: `201${i}-01`,
    endDate: i === 0 ? "Present" : `201${i + 1}-01`,
    location: "San Francisco, CA, Remote",
    workType: i % 2 === 0 ? "Full-time" : "Contract",
    description:
      "Spearheaded large-scale migration of legacy distributed services to Kubernetes clusters, reducing infrastructure compute costs by 38% and lowering p99 latency by 120ms. Designed high-availability failover mechanisms, automated CI/CD pipelines, and conducted architecture design reviews across multiple product squads.",
  })),
  education: Array.from({ length: 6 }, (_, i) => ({
    institution: `Institute of Advanced Computer Science ${i + 1}`,
    degree: `Master of Science in Distributed Computing ${i + 1}`,
    startDate: `200${i}-09`,
    endDate: `201${i}-06`,
  })),
  projects: Array.from({ length: 12 }, (_, i) => ({
    title: `Distributed High-Throughput Streaming Engine ${i + 1}`,
    description:
      "A resilient, distributed pub-sub streaming platform handling over 500,000 events per second with zero message loss and sub-millisecond replication. Built with custom consensus protocols and integrated observability.",
    tags: ["Rust", "TypeScript", "Kafka", "Docker", "gRPC", "Prometheus"],
    liveUrl: "https://demo.example.com/project-stream",
    repoUrl: "https://github.com/example-alexandria/project-stream",
    image: `00000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}.webp`,
  })),
};
