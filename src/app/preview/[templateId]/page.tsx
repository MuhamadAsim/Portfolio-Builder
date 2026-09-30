import { notFound } from "next/navigation";
import { getTemplate } from "@/templates/registry";
import { samplePortfolioData } from "@/templates/sample-data";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  // Requirement 9: The preview route must 404 in production
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { templateId } = await params;
  const template = getTemplate(templateId);

  if (!template) {
    notFound();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: template.css }} />
      {template.render(samplePortfolioData, { assetBase: "/uploads" })}
    </>
  );
}
