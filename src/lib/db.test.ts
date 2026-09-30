import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "./db";
import { generateEditToken, hashEditToken } from "./tokens";
import { portfolioDataSchema } from "./schema/portfolio";

describe("Prisma database client integration", () => {
  const testSlug = `test-slug-${Date.now()}`;
  const token = generateEditToken();
  const tokenHash = hashEditToken(token);

  const testData = {
    basics: {
      fullName: "Integration Tester",
      title: "Full Stack Engineer",
      bio: "Writing integration tests to verify database roundtrips.",
    },
    contact: {
      email: "tester@example.com",
    },
    skills: [{ name: "TypeScript", category: "Language" }],
    experience: [],
    education: [],
    projects: [],
  };

  afterAll(async () => {
    // Clean up created record
    await prisma.portfolio.deleteMany({
      where: { slug: testSlug },
    });
    await prisma.$disconnect();
  });

  it("creates, reads, and parses a portfolio record from SQLite", async () => {
    const created = await prisma.portfolio.create({
      data: {
        slug: testSlug,
        templateId: "template-a",
        data: JSON.stringify(testData),
        editTokenHash: tokenHash,
      },
    });

    expect(created.id).toBeTruthy();
    expect(created.slug).toBe(testSlug);

    const found = await prisma.portfolio.findUnique({
      where: { slug: testSlug },
    });

    expect(found).not.toBeNull();
    if (!found) return;

    // Verify parsing with Zod schema
    const parsedData = portfolioDataSchema.parse(JSON.parse(found.data));
    expect(parsedData.basics.fullName).toBe("Integration Tester");
    expect(parsedData.skills[0].name).toBe("TypeScript");
  });
});
