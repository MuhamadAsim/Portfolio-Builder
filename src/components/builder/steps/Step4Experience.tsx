"use client";

import React from "react";
import { UseFormRegister, UseFieldArrayReturn } from "react-hook-form";
import { PortfolioFormValues } from "../types";

interface Step4ExperienceProps {
  stepHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  register: UseFormRegister<PortfolioFormValues>;
  experienceArray: UseFieldArrayReturn<PortfolioFormValues, "experience">;
  educationArray: UseFieldArrayReturn<PortfolioFormValues, "education">;
}

export function Step4Experience({
  stepHeadingRef,
  register,
  experienceArray,
  educationArray,
}: Step4ExperienceProps) {
  return (
    <fieldset className="space-y-8">
      {/* Experience section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-2xl font-bold text-white tracking-tight outline-none"
            >
              Experience
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Professional roles, freelance work, or career milestones.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              experienceArray.append({
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
                location: "",
                workType: "",
              })
            }
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            + Add Position
          </button>
        </div>

        {experienceArray.fields.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-700 text-center text-slate-400 text-sm">
            No experience positions added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {experienceArray.fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Position #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => experienceArray.remove(idx)}
                    aria-label={`Remove position ${idx + 1}`}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`exp-role-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Role / Title *
                    </label>
                    <input
                      id={`exp-role-${idx}`}
                      type="text"
                      {...register(`experience.${idx}.role` as const)}
                      placeholder="Lead Designer"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`exp-company-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Company / Org *
                    </label>
                    <input
                      id={`exp-company-${idx}`}
                      type="text"
                      {...register(`experience.${idx}.company` as const)}
                      placeholder="Acme Studio"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`exp-start-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Start Date *
                    </label>
                    <input
                      id={`exp-start-${idx}`}
                      type="text"
                      {...register(`experience.${idx}.startDate` as const)}
                      placeholder="2022-03"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`exp-end-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                      End Date (leave blank for Present)
                    </label>
                    <input
                      id={`exp-end-${idx}`}
                      type="text"
                      {...register(`experience.${idx}.endDate` as const)}
                      placeholder="Present"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`exp-desc-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Description & Key Achievements
                  </label>
                  <textarea
                    id={`exp-desc-${idx}`}
                    rows={2}
                    {...register(`experience.${idx}.description` as const)}
                    placeholder="Spearheaded design system overhaul..."
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education section */}
      <div className="space-y-4 pt-6 border-t border-slate-700/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Education</h3>
            <p className="text-xs text-slate-400 mt-0.5">Degrees, certifications, or studies.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              educationArray.append({
                institution: "",
                degree: "",
                startDate: "",
                endDate: "",
              })
            }
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            + Add Education
          </button>
        </div>

        {educationArray.fields.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-700 text-center text-slate-400 text-sm">
            No education items added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {educationArray.fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Degree #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => educationArray.remove(idx)}
                    aria-label={`Remove education ${idx + 1}`}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`edu-deg-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Degree / Certificate *
                    </label>
                    <input
                      id={`edu-deg-${idx}`}
                      type="text"
                      {...register(`education.${idx}.degree` as const)}
                      placeholder="B.S. in Computer Science"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`edu-inst-${idx}`} className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Institution / University *
                    </label>
                    <input
                      id={`edu-inst-${idx}`}
                      type="text"
                      {...register(`education.${idx}.institution` as const)}
                      placeholder="State University"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </fieldset>
  );
}
