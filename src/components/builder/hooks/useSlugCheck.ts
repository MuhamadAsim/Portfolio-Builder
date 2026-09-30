import { useState, useEffect, useCallback } from "react";

export type SlugCheckStatus = "idle" | "checking" | "available" | "unavailable";

export interface SlugState {
  status: SlugCheckStatus;
  message?: string;
}

export function useSlugCheck(initialSlug = "") {
  const [slug, setSlugState] = useState<string>(initialSlug);
  const [slugStatus, setSlugStatus] = useState<SlugState>(() => ({
    status: initialSlug ? "checking" : "idle",
  }));

  const setSlug = useCallback((newSlug: string) => {
    const formatted = newSlug.toLowerCase().trim();
    setSlugState(formatted);
    if (!formatted) {
      setSlugStatus({ status: "idle" });
    } else {
      setSlugStatus({ status: "checking" });
    }
  }, []);

  const resetSlug = useCallback((emptySlug = "") => {
    setSlugState(emptySlug);
    setSlugStatus({ status: emptySlug ? "checking" : "idle" });
  }, []);

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

  return {
    slug,
    setSlug,
    resetSlug,
    slugStatus,
    setSlugStatus,
  };
}
