# DATA SCHEMA

The Zod schema in `src/lib/schema/portfolio.ts` is the **single source of truth**. Derive the
TypeScript type with `z.infer`. Use it in the form, the API, the DB read path, and templates.
Changing this file requires approval (it affects both templates).

## Zod schema (starting point — refine as needed)
```ts
import { z } from 'zod';

const httpsUrl = z.string().url().refine((u) => u.startsWith('https://'), 'Must start with https://');
const optionalUrl = httpsUrl.optional().or(z.literal('').transform(() => undefined));

export const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/; // 3–30 chars

export const projectSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(500),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  image: z.string().optional(),        // stored filename, not a URL
});

export const experienceSchema = z.object({
  company: z.string().min(1).max(80),
  role: z.string().min(1).max(80),
  startDate: z.string().min(1),        // "2022-03"
  endDate: z.string().optional(),      // empty = present
  description: z.string().max(800).default(''),
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
  category: z.string().max(40).optional(),   // e.g. "Frontend"
});

export const portfolioDataSchema = z.object({
  basics: z.object({
    fullName: z.string().min(2).max(80),
    title: z.string().min(2).max(100),
    bio: z.string().min(10).max(600),
    bioQuote: z.string().max(200).optional(),
    location: z.string().max(80).optional(),
    photo: z.string().optional(),      // stored filename
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

export const createPortfolioSchema = z.object({
  slug: z.string().regex(SLUG_REGEX),
  templateId: z.enum(['template-a', 'template-b']),
  data: portfolioDataSchema,
});
```

## Prisma model
```prisma
model Portfolio {
  id            String   @id @default(cuid())
  slug          String   @unique
  templateId    String                     // 'template-a' | 'template-b'
  data          String                     // JSON text, validated by portfolioDataSchema
  editTokenHash String                     // SHA-256 of the edit token
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```
SQLite has no native JSON type in Prisma, so store JSON as a string. Always
`portfolioDataSchema.parse(JSON.parse(row.data))` on read.

## Reserved slugs
`www, api, app, admin, dashboard, edit, create, p, _next, static, assets, uploads, mail,
ftp, ns1, ns2, root, support, help, blog, docs, login, signup`

## Notes
- Adding fields later: make them optional or give a `default`, so old rows still parse.
- If reference portfolios need fields not listed here (e.g. testimonials, certifications),
  propose additions in your plan and wait for approval before changing the schema.
