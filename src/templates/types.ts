import type React from "react";
import type { PortfolioData } from "@/lib/schema/portfolio";

export interface RenderOptions {
  /**
   * Base path for user-uploaded images and assets.
   * - In live app: "/uploads"
   * - In static ZIP export: "./assets"
   */
  assetBase: string;

  /**
   * Optional base path for template-specific bundled assets (if any).
   * - In live app: "/templates/[templateId]/assets"
   * - In static ZIP export: "./assets"
   */
  templateAssetBase?: string;
}

export interface PortfolioTemplate {
  id: "template-a" | "template-b";
  name: string;
  description: string;
  previewImage: string;

  /**
   * Pure render function: same data + opts -> same React element.
   * Must never fetch, query databases, or call browser-only APIs during render.
   */
  render(data: PortfolioData, opts: RenderOptions): React.ReactElement;

  /**
   * Complete, self-contained plain CSS string scoped under the template's root class.
   * Stored in TypeScript memory so it works seamlessly in server rendering, client-side
   * iframe srcDoc, and ZIP export without any Node filesystem (fs) dependency.
   */
  css: string;
}
