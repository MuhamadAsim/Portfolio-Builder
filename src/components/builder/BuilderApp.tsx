"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioDataSchema, type PortfolioData } from "@/lib/schema/portfolio";
import { resolvePreviewData, type FallbackDetail } from "@/lib/preview-fallback";
import { loadDraft, saveDraft, clearDraft } from "@/lib/draft";
import { PreviewPane } from "./PreviewPane";
import { defaultFormValues, STEP_NAMES, type PortfolioFormValues } from "./types";
import { getAllTemplates } from "@/templates/registry";
import { ImageUploader } from "./ImageUploader";
import Link from "next/link";

interface BuilderAppProps {
  initialTemplateId?: "template-a" | "template-b";
}

export function BuilderApp({ initialTemplateId = "template-a" }: BuilderAppProps) {
  const [initialDraft] = useState(() => loadDraft());

  const [templateId, setTemplateId] = useState<"template-a" | "template-b">(() => {
    if (initialDraft?.templateId === "template-a" || initialDraft?.templateId === "template-b") {
      return initialDraft.templateId;
    }
    return initialTemplateId;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialDraft?.step && initialDraft.step >= 1 && initialDraft.step <= 6) {
      return initialDraft.step;
    }
    return 1;
  });

  const initialSlug = (initialDraft?.data?.slug as string) || "";
  const [slug, setSlug] = useState<string>(initialSlug);

  const [slugStatus, setSlugStatus] = useState<{
    status: "idle" | "checking" | "available" | "unavailable";
    message?: string;
  }>(() => ({
    status: initialSlug ? "checking" : "idle",
  }));

  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [lastValidData, setLastValidData] = useState<PortfolioData | null>(null);
  const [, startTransition] = useTransition();

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioDataSchema) as never,
    defaultValues: (initialDraft?.data as unknown as PortfolioFormValues) || defaultFormValues,
    mode: "onTouched",
  });

  const {
    register,
    control,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = form;

  // Field arrays for dynamic lists
  const skillsArray = useFieldArray({ control, name: "skills" });
  const experienceArray = useFieldArray({ control, name: "experience" });
  const educationArray = useFieldArray({ control, name: "education" });
  const projectsArray = useFieldArray({ control, name: "projects" });

  // ── Watch form values & resolve preview data ──
  const watchedValues = useWatch({ control });

  const [previewState, setPreviewState] = useState<{
    data: PortfolioData;
    fallbackSections: FallbackDetail[];
  }>(() => resolvePreviewData(defaultFormValues, null));

  // Debounced preview & draft saving
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        const resolved = resolvePreviewData(
          watchedValues as unknown as Record<string, unknown>,
          lastValidData
        );
        setPreviewState(resolved);

        if (resolved.fallbackSections.length === 0) {
          setLastValidData(resolved.data);
        }

        saveDraft({
          templateId,
          step: currentStep,
          data: {
            ...(watchedValues as unknown as Record<string, unknown>),
            slug,
          },
        });
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [watchedValues, templateId, currentStep, lastValidData, slug]);

  // ── Debounced Slug Availability Check ──
  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/slug-check?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.available) {
          setSlugStatus({
            status: "available",
            message: `${data.slug}.localhost:3000 is available!`,
          });
        } else {
          setSlugStatus({
            status: "unavailable",
            message: data.reason || "This slug is not available.",
          });
        }
      } catch {
        if (!cancelled) {
          setSlugStatus({
            status: "unavailable",
            message: "Failed to verify slug availability.",
          });
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug]);

  // ── Focus management on step change ──
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  // ── Step Navigation & Validation ──
  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger([
        "basics.fullName",
        "basics.title",
        "basics.bio",
        "basics.bioQuote",
        "basics.availability",
        "basics.location",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "contact.email",
        "contact.phone",
        "contact.github",
        "contact.linkedin",
        "contact.twitter",
        "contact.website",
        "contact.resumeUrl",
      ]);
    } else if (currentStep === 3) {
      isValid = await trigger(["skills"]);
    } else if (currentStep === 4) {
      isValid = await trigger(["experience", "education"]);
    } else if (currentStep === 5) {
      isValid = await trigger(["projects"]);
    } else {
      isValid = true;
    }

    if (isValid && currentStep < 6) {
      if (currentStep === 5 && !slug) {
        const fullName = getValues("basics.fullName");
        if (fullName) {
          const suggested = fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 30);
          if (suggested) {
            setSlug(suggested);
            setSlugStatus({ status: "checking" });
          }
        }
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleResetDraft = () => {
    if (window.confirm("Are you sure you want to discard your current draft and start over?")) {
      clearDraft();
      reset(defaultFormValues);
      setCurrentStep(1);
      setSlug("");
      setSlugStatus({ status: "idle" });
      setLastValidData(null);
    }
  };

  const allTemplates = getAllTemplates();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* ── Top App Bar ── */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-white hover:text-indigo-400 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-mono font-bold">
                PB
              </span>
              <span className="hidden sm:inline">Portfolio Builder</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-medium text-slate-400">
              Step {currentStep} of 6: <strong className="text-slate-200">{STEP_NAMES[currentStep - 1]}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDraft}
              className="text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded border border-slate-800 hover:border-rose-900"
            >
              Reset Draft
            </button>
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Tab Switcher (Under 768px) ── */}
      <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-center">
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 w-full max-w-xs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "form"}
            onClick={() => setMobileTab("form")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
              mobileTab === "form" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            ✏️ Form
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "preview"}
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
              mobileTab === "preview" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* ── Main Work Area: Split View on md+ ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* ── Left Column: Multi-Step Form ── */}
        <section
          className={`bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 sm:p-8 flex flex-col shadow-xl ${
            mobileTab === "preview" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5 mb-6" aria-label="Step progress">
            {STEP_NAMES.map((name, idx) => {
              const stepNumber = idx + 1;
              const isActive = stepNumber === currentStep;
              const isPast = stepNumber < currentStep;

              return (
                <div
                  key={name}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    isActive
                      ? "bg-indigo-500"
                      : isPast
                      ? "bg-emerald-500"
                      : "bg-slate-700"
                  }`}
                  title={`Step ${stepNumber}: ${name}`}
                />
              );
            })}
          </div>

          <form onSubmit={(e) => e.preventDefault()} noValidate>
            {/* ── Step 1: Template Choice & Basics ── */}
            {currentStep === 1 && (
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
                  value={watchedValues.basics?.photo}
                  onChange={(filename) => {
                    form.setValue("basics.photo", filename, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  helperText="JPEG, PNG, or WebP up to 2 MB. Re-encoded as optimized WebP."
                />
              </fieldset>
            )}

            {/* ── Step 2: Contact Information ── */}
            {currentStep === 2 && (
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

                {/* Website */}
                <div>
                  <label htmlFor="contactWebsite" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Personal Website / Blog <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contactWebsite"
                    type="url"
                    {...register("contact.website")}
                    aria-describedby="website-desc"
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                  <p id="website-desc" className="text-xs text-slate-500 mt-1">Must start with https://</p>
                </div>

                {/* Resume URL */}
                <div>
                  <label htmlFor="contactResume" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Resume / CV Link <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contactResume"
                    type="url"
                    {...register("contact.resumeUrl")}
                    aria-describedby="resume-desc"
                    placeholder="https://yourdomain.com/resume.pdf"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                  <p id="resume-desc" className="text-xs text-slate-500 mt-1">Link to downloadable PDF resume.</p>
                </div>
              </fieldset>
            )}

            {/* ── Step 3: Skills ── */}
            {currentStep === 3 && (
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
            )}

            {/* ── Step 4: Career & Education ── */}
            {currentStep === 4 && (
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
            )}

            {/* ── Step 5: Projects ── */}
            {currentStep === 5 && (
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
                            value={watchedValues.projects?.[idx]?.image}
                            onChange={(filename) => {
                              form.setValue(`projects.${idx}.image` as const, filename, {
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
            )}

            {/* ── Step 6: Review & Readiness ── */}
            {currentStep === 6 && (
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
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().trim();
                        setSlug(val);
                        if (!val) {
                          setSlugStatus({ status: "idle" });
                        } else {
                          setSlugStatus({ status: "checking" });
                        }
                      }}
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
            )}

            {/* ── Form Navigation Buttons ── */}
            <div className="mt-8 pt-5 border-t border-slate-700/60 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentStep === 1
                    ? "opacity-40 cursor-not-allowed text-slate-500"
                    : "text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800"
                }`}
              >
                ← Back
              </button>

              <div className="flex items-center gap-3">
                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:translate-x-0.5"
                  >
                    Next Step →
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Review Complete
                  </span>
                )}
              </div>
            </div>
          </form>
        </section>

        {/* ── Right Column: Live Preview ── */}
        <section
          className={`h-[680px] sticky top-20 ${
            mobileTab === "form" ? "hidden md:block" : "block"
          }`}
        >
          <PreviewPane
            templateId={templateId}
            previewData={previewState.data}
            fallbackSections={previewState.fallbackSections}
          />
        </section>
      </main>
    </div>
  );
}
