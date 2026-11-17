"use client";

import { useEffect, useState } from "react";
import { VERSION_SOURCES, parseVersion } from "./version";

const STORAGE_KEY = "ez:docs-version";

async function fetchLatest(): Promise<string | null> {
  for (const url of VERSION_SOURCES) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const version = parseVersion(await response.json());
      if (version) return version;
    } catch {
      // Try the next source; the badge simply stays hidden if all fail.
    }
  }
  return null;
}

/**
 * The published version for client components (sidebar badge): the last known
 * value paints immediately, a fresh registry lookup replaces it silently.
 */
export function useLatestVersion(): string | null {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const cached = window.localStorage.getItem(STORAGE_KEY);
      if (cached) setVersion(cached);
    } catch {
      // Storage can be blocked; the live lookup below still runs.
    }

    void fetchLatest().then((fresh) => {
      if (!fresh || cancelled) return;
      setVersion(fresh);
      try {
        window.localStorage.setItem(STORAGE_KEY, fresh);
      } catch {
        // Best effort only.
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return version;
}
