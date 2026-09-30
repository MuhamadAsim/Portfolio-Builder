import type { PortfolioTemplate } from "./types";
import { templateA } from "./template-a";
import { templateB } from "./template-b";

const templates: Record<string, PortfolioTemplate> = {
  "template-a": templateA,
  "template-b": templateB,
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
