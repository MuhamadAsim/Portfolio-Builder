import { BuilderApp } from "@/components/builder/BuilderApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Portfolio • Portfolio Builder",
  description: "Build your personal portfolio in minutes with live preview and no accounts.",
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;

  const initialTemplateId =
    template === "template-b" ? ("template-b" as const) : ("template-a" as const);

  return <BuilderApp initialTemplateId={initialTemplateId} />;
}
