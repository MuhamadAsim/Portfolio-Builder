"use client";

import React from "react";
import { PortfolioFormValues } from "../types";
import { SlugState } from "../hooks/useSlugCheck";

interface Step6ReviewProps {
  stepHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  templateId: string;
  watchedValues: PortfolioFormValues;
  slug: string;
  onSlugChange: (val: string) => void;
  slugStatus: SlugState;
  mode?: "create" | "edit";
  publishError?: string | null;
  onRetryPublish?: () => void;
  onDeletePortfolio?: () => void;
  isDeleting?: boolean;
}

export function Step6Review({
  stepHeadingRef,
  templateId,
  watchedValues,
  slug,
  onSlugChange,
  slugStatus,
  mode = "create",
  publishError,
  onRetryPublish,
  onDeletePortfolio,
  isDeleting,
}: Step6ReviewProps) {
  return (
    <fieldset className="space-y-6">
      <div>
        <h2
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-2xl font-bold text-white tracking-tight outline-none"
        >
          Review & Summary
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {mode === "edit"
            ? "Review your changes against the live preview before saving updates."
            : "Check your details against the live preview before continuing to publishing."}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Selected Template:</span>
          <strong className="text-white capitalize">{templateId}</strong>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Full Name:</span>
          <strong className="text-white">{watchedValues.basics?.fullName || "(Not entered)"}</strong>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Contact Email:</span>
          <strong className="text-white">{watchedValues.contact?.email || "(Not entered)"}</strong>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Skills Added:</span>
          <strong className="text-white">{watchedValues.skills?.length || 0}</strong>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Experience Positions:</span>
          <strong className="text-white">{watchedValues.experience?.length || 0}</strong>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Projects Added:</span>
          <strong className="text-white">{watchedValues.projects?.length || 0}</strong>
        </div>
      </div>

      {/* Slug Configuration & Live Availability Check */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3">
        <label htmlFor="portfolioSlug" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {mode === "edit" ? "Portfolio URL Slug" : "Choose Your Portfolio URL Slug"}{" "}
          <span className="text-rose-400">*</span>
        </label>

        <div className="flex items-center rounded-lg bg-slate-950 border border-slate-700 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <input
            id="portfolioSlug"
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="your-name"
            aria-describedby="slug-status"
            className="flex-1 px-3.5 py-2.5 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-mono"
          />
          <span className="px-3 text-xs font-mono text-slate-500 bg-slate-900/60 border-l border-slate-800 select-none py-2.5">
            .localhost:3000
          </span>
        </div>

        <div id="slug-status" className="min-h-5 text-xs flex items-center gap-2">
          {slugStatus.status === "checking" && (
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Checking slug availability...</span>
            </span>
          )}

          {slugStatus.status === "available" && (
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <span>✓</span>
              <span>{slugStatus.message}</span>
            </span>
          )}

          {slugStatus.status === "unavailable" && (
            <span className="text-rose-400 flex items-center gap-1.5 font-medium" role="alert">
              <span>✕</span>
              <span>{slugStatus.message}</span>
            </span>
          )}

          {slugStatus.status === "idle" && (
            <span className="text-slate-500">
              3–30 lowercase alphanumeric characters and hyphens.
            </span>
          )}
        </div>
      </div>

      {publishError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none">⚠️</span>
            <div>
              <strong className="font-semibold block text-rose-100">
                {mode === "edit" ? "Unable to save changes" : "Unable to publish"}
              </strong>
              <p className="mt-0.5 text-rose-200/90">{publishError}</p>
            </div>
          </div>
          {onRetryPublish && (
            <button
              type="button"
              onClick={onRetryPublish}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors shrink-0 shadow-sm"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {mode === "edit" ? (
        <>
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 leading-relaxed">
            ℹ️ You are editing an active portfolio. Changes will immediately update your published site. If you rename your slug, your old URL will point to this new one.
          </div>

          {onDeletePortfolio && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
              <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Danger Zone
              </h3>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                Permanently delete this portfolio and remove all uploaded images.
              </p>
              <button
                type="button"
                onClick={onDeletePortfolio}
                disabled={isDeleting}
                className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-200 bg-rose-900/60 hover:bg-rose-800/80 border border-rose-700/60 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "🗑️ Delete Portfolio"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          💡 Ready to launch? Double check your details. Once published, your portfolio will immediately be available at your custom slug URL.
        </div>
      )}
    </fieldset>
  );
}
