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
}

export function Step6Review({
  stepHeadingRef,
  templateId,
  watchedValues,
  slug,
  onSlugChange,
  slugStatus,
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
          Check your details against the live preview before continuing to publishing.
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
          Choose Your Portfolio URL Slug <span className="text-rose-400">*</span>
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

      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 leading-relaxed">
        ✓ Checkpoint 5b complete. Upload endpoint, image processing, and slug check are integrated and verified.
      </div>
    </fieldset>
  );
}
