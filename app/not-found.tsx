import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, Terminal } from "lucide-react";
import { currentYear } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="docs-shell relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Backdrop accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-[380px] w-[380px] rounded-full bg-primary/[0.06] blur-[120px]" />
      </div>

      {/* Brand bar */}
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-border px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/30 bg-primary/10 font-mono text-[12px] font-bold text-primary">
            ez
          </span>
          <span className="text-sm font-bold tracking-tight">Easy DevOps</span>
          <span className="font-mono text-[11px] text-muted">/ 404</span>
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          nginx · error_page 404
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-14 sm:px-8">
        <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          <span className="h-px w-8 bg-primary/60" />
          HTTP 404
        </div>

        <h1 className="mt-4 text-6xl font-black tracking-tight sm:text-7xl">
          Not{" "}
          <span
            style={{
              background: "linear-gradient(to right, var(--color-primary), rgba(var(--color-primary-rgb), 0.6))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            found.
          </span>
        </h1>

        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          This URL does not resolve to a page. The server is running, nginx is happy, and the
          certificate is valid — it is only the address that is wrong.
        </p>

        {/* Terminal */}
        <div className="terminal-surface mt-8 overflow-hidden rounded-xl">
          <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d29922]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/80" />
            </span>
            <span className="ml-1 flex items-center gap-1.5 font-mono text-[11px] text-[#8b949e]">
              <Terminal className="h-3 w-3" />
              request.log
            </span>
          </div>
          <div className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.8] sm:text-[12.5px]">
            <div className="whitespace-pre text-[#c9d1d9]">
              <div>
                <span className="text-primary">$ </span>
                <span className="text-[#e6edf3]">curl -I https://easy-devops.devxor.team/this-page</span>
              </div>
              <div className="text-[#8b949e]">HTTP/2 404</div>
              <div className="text-[#8b949e]">server: nginx</div>
              <div className="text-[#8b949e]">content-type: text/html; charset=utf-8</div>
              <div className="h-[1.8em]" />
              <div>
                <span className="text-primary">$ </span>
                <span className="text-[#e6edf3]">ezz --help</span>
                <span className="text-[#6e7681]"> # find something that does exist</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-primary">❯</span>
                <span className="terminal-caret text-[#8b949e]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 px-6 py-3 text-sm font-semibold shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_4px_12px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_24px_rgba(var(--color-primary-rgb),0.45)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/docs/overview"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary/[0.04]"
          >
            <BookOpen className="h-4 w-4" />
            Browse the docs
          </Link>
          <a
            href="https://ez.hub.devxor.team"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-muted transition-colors duration-200 hover:border-primary/40 hover:text-primary"
          >
            Open the Hub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Quick links */}
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { title: "Installation", href: "/docs/installation" },
            { title: "CLI Interface", href: "/docs/cli" },
            { title: "Deployments", href: "/docs/deployments" },
            { title: "API Reference", href: "/docs/api" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2 font-mono text-[11px] text-muted transition-colors hover:border-primary/30 hover:text-primary"
            >
              {item.title}
              <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border px-5 py-4 text-center font-mono text-[10px] text-muted sm:px-8">
        exit code 404 · even a good pipeline misses a path now and then · © {currentYear()} Easy DevOps · provided by{" "}
        <a href="https://devxor.team" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          DevXor Team
        </a>
      </footer>
    </div>
  );
}
