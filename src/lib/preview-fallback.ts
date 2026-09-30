import { z } from "zod";
import type { PortfolioData } from "./schema/portfolio";
import {
  basicsSchema,
  contactSchema,
  skillSchema,
  experienceSchema,
  educationSchema,
  projectSchema,
} from "./schema/portfolio";
import { samplePortfolioData } from "@/templates/sample-data";

export type SectionKey =
  | "basics"
  | "contact"
  | "skills"
  | "experience"
  | "education"
  | "projects";

export interface FallbackDetail {
  section: SectionKey;
  source: "last-valid" | "sample";
}

export interface PreviewResolution {
  data: PortfolioData;
  fallbackSections: FallbackDetail[];
}

function resolveSection<T>(
  schema: z.ZodType<T>,
  draft: unknown,
  lastValid: T | undefined,
  sample: T,
  sectionName: SectionKey
): { value: T; fallback?: FallbackDetail } {
  // 1. Check draft section
  if (draft !== undefined && draft !== null) {
    const draftResult = schema.safeParse(draft);
    if (draftResult.success) {
      return { value: draftResult.data };
    }
  }

  // 2. Check last valid section
  if (lastValid !== undefined && lastValid !== null) {
    const lastResult = schema.safeParse(lastValid);
    if (lastResult.success) {
      return {
        value: lastResult.data,
        fallback: { section: sectionName, source: "last-valid" },
      };
    }
  }

  // 3. Fallback to sample section
  return {
    value: sample,
    fallback: { section: sectionName, source: "sample" },
  };
}

/**
 * Pure function to resolve preview data from partial or in-progress form drafts.
 * Priority per section:
 * 1. Draft section (if it parses successfully against Zod schema)
 * 2. Last valid section (if cached and parses successfully)
 * 3. Default sample section (guarantees preview never breaks or crashes)
 */
export function resolvePreviewData(
  draft: Record<string, unknown> | null | undefined,
  lastValid?: PortfolioData | null,
  sample: PortfolioData = samplePortfolioData
): PreviewResolution {
  const fallbacks: FallbackDetail[] = [];

  const basicsRes = resolveSection(
    basicsSchema,
    draft?.basics,
    lastValid?.basics,
    sample.basics,
    "basics"
  );
  if (basicsRes.fallback) fallbacks.push(basicsRes.fallback);

  const contactRes = resolveSection(
    contactSchema,
    draft?.contact,
    lastValid?.contact,
    sample.contact,
    "contact"
  );
  if (contactRes.fallback) fallbacks.push(contactRes.fallback);

  const skillsRes = resolveSection(
    z.array(skillSchema).max(30),
    draft?.skills,
    lastValid?.skills,
    sample.skills,
    "skills"
  );
  if (skillsRes.fallback) fallbacks.push(skillsRes.fallback);

  const experienceRes = resolveSection(
    z.array(experienceSchema).max(10),
    draft?.experience,
    lastValid?.experience,
    sample.experience,
    "experience"
  );
  if (experienceRes.fallback) fallbacks.push(experienceRes.fallback);

  const educationRes = resolveSection(
    z.array(educationSchema).max(6),
    draft?.education,
    lastValid?.education,
    sample.education,
    "education"
  );
  if (educationRes.fallback) fallbacks.push(educationRes.fallback);

  const projectsRes = resolveSection(
    z.array(projectSchema).max(12),
    draft?.projects,
    lastValid?.projects,
    sample.projects,
    "projects"
  );
  if (projectsRes.fallback) fallbacks.push(projectsRes.fallback);

  return {
    data: {
      basics: basicsRes.value,
      contact: contactRes.value,
      skills: skillsRes.value,
      experience: experienceRes.value,
      education: educationRes.value,
      projects: projectsRes.value,
    },
    fallbackSections: fallbacks,
  };
}
