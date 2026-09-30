"use client";

import React, { useMemo, useState } from "react";
import { getTemplate } from "@/templates/registry";
import { buildHtmlDocument } from "@/lib/document";
import type { PortfolioData } from "@/lib/schema/portfolio";
import type { FallbackDetail } from "@/lib/preview-fallback";

interface PreviewPaneProps {
  templateId: "template-a" | "template-b";
  previewData: PortfolioData;
  fallbackSections: FallbackDetail[];
}

export function PreviewPane({
  templateId,
  previewData,
  fallbackSections,
}: PreviewPaneProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const template = useMemo(() => getTemplate(templateId) || getTemplate("template-a")!, [templateId]);

  const htmlDoc = useMemo(() => {
    return buildHtmlDocument(template, previewData, {
      assetBase: "/uploads",
      title: `${previewData.basics.fullName || "Portfolio"} (Preview)`,
    });
  }, [template, previewData]);

  const fallbackList = useMemo(() => {
    if (!fallbackSections || fallbackSections.length === 0) return null;
    return fallbackSections.map((f) => f.section).join(", ");
  }, [fallbackSections]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* ── Toolbar Header ── */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Live Preview</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-400 capitalize">{template.name}</span>
        </div>

        {/* Viewport switch buttons */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60" role="group" aria-label="Preview viewport size">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              viewport === "desktop" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            title="Desktop view"
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              viewport === "tablet" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            title="Tablet view (768px)"
          >
            Tablet
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              viewport === "mobile" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            title="Mobile view (375px)"
          >
            Mobile
          </button>
        </div>
      </div>

      {/* ── Fallback Alert Banner ── */}
      {fallbackList && (
        <div
          role="status"
          aria-live="polite"
          className="px-4 py-2 bg-amber-950/70 border-b border-amber-800/50 text-amber-200 text-xs flex items-center gap-2"
        >
          <span aria-hidden="true">ℹ️</span>
          <span>
            Preview showing sample data for incomplete sections:{" "}
            <strong className="underline underline-offset-2">{fallbackList}</strong>.
            Fill in those fields to replace sample content.
          </span>
        </div>
      )}

      {/* ── Frame Area ── */}
      <div className="flex-1 bg-slate-900/40 p-2 sm:p-4 flex items-center justify-center overflow-auto">
        <div
          className={`h-full bg-white rounded-lg shadow-inner overflow-hidden transition-all duration-300 ${
            viewport === "mobile"
              ? "w-[375px] max-w-full"
              : viewport === "tablet"
              ? "w-[768px] max-w-full"
              : "w-full"
          }`}
          style={{ minHeight: "580px" }}
        >
          <iframe
            key={`${templateId}-${viewport}`}
            srcDoc={htmlDoc}
            title="Portfolio Live Preview"
            sandbox="allow-scripts"
            className="w-full h-full border-0 block"
            style={{ minHeight: "580px" }}
          />
        </div>
      </div>
    </div>
  );
}
