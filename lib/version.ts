/**
 * The published Easy DevOps version behind every "v…" in the docs.
 *
 * The npm registry is the source of truth — it is exactly what `ezz update`
 * installs. GitHub's package.json is the fallback for a build machine that
 * cannot reach npm, and a failed lookup hides the badge rather than showing a
 * stale number: the docs must build offline.
 */

const NPM_LATEST = "https://registry.npmjs.org/easy-devops/latest";
const GITHUB_PACKAGE = "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/package.json";

/** Where the browser fallback looks, in order. */
export const VERSION_SOURCES = [NPM_LATEST, GITHUB_PACKAGE] as const;

const VERSION_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** `1.3.5` from `{ version: "1.3.5" }`, or null for anything else. */
export function parseVersion(payload: unknown): string | null {
  const version = (payload as { version?: unknown } | null)?.version;
  return typeof version === "string" && VERSION_RE.test(version) ? version : null;
}

async function read(url: string, revalidate?: number): Promise<string | null> {
  try {
    const response = await fetch(url, revalidate ? { next: { revalidate } } : { cache: "no-store" });
    if (!response.ok) return null;
    return parseVersion(await response.json());
  } catch {
    return null;
  }
}

/**
 * Server-side lookup for the landing page and structured data. Cached for an
 * hour, so a fresh publish shows up without a redeploy.
 */
export async function latestVersion(): Promise<string | null> {
  return (await read(NPM_LATEST, 3600)) ?? (await read(GITHUB_PACKAGE, 3600));
}
