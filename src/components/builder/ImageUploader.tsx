"use client";

import React, { useState, useRef } from "react";

interface ImageUploaderProps {
  id: string;
  label: string;
  value?: string;
  onChange: (filename?: string) => void;
  helperText?: string;
}

export function ImageUploader({
  id,
  label,
  value,
  onChange,
  helperText = "JPEG, PNG, or WebP up to 2 MB.",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    // 1. Client-side size check
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File exceeds the maximum allowed size of 2 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.filename);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-4 p-3 bg-slate-900 border border-slate-700/80 rounded-xl">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/${encodeURIComponent(value)}`}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-slate-300 truncate">{value}</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">✓ Uploaded and optimized (WebP)</p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-900/60"
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            aria-describedby={`${id}-desc`}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full p-4 rounded-xl border border-dashed transition-all flex flex-col items-center justify-center gap-2 ${
              isUploading
                ? "bg-slate-900/40 border-slate-700 cursor-wait text-slate-400"
                : "bg-slate-900/60 border-slate-700 hover:border-indigo-500/60 text-slate-300 hover:text-white"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
                <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Optimizing and uploading image...</span>
              </div>
            ) : (
              <>
                <span className="text-xl">📷</span>
                <span className="text-xs font-semibold">Click to upload photo</span>
                <span id={`${id}-desc`} className="text-[11px] text-slate-500">
                  {helperText}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {errorMsg && (
        <p role="alert" className="text-xs text-rose-400 font-medium">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
