"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { PortfolioFormValues } from "../types";
import { ResumeUploader } from "../ResumeUploader";

interface Step2ContactProps {
  stepHeadingRef: React.RefObject<HTMLHeadingElement | null>;
  register: UseFormRegister<PortfolioFormValues>;
  setValue: UseFormSetValue<PortfolioFormValues>;
  errors: FieldErrors<PortfolioFormValues>;
  resumePdfValue?: string;
}

export function Step2Contact({
  stepHeadingRef,
  register,
  setValue,
  errors,
  resumePdfValue,
}: Step2ContactProps) {
  return (
    <fieldset className="space-y-6">
      <div>
        <h2
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-2xl font-bold text-white tracking-tight outline-none"
        >
          Contact & Socials
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Provide ways for visitors to reach you and view your profiles.
        </p>
      </div>

      {/* Email (Required) */}
      <div>
        <label htmlFor="contactEmail" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Email Address <span className="text-rose-400">*</span>
        </label>
        <input
          id="contactEmail"
          type="email"
          {...register("contact.email")}
          aria-describedby={errors.contact?.email ? "email-err" : "email-desc"}
          placeholder="e.g. alex@example.com"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        {errors.contact?.email ? (
          <p id="email-err" role="alert" className="text-xs text-rose-400 mt-1 font-medium">
            {errors.contact.email.message}
          </p>
        ) : (
          <p id="email-desc" className="text-xs text-slate-500 mt-1">Primary contact email (used for mailto buttons).</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contactPhone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Phone Number <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="contactPhone"
          type="tel"
          {...register("contact.phone")}
          aria-describedby="phone-desc"
          placeholder="e.g. +1-555-0199"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="phone-desc" className="text-xs text-slate-500 mt-1">Telephone contact number.</p>
      </div>

      {/* GitHub */}
      <div>
        <label htmlFor="contactGithub" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          GitHub Profile URL <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="contactGithub"
          type="url"
          {...register("contact.github")}
          aria-describedby="github-desc"
          placeholder="https://github.com/your-username"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="github-desc" className="text-xs text-slate-500 mt-1">Must start with https://</p>
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="contactLinkedin" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          LinkedIn Profile URL <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="contactLinkedin"
          type="url"
          {...register("contact.linkedin")}
          aria-describedby="linkedin-desc"
          placeholder="https://linkedin.com/in/your-username"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="linkedin-desc" className="text-xs text-slate-500 mt-1">Must start with https://</p>
      </div>

      {/* Twitter / X */}
      <div>
        <label htmlFor="contactTwitter" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
          Twitter / X Profile URL <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <input
          id="contactTwitter"
          type="url"
          {...register("contact.twitter")}
          aria-describedby="twitter-desc"
          placeholder="https://twitter.com/your-username"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
        />
        <p id="twitter-desc" className="text-xs text-slate-500 mt-1">Must start with https://</p>
      </div>

      {/* Resume / CV PDF Upload */}
      <ResumeUploader
        id="contactResumePdf"
        label="Resume / CV (PDF Upload)"
        value={resumePdfValue}
        onChange={(filename) => setValue("contact.resumePdf", filename, { shouldValidate: true })}
        helperText="Upload your PDF resume (up to 5 MB). Visitors can download it directly from your portfolio."
      />
    </fieldset>
  );
}
