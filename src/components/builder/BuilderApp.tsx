"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioDataSchema, PortfolioData } from "@/lib/schema/portfolio";
import { resolvePreviewData, FallbackDetail } from "@/lib/preview-fallback";
import { saveDraft, loadDraft, clearDraft } from "@/lib/draft";
import { PreviewPane } from "./PreviewPane";
import {
  PortfolioFormValues,
  defaultFormValues,
  STEP_NAMES,
  BuilderAppProps,
} from "./types";
import { useSlugCheck } from "./hooks/useSlugCheck";
import { Step1Basics } from "./steps/Step1Basics";
import { Step2Contact } from "./steps/Step2Contact";
import { Step3Skills } from "./steps/Step3Skills";
import { Step4Experience } from "./steps/Step4Experience";
import { Step5Projects } from "./steps/Step5Projects";
import { Step6Review } from "./steps/Step6Review";
import { publishPortfolio } from "@/lib/publish";
import { PublishSuccess } from "./PublishSuccess";

export function BuilderApp({
  mode = "create",
  initialData,
  initialSlug,
  initialTemplateId,
}: BuilderAppProps = {}) {
  const searchParams = useSearchParams();
  const requestedTemplate = searchParams?.get("template");

  // Load existing draft from sessionStorage on client in create mode
  const [initialDraft] = useState(() => {
    if (typeof window !== "undefined" && mode === "create" && !initialData) {
      return loadDraft();
    }
    return null;
  });

  const [templateId, setTemplateId] = useState<"template-a" | "template-b">(() => {
    if (initialTemplateId) return initialTemplateId;
    if (requestedTemplate === "template-b" || requestedTemplate === "template-a") {
      return requestedTemplate;
    }
    if (initialDraft?.templateId === "template-b" || initialDraft?.templateId === "template-a") {
      return initialDraft.templateId;
    }
    return "template-a";
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialDraft?.step && initialDraft.step >= 1 && initialDraft.step <= 6) {
      return initialDraft.step;
    }
    return 1;
  });

  const initialSlugValue = initialSlug || (initialDraft?.data?.slug as string) || "";
  const { slug, setSlug, resetSlug, slugStatus, setSlugStatus } = useSlugCheck(initialSlugValue);

  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [lastValidData, setLastValidData] = useState<PortfolioData | null>(null);
  const [, startTransition] = useTransition();

  // Publishing state - token lives only in component memory
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedData, setPublishedData] = useState<{
    slug: string;
    token: string;
    publicUrl: string;
    fallbackUrl: string;
  } | null>(null);

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioDataSchema) as never,
    defaultValues: initialData || (initialDraft?.data as unknown as PortfolioFormValues) || defaultFormValues,
    mode: "onTouched",
  });

  const {
    register,
    control,
    trigger,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  // Field arrays for dynamic lists
  const skillsArray = useFieldArray({ control, name: "skills" });
  const experienceArray = useFieldArray({ control, name: "experience" });
  const educationArray = useFieldArray({ control, name: "education" });
  const projectsArray = useFieldArray({ control, name: "projects" });

  // Watch form values for live preview & draft persistence
  const watchedValues = useWatch({ control });

  const [previewState, setPreviewState] = useState<{
    data: PortfolioData;
    fallbackSections: FallbackDetail[];
  }>(() => resolvePreviewData(initialData || defaultFormValues, null));

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

        if (mode === "create") {
          saveDraft({
            templateId,
            step: currentStep,
            data: {
              ...(watchedValues as unknown as Record<string, unknown>),
              slug,
            },
          });
        }
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [watchedValues, templateId, currentStep, lastValidData, slug, mode]);

  // Focus management on step change
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  // Step Navigation & Validation
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
      resetSlug("");
      setLastValidData(null);
    }
  };

  const handlePublish = async () => {
    if (mode !== "create" || isPublishing) return;

    // 1. Validate full form data across all sections with Zod schema
    const parsedData = portfolioDataSchema.safeParse(getValues());
    if (!parsedData.success) {
      await trigger(); // trigger React Hook Form inline field errors
      const errFields = parsedData.error.issues.map((i) => i.path[0]);
      if (errFields.includes("basics")) setCurrentStep(1);
      else if (errFields.includes("contact")) setCurrentStep(2);
      else if (errFields.includes("skills")) setCurrentStep(3);
      else if (errFields.includes("experience") || errFields.includes("education")) setCurrentStep(4);
      else if (errFields.includes("projects")) setCurrentStep(5);
      return;
    }

    // 2. Validate slug availability
    if (!slug) {
      setSlugStatus({
        status: "unavailable",
        message: "Please choose a valid slug for your portfolio.",
      });
      return;
    }

    if (slugStatus.status !== "available") {
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    const result = await publishPortfolio({
      templateId,
      slug,
      data: parsedData.data,
    });

    setIsPublishing(false);

    if (result.kind === "success") {
      clearDraft();
      setPublishedData(result.data);
    } else if (result.kind === "slug_taken") {
      setSlugStatus({ status: "unavailable", message: result.message });
      setPublishError(result.message);
    } else if (result.kind === "validation_error") {
      setPublishError(result.message);
      // Map server validation error back to step if specified
      if (result.details && typeof result.details === "object") {
        const d = result.details as Record<string, unknown>;
        if (d.data && typeof d.data === "object") {
          const inner = d.data as Record<string, unknown>;
          if (inner.basics) setCurrentStep(1);
          else if (inner.contact) setCurrentStep(2);
          else if (inner.skills) setCurrentStep(3);
          else if (inner.experience || inner.education) setCurrentStep(4);
          else if (inner.projects) setCurrentStep(5);
        } else if (d.slug) {
          setSlugStatus({ status: "unavailable", message: "Invalid slug format" });
        }
      }
    } else if (result.kind === "network_error") {
      setPublishError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top App Bar */}
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
            {publishedData ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Published
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-400">
                Step {currentStep} of 6: <strong className="text-slate-200">{STEP_NAMES[currentStep - 1]}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {mode === "create" && !publishedData && (
              <button
                type="button"
                onClick={handleResetDraft}
                className="text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded border border-slate-800 hover:border-rose-900"
              >
                Reset Draft
              </button>
            )}
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher (Under 768px) */}
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

      {/* Main Work Area: Success Screen OR Split View on md+ */}
      {publishedData ? (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
          <PublishSuccess
            slug={publishedData.slug}
            token={publishedData.token}
            publicUrl={publishedData.publicUrl}
            fallbackUrl={publishedData.fallbackUrl}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Multi-Step Form */}
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
              {currentStep === 1 && (
                <Step1Basics
                  stepHeadingRef={stepHeadingRef}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  templateId={templateId}
                  setTemplateId={setTemplateId}
                  photoValue={watchedValues.basics?.photo}
                />
              )}

              {currentStep === 2 && (
                <Step2Contact
                  stepHeadingRef={stepHeadingRef}
                  register={register}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3Skills
                  stepHeadingRef={stepHeadingRef}
                  register={register}
                  skillsArray={skillsArray}
                />
              )}

              {currentStep === 4 && (
                <Step4Experience
                  stepHeadingRef={stepHeadingRef}
                  register={register}
                  experienceArray={experienceArray}
                  educationArray={educationArray}
                />
              )}

              {currentStep === 5 && (
                <Step5Projects
                  stepHeadingRef={stepHeadingRef}
                  register={register}
                  projectsArray={projectsArray}
                  setValue={setValue}
                  watchedProjects={watchedValues.projects}
                />
              )}

              {currentStep === 6 && (
                <Step6Review
                  stepHeadingRef={stepHeadingRef}
                  templateId={templateId}
                  watchedValues={watchedValues as PortfolioFormValues}
                  slug={slug}
                  onSlugChange={setSlug}
                  slugStatus={slugStatus}
                  mode={mode}
                  publishError={publishError}
                  onRetryPublish={handlePublish}
                />
              )}

              {/* Form Navigation Buttons */}
              <div className="mt-8 pt-5 border-t border-slate-700/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isPublishing}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentStep === 1 || isPublishing
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
                  ) : mode === "create" ? (
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isPublishing || slugStatus.status !== "available"}
                      className={`px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                        isPublishing || slugStatus.status !== "available"
                          ? "bg-emerald-600/50 cursor-not-allowed opacity-60"
                          : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 hover:scale-[1.02]"
                      }`}
                    >
                      {isPublishing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀 Publish Portfolio</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-amber-400 font-medium">
                      Editing published portfolios will be available in Phase 8
                    </span>
                  )}
                </div>
              </div>
            </form>
          </section>

          {/* Right Column: Live Preview */}
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
      )}
    </div>
  );
}
