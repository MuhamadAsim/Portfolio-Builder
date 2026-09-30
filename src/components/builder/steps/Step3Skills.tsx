"use client";

import React from "react";
import { UseFormRegister, UseFieldArrayReturn } from "react-hook-form";
import { PortfolioFormValues } from "../types";

interface Step3SkillsProps {
  stepHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  register: UseFormRegister<PortfolioFormValues>;
  skillsArray: UseFieldArrayReturn<PortfolioFormValues, "skills">;
}

export function Step3Skills({
  stepHeadingRef,
  register,
  skillsArray,
}: Step3SkillsProps) {
  return (
    <fieldset className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-2xl font-bold text-white tracking-tight outline-none"
          >
            Skills & Expertise
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Add tools, competencies, or disciplines you specialize in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => skillsArray.append({ name: "", category: "" })}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {skillsArray.fields.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-slate-700 text-center text-slate-400 text-sm">
          No skills added yet. Click &quot;+ Add Skill&quot; above to add your first competence.
        </div>
      ) : (
        <div className="space-y-3">
          {skillsArray.fields.map((field, idx) => (
            <div
              key={field.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center gap-3"
            >
              <div className="flex-1">
                <label htmlFor={`skill-name-${idx}`} className="sr-only">
                  Skill Name {idx + 1}
                </label>
                <input
                  id={`skill-name-${idx}`}
                  type="text"
                  {...register(`skills.${idx}.name` as const)}
                  placeholder="Skill name (e.g. TypeScript, UI Design)"
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`skill-cat-${idx}`} className="sr-only">
                  Category {idx + 1}
                </label>
                <input
                  id={`skill-cat-${idx}`}
                  type="text"
                  {...register(`skills.${idx}.category` as const)}
                  placeholder="Category (e.g. Design, Frontend)"
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={() => skillsArray.remove(idx)}
                aria-label={`Remove skill ${idx + 1}`}
                className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}
