/**
 * The published Easy DevOps version behind every "v…" in the docs.
 *
 * Online builds treat the npm registry as the source of truth, with GitHub's
 * package.json as a fallback. The offline build supplies the version from this
 * repository's root package.json and skips both requests.
 */

const NPM_LATEST = "https://registry.npmjs.org/easy-devops/latest";
const GITHUB_PACKAGE = "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/package.json";
const OFFLINE_BUILD = process.env.EASY_DEVOPS_DOCS_OFFLINE === "1";

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
  if (OFFLINE_BUILD) {
    return parseVersion({ version: process.env.NEXT_PUBLIC_EASY_DEVOPS_PACKAGE_VERSION });
  }
  return (await read(NPM_LATEST, 3600)) ?? (await read(GITHUB_PACKAGE, 3600));
}
