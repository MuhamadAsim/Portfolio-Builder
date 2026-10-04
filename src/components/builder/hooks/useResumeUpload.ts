import { useState, useCallback } from "react";
import type { ExtractedResumeData } from "@/lib/resumeParser";

export interface ResumeParseResponse {
  filename: string;
  url: string;
  size: number;
  extracted: ExtractedResumeData;
  fieldsExtracted: string[];
}

export function useResumeUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uploadAndParse = useCallback(
    async (file: File): Promise<ResumeParseResponse | null> => {
      setErrorMsg(null);

      // Verify file is a PDF
      if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
        setErrorMsg("Please select a valid PDF file (.pdf).");
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("File exceeds the maximum allowed size of 5 MB.");
        return null;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/resume/parse", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to process PDF resume.");
        }

        return data as ResumeParseResponse;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "PDF upload failed.";
        setErrorMsg(msg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setErrorMsg(null);
  }, []);

  return {
    uploadAndParse,
    isUploading,
    errorMsg,
    clearError,
  };
}
