"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Hash, FileText, CornerDownLeft } from "lucide-react";
import { docsIndex } from "@/lib/docsIndex";

interface Hit {
  title: string;
  href: string;
  section: string;
  context?: string;
}

const POPULAR: Hit[] = [
  { title: "Overview", href: "/docs/overview", section: "Getting Started" },
  { title: "Installation", href: "/docs/installation", section: "Getting Started" },
  { title: "Quick Start", href: "/docs/quickstart", section: "Getting Started" },
  { title: "CLI Interface", href: "/docs/cli", section: "Using the CLI" },
  { title: "Deployments", href: "/docs/deployments", section: "Using the CLI" },
  { title: "Easy DevOps Hub", href: "/docs/hub", section: "Operations" },
  { title: "Dashboard API", href: "/docs/api", section: "Reference" },
];

function search(query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return POPULAR;

  const scored: Array<{ hit: Hit; score: number }> = [];

  for (const page of docsIndex) {
    let score = 0;
    const title = page.title.toLowerCase();
    if (title === q) score = 120;
    else if (title.startsWith(q)) score = 100;
    else if (title.includes(q)) score = 80;

    if (!score) {
      if (page.description.toLowerCase().includes(q)) score = 30;
      else if (page.section.toLowerCase().includes(q)) score = 20;
    }

    if (score) {
      scored.push({
        hit: {
          title: page.title,
          href: page.href,
          section: page.section,
          context: page.description,
        },
        score,
      });
    }

    for (const heading of page.headings) {
      if (heading.text.toLowerCase().includes(q)) {
        scored.push({
          hit: {
            title: heading.text,
            href: `${page.href}#${heading.id}`,
            section: page.title,
          },
          score: title.includes(q) ? 60 : 50,
        });
      }
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((entry) => entry.hit);
}

export default function DocsSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (hit: Hit) => {
    setOpen(false);
    router.push(hit.href);
  };

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => (value + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => (value - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className="group inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background/60 px-2.5 text-xs text-muted transition-colors duration-150 hover:border-primary/40 hover:text-foreground sm:w-56"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden flex-1 text-left sm:block">Search docs</span>
        <span className="kbd hidden sm:inline-flex">{isMac ? "⌘" : "Ctrl"} K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search pages, commands, flags…"
                className="h-14 w-full bg-transparent text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
                aria-label="Search query"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="kbd shrink-0 hover:text-foreground"
                aria-label="Close search"
              >
                esc
              </button>
            </div>

            <div className="docs-scroll max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted">
                  No results for <span className="font-mono text-foreground">“{query}”</span>
                  <p className="mt-1.5 text-xs">Try “nginx”, “deploy”, “SSL” or “service”.</p>
                </div>
              ) : (
                <>
                  {!query && (
                    <div className="px-3 pb-1 pt-2 text-[10px] font-mono uppercase tracking-[0.16em] text-muted">
                      Jump to
                    </div>
                  )}
                  {results.map((hit, index) => (
                    <button
                      key={`${hit.href}-${hit.title}`}
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(hit)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-100 ${
                        index === active ? "bg-primary/10" : "hover:bg-primary/[0.05]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 rounded-md border border-border bg-background/60 p-1.5 ${
                          index === active ? "text-primary" : "text-muted"
                        }`}
                      >
                        {hit.context ? <FileText className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className={`truncate text-sm font-medium ${index === active ? "text-primary" : "text-foreground"}`}>
                            {hit.title}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                            {hit.section}
                          </span>
                        </span>
                        {hit.context && (
                          <span className="mt-0.5 block truncate text-xs text-muted">{hit.context}</span>
                        )}
                      </span>
                      {index === active && <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-primary/70" />}
                    </button>
                  ))}
                </>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-border bg-background/40 px-4 py-2.5 text-[10px] font-mono text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="kbd">↑</span><span className="kbd">↓</span> navigate
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="kbd">↵</span> open
              </span>
              <span className="ml-auto hidden sm:block">Easy DevOps docs</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
