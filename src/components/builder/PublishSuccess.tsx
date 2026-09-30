"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export interface PublishSuccessProps {
  slug: string;
  token: string;
  publicUrl: string;
  fallbackUrl: string;
}

export function PublishSuccess({
  slug,
  token,
  publicUrl,
  fallbackUrl,
}: PublishSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(false);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Beforeunload warning active until user explicitly ticks "I have saved my token"
  useEffect(() => {
    if (tokenSaved) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Browsers standardly require setting returnValue
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [tokenSaved]);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setCopyFailed(false);
        setTimeout(() => setCopied(false), 3000);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      // Fallback: prompt manual selection
      setCopyFailed(true);
      setTimeout(() => {
        manualInputRef.current?.focus();
        manualInputRef.current?.select();
      }, 50);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
      {/* Header banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Your Portfolio is Live!
        </h1>
        <p className="text-sm text-slate-300">
          Published successfully under slug <span className="font-mono text-indigo-300 font-semibold">{slug}</span>.
        </p>
      </div>

      {/* Live URLs */}
      <div className="space-y-4 bg-slate-900/90 rounded-xl p-5 border border-slate-700/80">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Public Subdomain URL
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-indigo-400 hover:text-indigo-300 underline underline-offset-4 break-all font-semibold"
            >
              {publicUrl}
            </a>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
            >
              <span>Visit Site</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-1 text-xs text-slate-400">
          <span>Alternative path fallback: </span>
          <Link
            href={fallbackUrl}
            target="_blank"
            className="text-slate-300 hover:text-white font-mono underline underline-offset-2"
          >
            {fallbackUrl}
          </Link>
          <span className="text-slate-500 ml-1">(useful if your local network cannot resolve subdomains)</span>
        </div>
      </div>

      {/* Edit Token Card & Warning */}
      <div className="space-y-4 bg-amber-950/30 border border-amber-500/40 rounded-xl p-5 text-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-xl leading-none">⚠️</span>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-amber-100 uppercase tracking-wider">
              Secret Edit Token — Save This Now
            </h2>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              This token is <strong>only shown once</strong>. We only store an encrypted hash on the server, so we cannot recover it for you if lost. You will need it to edit your portfolio in the future.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-amber-500/30">
          <input
            ref={manualInputRef}
            type="text"
            readOnly
            value={token}
            aria-label="Secret edit token"
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 bg-transparent text-xs font-mono text-amber-300 px-2 py-1 select-all focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-colors shrink-0"
          >
            {copied ? "✓ Copied" : "Copy Token"}
          </button>
        </div>

        {copyFailed && (
          <p className="text-xs text-amber-300 font-medium">
            Clipboard copy failed. Please select the box above and copy manually (Ctrl+C / Cmd+C).
          </p>
        )}

        <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={tokenSaved}
            onChange={(e) => setTokenSaved(e.target.checked)}
            className="mt-0.5 rounded border-amber-600 bg-amber-950 text-indigo-600 focus:ring-amber-500 focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-medium text-amber-100">
            I have saved my edit token in a safe place.
          </span>
        </label>
      </div>

      {/* Export & Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-700/60">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-700 cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
          title="Static ZIP export will be available in Phase 7"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download ZIP (Coming Soon)</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
        >
          Done / Return Home
        </Link>
      </div>
    </div>
  );
}
