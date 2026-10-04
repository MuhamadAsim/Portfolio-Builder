import { PDFParse } from "pdf-parse";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getTmpUploadsDir, ensureUploadDirs } from "./images";
import { PDF_FILENAME_REGEX } from "./schema/portfolio";

export const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB

export interface ExtractedResumeData {
  fullName?: string;
  title?: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills: { name: string }[];
}

export interface ParseResumeResult {
  filename: string;
  filepath: string;
  size: number;
  extracted: ExtractedResumeData;
  fieldsExtracted: string[];
}

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Rust",
  "Go",
  "Golang",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Sass",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "NestJS",
  "FastAPI",
  "Django",
  "Flask",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQLite",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Git",
  "GitHub",
  "GraphQL",
  "REST API",
  "Figma",
  "UI/UX",
  "Linux",
  "CI/CD",
  "Jest",
  "Vitest",
  "Prisma",
  "Redux",
  "Zustand",
  "Supabase",
  "Firebase",
  "Terraform",
];

const KNOWN_ROLES = [
  "Full Stack Developer",
  "Full Stack Engineer",
  "Frontend Developer",
  "Frontend Engineer",
  "Backend Developer",
  "Backend Engineer",
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Lead Software Engineer",
  "Software Developer",
  "Web Developer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "DevOps Engineer",
  "Cloud Architect",
  "Solutions Architect",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "Product Designer",
  "UI/UX Designer",
  "UX Designer",
  "Product Manager",
  "Engineering Manager",
  "Systems Architect",
  "QA Engineer",
  "Security Engineer",
];

function toTitleCase(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Validates that the buffer is a valid PDF under 5 MB.
 */
export function validatePdfBuffer(buffer: Buffer): void {
  if (buffer.length > MAX_PDF_SIZE) {
    throw new Error("PDF exceeds maximum allowed size of 5 MB");
  }

  if (buffer.length < 5) {
    throw new Error("File is too small to be a valid PDF");
  }

  // Check magic bytes %PDF-
  const header = buffer.subarray(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    throw new Error("Invalid file format. File must be a valid PDF document");
  }
}

/**
 * Extracts candidate information from plain text extracted from a resume.
 */
export function extractDataFromResumeText(text: string): ExtractedResumeData {
  const result: ExtractedResumeData = {
    skills: [],
  };

  const normalized = text.replace(/\r\n/g, "\n");
  const rawLines = normalized.split("\n").map((l) => l.trim());
  const lines = rawLines.filter((l) => l.length > 0);

  // 1. Email extraction
  const emailMatch = normalized.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
  );
  if (emailMatch) {
    result.email = emailMatch[0].toLowerCase();
  }

  // 2. Phone extraction (international or standard national)
  const phoneMatch = normalized.match(
    /(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}(?:[-.\s]?\d{1,4})?)/
  );
  if (phoneMatch) {
    const rawPhone = phoneMatch[0].trim();
    const digitCount = (rawPhone.match(/\d/g) || []).length;
    if (digitCount >= 7 && digitCount <= 15 && !rawPhone.startsWith("202") && !rawPhone.startsWith("201")) {
      result.phone = rawPhone;
    }
  }

  // 3. Social links
  const githubMatch = normalized.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]{1,39})/i
  );
  if (githubMatch) {
    result.github = `https://github.com/${githubMatch[1]}`;
  }

  const linkedinMatch = normalized.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]{1,100})/i
  );
  if (linkedinMatch) {
    result.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
  }

  const twitterMatch = normalized.match(
    /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_]{1,20})/i
  );
  if (twitterMatch) {
    result.twitter = `https://twitter.com/${twitterMatch[1]}`;
  }

  // 4. Candidate Full Name
  // Heuristic: Check the first 5 lines. Look for 2-4 clean capitalized words.
  const nameDisallowed = [
    "resume",
    "curriculum",
    "vitae",
    "cv",
    "page",
    "email",
    "phone",
    "contact",
    "profile",
    "summary",
    "experience",
    "skills",
    "education",
  ];

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (line.includes("@") || line.includes("http") || line.includes(".com") || line.length > 50 || line.length < 3) {
      continue;
    }
    const lower = line.toLowerCase();
    if (nameDisallowed.some((bad) => lower === bad || lower.startsWith(bad + " "))) {
      continue;
    }

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4) {
      // Must contain mostly letters, dots, hyphens
      if (/^[a-zA-Z\s.'-]+$/.test(line)) {
        // If entirely uppercase or lowercase, convert to Title Case
        if (line === line.toUpperCase() || line === line.toLowerCase()) {
          result.fullName = toTitleCase(line);
        } else {
          result.fullName = line;
        }
        break;
      }
    }
  }

  // 5. Professional Title
  // Heuristic: Check for exact known roles or lines immediately following the name
  for (const role of KNOWN_ROLES) {
    const roleRegex = new RegExp(`\\b${role.replace("+", "\\+")}\\b`, "i");
    if (roleRegex.test(normalized)) {
      result.title = role;
      break;
    }
  }

  // If no known role matched, check line immediately after the extracted name
  if (!result.title && result.fullName) {
    const nameIndex = lines.findIndex((l) => l.toLowerCase() === result.fullName?.toLowerCase() || l.toLowerCase().includes(result.fullName?.toLowerCase() || ""));
    if (nameIndex >= 0 && nameIndex + 1 < lines.length) {
      const nextLine = lines[nameIndex + 1];
      if (
        !nextLine.includes("@") &&
        !nextLine.includes("http") &&
        nextLine.length >= 3 &&
        nextLine.length <= 60 &&
        !nameDisallowed.some((bad) => nextLine.toLowerCase().includes(bad))
      ) {
        result.title = nextLine;
      }
    }
  }

  // 6. Location (City, State/Country on a single line)
  const locationMatch = normalized.match(
    /\b([A-Z][a-zA-Z .'-]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z .'-]+))\b/
  );
  if (locationMatch) {
    const loc = locationMatch[1].trim();
    if (!loc.includes("\n") && loc.length <= 60 && !loc.includes("University") && !loc.includes("College")) {
      result.location = loc;
    }
  }

  // 7. Bio / Professional Summary
  const summaryHeaderRegex =
    /(?:(?:PROFESSIONAL\s+)?SUMMARY|ABOUT\s+ME|PROFILE|OBJECTIVE)[\s:]*\n+([\s\S]{30,600}?)(?=\n+[A-Z\s]{4,}|\n+(?:EXPERIENCE|SKILLS|EDUCATION|PROJECTS)|$)/i;
  const summaryMatch = normalized.match(summaryHeaderRegex);
  if (summaryMatch) {
    const cleanBio = summaryMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ")
      .trim();
    if (cleanBio.length >= 10) {
      result.bio = cleanBio.slice(0, 600);
    }
  }

  // 8. Skills
  const detectedSkills = new Set<string>();
  for (const skill of COMMON_SKILLS) {
    // Escape special regex characters like +, ., #
    const escaped = skill
      .replace(/\+/g, "\\+")
      .replace(/\./g, "\\.")
      .replace(/#/g, "\\#");
    const regex = new RegExp(`(?:^|[\\s,;(|/])${escaped}(?=[\\s,;)|/]|\$)`, "i");
    if (regex.test(normalized)) {
      detectedSkills.add(skill);
    }
  }

  result.skills = Array.from(detectedSkills)
    .slice(0, 20)
    .map((name) => ({ name }));

  return result;
}

/**
 * Parses an uploaded PDF buffer, extracts text using pdf-parse,
 * parses structured resume data, and saves the file to uploads/tmp/${uuid}.pdf.
 */
export async function parseAndSaveResumePdf(buffer: Buffer): Promise<ParseResumeResult> {
  validatePdfBuffer(buffer);

  await ensureUploadDirs();

  // Parse text using PDFParse
  const parser = new PDFParse({ data: buffer });
  let extractedText = "";
  try {
    const parsedDoc = await parser.getText();
    extractedText = parsedDoc.text || "";
  } finally {
    await parser.destroy();
  }

  const extracted = extractDataFromResumeText(extractedText);

  // Compute fields that were successfully extracted
  const fieldsExtracted: string[] = [];
  if (extracted.fullName) fieldsExtracted.push("Name");
  if (extracted.title) fieldsExtracted.push("Title");
  if (extracted.email) fieldsExtracted.push("Email");
  if (extracted.phone) fieldsExtracted.push("Phone");
  if (extracted.location) fieldsExtracted.push("Location");
  if (extracted.github) fieldsExtracted.push("GitHub");
  if (extracted.linkedin) fieldsExtracted.push("LinkedIn");
  if (extracted.twitter) fieldsExtracted.push("Twitter");
  if (extracted.bio) fieldsExtracted.push("Bio");
  if (extracted.skills.length > 0) fieldsExtracted.push(`${extracted.skills.length} Skills`);

  // Save the PDF file with random UUIDv4 into uploads/tmp/
  const filename = `${crypto.randomUUID()}.pdf`;
  const filepath = path.join(getTmpUploadsDir(), filename);
  await fs.writeFile(filepath, buffer);

  return {
    filename,
    filepath,
    size: buffer.length,
    extracted,
    fieldsExtracted,
  };
}

/**
 * Validates and resolves the absolute path to a temporary uploaded PDF file.
 */
export async function getTmpPdfPath(filename: string): Promise<string | null> {
  if (!PDF_FILENAME_REGEX.test(filename)) {
    return null;
  }
  const filePath = path.join(getTmpUploadsDir(), filename);
  try {
    const stat = await fs.stat(filePath);
    if (stat.isFile()) return filePath;
  } catch {
    // Not found
  }
  return null;
}
