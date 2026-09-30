import { notFound } from "next/navigation";
import { getTemplate } from "@/templates/registry";
import { samplePortfolioData } from "@/templates/sample-data";
import { minimalFixture } from "@/templates/__fixtures__/minimal";
import { maximalFixture } from "@/templates/__fixtures__/maximal";
import { xssTextFixture } from "@/templates/__fixtures__/xss";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ data?: string }>;
}) {
  // Requirement 9: The preview route must 404 in production
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { templateId } = await params;
  const { data: dataParam } = await searchParams;
  const template = getTemplate(templateId);

  if (!template) {
    notFound();
  }

  let data = samplePortfolioData;
  if (dataParam === "minimal") {
    data = minimalFixture;
  } else if (dataParam === "maximal") {
    data = maximalFixture;
  } else if (dataParam === "xss") {
    data = xssTextFixture;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: template.css }} />
      {template.render(data, { assetBase: "/uploads" })}
    </>
  );
}
