"use client";

import React, { useRef, useState } from "react";
import { useResumeUpload, ResumeParseResponse } from "./hooks/useResumeUpload";

interface ResumeUploaderProps {
  id: string;
  label: string;
  value?: string; // Stored uuid.pdf filename
  onChange: (filename?: string) => void;
  onParsed?: (data: ResumeParseResponse) => void;
  helperText?: string;
  isQuickStart?: boolean;
}

export function ResumeUploader({
  id,
  label,
  value,
  onChange,
  onParsed,
  helperText = "Upload your resume in PDF format (up to 5 MB).",
  isQuickStart = false,
}: ResumeUploaderProps) {
  const { uploadAndParse, isUploading, errorMsg, clearError } = useResumeUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastExtractedFields, setLastExtractedFields] = useState<string[] | null>(null);

  const processFile = async (file: File) => {
    const result = await uploadAndParse(file);
    if (result) {
      onChange(result.filename);
      setLastExtractedFields(result.fieldsExtracted);
      if (onParsed) {
        onParsed(result);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setLastExtractedFields(null);
    clearError();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        {isQuickStart && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto-fill
          </span>
        )}
      </div>

      {value ? (
        <div className="p-3.5 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 font-bold text-xs">
              PDF
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate flex items-center gap-1.5">
                <span>Resume / CV attached</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                  Ready
                </span>
              </p>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{value}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/uploads/tmp/${encodeURIComponent(value)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 rounded-lg transition-colors font-medium"
              >
                View PDF
              </a>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                aria-label="Remove uploaded resume"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {lastExtractedFields && lastExtractedFields.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span className="text-emerald-400 font-medium">✓ Extracted:</span>
              {lastExtractedFields.map((f, i) => (
                <span
                  key={i}
                  className="bg-slate-800/90 text-slate-200 px-2 py-0.5 rounded border border-slate-700/60"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-indigo-500 bg-indigo-950/20"
              : "border-slate-700/80 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-900/60"
          } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-indigo-300 font-medium">Parsing & extracting resume data...</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-xs font-medium text-slate-300">
                <span className="text-indigo-400 font-semibold underline underline-offset-2">
                  Click to upload PDF
                </span>{" "}
                or drag and drop
              </div>
              <p className="text-[11px] text-slate-500">{helperText}</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handleFileChange}
      />

      {errorMsg && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 mt-1" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
