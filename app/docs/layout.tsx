"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import DocsSidebar from "@/components/DocsSidebar";
import DocsSearch from "@/components/DocsSearch";
import OnThisPage from "@/components/OnThisPage";
import ReadingProgress from "@/components/ReadingProgress";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.31c0 5.21 3.43 9.64 8.2 11.2.6.11.82-.26.82-.57v-2.23c-3.34.72-4.04-1.59-4.04-1.59-.55-1.37-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.23-3.17-.12-.3-.53-1.5.12-3.12 0 0 1-.32 3.3 1.21a11.5 11.5 0 0 1 6.02 0c2.28-1.53 3.29-1.21 3.29-1.21.66 1.62.25 2.82.12 3.12.77.83 1.23 1.88 1.23 3.17 0 4.54-2.81 5.53-5.48 5.83.43.37.82 1.09.82 2.2v3.25c0 .31.22.69.82.57C20.57 21.94 24 17.52 24 12.31 24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobOpen, setMobOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="docs-shell min-h-screen bg-background text-foreground">
      <ReadingProgress />

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-xl lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={() => setMobOpen(true)}
            className="rounded-md p-2 text-muted transition-colors hover:text-foreground lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/docs/overview" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 font-mono text-[12px] font-bold text-primary shadow-[0_0_18px_-6px_rgba(var(--color-primary-rgb),0.6)]">
              ez
            </span>
            <span className="truncate text-sm font-bold tracking-tight text-foreground">
              Easy DevOps
            </span>
            <span className="hidden font-mono text-[11px] text-muted sm:inline">/ docs</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <DocsSearch />

          <a
            href="https://ez.hub.devxor.team"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary md:inline-flex"
          >
            Hub
            <ExternalLink className="h-3 w-3" />
          </a>

          <a
            href="https://github.com/omar00050/Easy-DevOps"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-muted transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>

          <DocsThemeToggle />
        </div>
      </header>

      <DocsSidebar mobileOpen={mobOpen} onClose={() => setMobOpen(false)} />

      <main className="min-h-screen pt-16 lg:pl-72">
        <div className="mx-auto flex w-full max-w-[1400px] gap-12 px-5 sm:px-8 lg:px-10">
          <article className="min-w-0 max-w-[820px] flex-1 py-10 lg:py-12">
            <div key={pathname} className="docs-route-enter">
              {children}
            </div>
          </article>

          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-12">
              <OnThisPage />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function DocsThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-md p-2 text-muted transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
