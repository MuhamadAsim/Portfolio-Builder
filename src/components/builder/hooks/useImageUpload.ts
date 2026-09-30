import { useState, useCallback } from "react";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setErrorMsg(null);

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File exceeds the maximum allowed size of 2 MB.");
      return null;
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

      return data.filename;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setErrorMsg(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorMsg(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    errorMsg,
    clearError,
  };
}
