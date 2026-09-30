"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchPortfolioForEdit } from "@/lib/edit";
import type { PortfolioData } from "@/lib/schema/portfolio";
import { BuilderApp } from "@/components/builder/BuilderApp";

function EditPageContent() {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState(searchParams?.get("slug") || "");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedNotice, setDeletedNotice] = useState<string | null>(null);

  // Portfolio loaded into editor memory
  const [loadedPortfolio, setLoadedPortfolio] = useState<{
    slug: string;
    templateId: "template-a" | "template-b";
    data: PortfolioData;
    token: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase();
    const cleanToken = token.trim();

    if (!cleanSlug) {
      setError("Please enter your portfolio slug.");
      return;
    }
    if (!cleanToken) {
      setError("Please enter your secret edit token.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDeletedNotice(null);

    const result = await fetchPortfolioForEdit(cleanSlug, cleanToken);
    setIsLoading(false);

    if (result.kind === "success") {
      setLoadedPortfolio({
        slug: result.data.slug,
        templateId: result.data.templateId,
        data: result.data.data,
        token: cleanToken,
      });
    } else if (result.kind === "unauthorized") {
      setError("Invalid edit token. Please check your token and try again.");
    } else if (result.kind === "not_found") {
      setError(`Portfolio "${cleanSlug}" was not found. Please verify the slug.`);
    } else {
      setError(result.message);
    }
  };

  if (loadedPortfolio) {
    return (
      <BuilderApp
        mode="edit"
        initialData={loadedPortfolio.data}
        initialSlug={loadedPortfolio.slug}
        initialTemplateId={loadedPortfolio.templateId}
        editToken={loadedPortfolio.token}
        onDeleteSuccess={() => {
          const deletedSlug = loadedPortfolio.slug;
          setLoadedPortfolio(null);
          setSlug("");
          setToken("");
          setDeletedNotice(`Portfolio "${deletedSlug}" was permanently deleted.`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-white hover:text-indigo-400 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-mono font-bold">
              PB
            </span>
            <span>Portfolio Builder</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            ← Return Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Edit Your Portfolio
            </h1>
            <p className="text-xs text-slate-400">
              Enter your slug and the secret edit token given when published.
            </p>
          </div>

          {deletedNotice && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2"
            >
              <span>✓</span>
              <span>{deletedNotice}</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="edit-slug"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Portfolio Slug
              </label>
              <div className="flex items-center rounded-lg bg-slate-950 border border-slate-700 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <input
                  id="edit-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-slug"
                  required
                  className="flex-1 px-3.5 py-2.5 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="edit-token"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Secret Edit Token
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-[11px] text-slate-400 hover:text-indigo-300 font-medium"
                >
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="edit-token"
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your 43-character token"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px]"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading Portfolio...</span>
                </>
              ) : (
                <span>Access Editor →</span>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700/60 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              🔒 No passwords or user accounts required. The secret edit token is the sole key to your portfolio.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
          Loading editor...
        </div>
      }
    >
      <EditPageContent />
    </Suspense>
  );
}
