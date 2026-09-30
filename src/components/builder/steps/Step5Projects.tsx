"use client";

import React from "react";
import { UseFormRegister, UseFieldArrayReturn, UseFormSetValue } from "react-hook-form";
import { PortfolioFormValues } from "../types";
import { ImageUploader } from "../ImageUploader";

interface Step5ProjectsProps {
  stepHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  register: UseFormRegister<PortfolioFormValues>;
  projectsArray: UseFieldArrayReturn<PortfolioFormValues, "projects">;
  setValue: UseFormSetValue<PortfolioFormValues>;
  watchedProjects?: Array<{ image?: string; [key: string]: unknown }>;
}

export function Step5Projects({
  stepHeadingRef,
  register,
  projectsArray,
  setValue,
  watchedProjects,
}: Step5ProjectsProps) {
  return (
    <fieldset className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-2xl font-bold text-white tracking-tight outline-none"
          >
            Featured Projects
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showcase your best work, case studies, or publications.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            projectsArray.append({
              title: "",
              description: "",
              tags: [],
              liveUrl: "",
              repoUrl: "",
            })
          }
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
        >
          + Add Project
        </button>
      </div>

      {projectsArray.fields.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-slate-700 text-center text-slate-400 text-sm">
          No projects added yet. Click &quot;+ Add Project&quot; above to create your first portfolio highlight.
        </div>
      ) : (
        <div className="space-y-4">
          {projectsArray.fields.map((field, idx) => (
            <div
              key={field.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Project #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => projectsArray.remove(idx)}
                  aria-label={`Remove project ${idx + 1}`}
                  className="text-xs text-rose-400 hover:text-rose-300"
                >
                  Remove
                </button>
              </div>

              <div>
                <label htmlFor={`proj-title-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Project Title *
                </label>
                <input
                  id={`proj-title-${idx}`}
                  type="text"
                  {...register(`projects.${idx}.title` as const)}
                  placeholder="e.g. OmniSearch Assistant"
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor={`proj-desc-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Description *
                </label>
                <textarea
                  id={`proj-desc-${idx}`}
                  rows={2}
                  {...register(`projects.${idx}.description` as const)}
                  placeholder="What does it do and what technologies did you use?"
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <ImageUploader
                  id={`proj-img-${idx}`}
                  label="Project Preview Image (Optional)"
                  value={watchedProjects?.[idx]?.image}
                  onChange={(filename) => {
                    setValue(`projects.${idx}.image` as const, filename, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  helperText="Screenshot or cover image up to 2 MB (WebP)."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`proj-live-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Live Demo URL (https://)
                  </label>
                  <input
                    id={`proj-live-${idx}`}
                    type="url"
                    {...register(`projects.${idx}.liveUrl` as const)}
                    placeholder="https://demo.example.com"
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor={`proj-repo-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Repository / Source URL (https://)
                  </label>
                  <input
                    id={`proj-repo-${idx}`}
                    type="url"
                    {...register(`projects.${idx}.repoUrl` as const)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}
