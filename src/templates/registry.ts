import type { PortfolioTemplate } from "./types";
import { templateA } from "./template-a";

const templates: Record<string, PortfolioTemplate> = {
  "template-a": templateA,
};

export function getTemplate(id: string): PortfolioTemplate | undefined {
  return templates[id];
}

export function getAllTemplates(): PortfolioTemplate[] {
  return Object.values(templates);
}

export function isTemplateId(id: string): id is "template-a" | "template-b" {
  return id === "template-a" || id === "template-b";
}
