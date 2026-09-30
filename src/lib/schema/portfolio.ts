import { z } from "zod";

const httpsUrl = z
  .string()
  .url()
  .refine((u) => u.startsWith("https://"), "Must start with https://");

export const optionalUrl = httpsUrl
  .optional()
  .or(z.literal("").transform(() => undefined));

export const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/; // 3–30 chars

export const projectSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(500),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  image: z.string().optional(), // stored filename, not a URL
});

export const experienceSchema = z.object({
  company: z.string().min(1).max(80),
  role: z.string().min(1).max(80),
  startDate: z.string().min(1), // "2022-03"
  endDate: z.string().optional(), // empty = present
  description: z.string().max(800).default(""),
  location: z.string().max(80).optional(),
  workType: z.string().max(40).optional(), // e.g. "Full-time", "Remote"
});

export const educationSchema = z.object({
  institution: z.string().min(1).max(120),
  degree: z.string().min(1).max(120),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(40),
  category: z.string().max(40).optional(), // e.g. "Frontend"
});

export const portfolioDataSchema = z.object({
  basics: z.object({
    fullName: z.string().min(2).max(80),
    title: z.string().min(2).max(100),
    bio: z.string().min(10).max(600),
    bioQuote: z.string().max(200).optional(),
    location: z.string().max(80).optional(),
    photo: z.string().optional(), // stored filename
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().max(30).optional(),
    github: optionalUrl,
    linkedin: optionalUrl,
    twitter: optionalUrl,
    website: optionalUrl,
    resumeUrl: optionalUrl,
  }),
  skills: z.array(skillSchema).max(30).default([]),
  experience: z.array(experienceSchema).max(10).default([]),
  education: z.array(educationSchema).max(6).default([]),
  projects: z.array(projectSchema).max(12).default([]),
});

export type PortfolioData = z.infer<typeof portfolioDataSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;

export const createPortfolioSchema = z.object({
  slug: z.string().regex(SLUG_REGEX),
  templateId: z.enum(["template-a", "template-b"]),
  data: portfolioDataSchema,
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
