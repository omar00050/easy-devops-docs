import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptsDir, "..");
const rootPackagePath = path.resolve(docsRoot, "..", "package.json");
const nextBin = path.join(docsRoot, "node_modules", "next", "dist", "bin", "next");
const guard = pathToFileURL(path.join(scriptsDir, "offline-network-guard.mjs")).href;

const rootPackage = JSON.parse(await readFile(rootPackagePath, "utf8"));
const version = rootPackage.version;
if (typeof version !== "string" || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid root package version: ${String(version)}`);
}

console.log(`[docs] Offline build for package ${version}; outbound network access is blocked`);

const child = spawn(process.execPath, ["--import", guard, nextBin, "build"], {
  cwd: docsRoot,
  env: {
    ...process.env,
    EASY_DEVOPS_DOCS_OFFLINE: "1",
    NEXT_PUBLIC_EASY_DEVOPS_DOCS_OFFLINE: "1",
    NEXT_PUBLIC_EASY_DEVOPS_PACKAGE_VERSION: version,
    NEXT_TELEMETRY_DISABLED: "1",
  },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(`Could not start the offline docs build: ${error.message}`);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Offline docs build stopped by ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
