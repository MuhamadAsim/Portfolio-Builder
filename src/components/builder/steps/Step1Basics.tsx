"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { PortfolioFormValues } from "../types";
import { ImageUploader } from "../ImageUploader";
import { getAllTemplates } from "@/templates/registry";

interface Step1BasicsProps {
  stepHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  register: UseFormRegister<PortfolioFormValues>;
  setValue: UseFormSetValue<PortfolioFormValues>;
  errors: FieldErrors<PortfolioFormValues>;
  templateId: "template-a" | "template-b";
  setTemplateId: (id: "template-a" | "template-b") => void;
  photoValue?: string;
}

export function Step1Basics({
  stepHeadingRef,
  register,
  setValue,
  errors,
  templateId,
  setTemplateId,
  photoValue,
}: Step1BasicsProps) {
  const allTemplates = getAllTemplates();

  return (
    <fieldset className="space-y-6">
      <div>
        <h2
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-2xl font-bold text-white tracking-tight outline-none"
        >
          Template & Basics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select your visual layout and fill in your primary details.
        </p>
      </div>

      {/* Template Chooser Radios */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Select Template
        </label>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Template selector">
          {allTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={templateId === t.id}
              onClick={() => setTemplateId(t.id as "template-a" | "template-b")}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                templateId === t.id
                  ? "bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 text-white"
                  : "bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600"
              }`}
            >
              <div className="font-bold text-sm">{t.name}</div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                {t.id === "template-a" ? "Modern Clean & Minimalist" : "Bold Neo-Pop Brutalist"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Full Name <span className="text-rose-400">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          {...register("basics.fullName")}
          aria-describedby={errors.basics?.fullName ? "fullName-err" : "fullName-desc"}
          placeholder="e.g. Alex Rivera"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        {errors.basics?.fullName ? (
          <p id="fullName-err" role="alert" className="text-xs text-rose-400 mt-1 font-medium">
            {errors.basics.fullName.message}
          </p>
        ) : (
          <p id="fullName-desc" className="text-xs text-slate-500 mt-1">2 to 80 characters.</p>
        )}
      </div>

      {/* Professional Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Professional Title / Headline <span className="text-rose-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register("basics.title")}
          aria-describedby={errors.basics?.title ? "title-err" : "title-desc"}
          placeholder="e.g. Senior Product Designer & Strategist"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        {errors.basics?.title ? (
          <p id="title-err" role="alert" className="text-xs text-rose-400 mt-1 font-medium">
            {errors.basics.title.message}
          </p>
        ) : (
          <p id="title-desc" className="text-xs text-slate-500 mt-1">Your core discipline or role headline.</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          About / Bio <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="bio"
          rows={4}
          {...register("basics.bio")}
          aria-describedby={errors.basics?.bio ? "bio-err" : "bio-desc"}
          placeholder="A brief overview of your background, experience, and what drives your work..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed"
        />
        {errors.basics?.bio ? (
          <p id="bio-err" role="alert" className="text-xs text-rose-400 mt-1 font-medium">
            {errors.basics.bio.message}
          </p>
        ) : (
          <p id="bio-desc" className="text-xs text-slate-500 mt-1">Between 10 and 600 characters.</p>
        )}
      </div>

      {/* Bio Quote (Optional) */}
      <div>
        <label htmlFor="bioQuote" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Personal Motto / Quote <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="bioQuote"
          type="text"
          {...register("basics.bioQuote")}
          aria-describedby="bioQuote-desc"
          placeholder="e.g. Design is intelligence made visible."
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="bioQuote-desc" className="text-xs text-slate-500 mt-1">Highlighted prominently in the hero section.</p>
      </div>

      {/* Availability Badge (Optional) */}
      <div>
        <label htmlFor="availability" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Availability Status <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="availability"
          type="text"
          {...register("basics.availability")}
          aria-describedby="availability-desc"
          placeholder="e.g. Available for Q3 consulting • Open to full-time roles"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="availability-desc" className="text-xs text-slate-500 mt-1">Persona-neutral badge shown when set (max 100 characters).</p>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Location <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="location"
          type="text"
          {...register("basics.location")}
          aria-describedby="location-desc"
          placeholder="e.g. London, UK (Remote)"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="location-desc" className="text-xs text-slate-500 mt-1">City, country or remote status.</p>
      </div>

      {/* Profile Photo */}
      <ImageUploader
        id="profilePhoto"
        label="Profile Photo (Optional)"
        value={photoValue}
        onChange={(filename) => setValue("basics.photo", filename, { shouldValidate: true })}
        helperText="Square or portrait photo recommended. JPEG, PNG, or WebP up to 2 MB."
      />
    </fieldset>
  );
}
