import { z } from "zod";
import { portfolioDataSchema } from "@/lib/schema/portfolio";

export type PortfolioFormValues = z.input<typeof portfolioDataSchema>;

export const defaultFormValues: PortfolioFormValues = {
  basics: {
    fullName: "",
    title: "",
    bio: "",
    bioQuote: "",
    availability: "",
    location: "",
    photo: undefined,
  },
  contact: {
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    resumeUrl: "",
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
};

export const STEP_NAMES = [
  "Template & Basics",
  "Contact & Links",
  "Skills",
  "Career & Education",
  "Featured Projects",
  "Review & Summary",
] as const;

export interface BuilderAppProps {
  mode?: "create" | "edit";
  initialData?: PortfolioFormValues;
  initialSlug?: string;
  initialTemplateId?: "template-a" | "template-b";
}
