import type { PortfolioData } from "@/lib/schema/portfolio";

export const minimalFixture: PortfolioData = {
  basics: {
    fullName: "Jane Doe",
    title: "Software Engineer",
    bio: "Building robust, scalable applications with a focus on simplicity and maintainability.",
  },
  contact: {
    email: "jane.doe@example.com",
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
};
