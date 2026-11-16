"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BookOpen,
  Terminal,
  Activity,
  Code2,
  LifeBuoy,
  ChevronDown,
  X,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
}

interface NavGroup {
  label: string;
  icon: ReactNode;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    label: "Getting Started",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    items: [
      { title: "Overview", href: "/docs/overview" },
      { title: "Features", href: "/docs/features" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    label: "Using the CLI",
    icon: <Terminal className="w-3.5 h-3.5" />,
    items: [
      { title: "CLI Interface", href: "/docs/cli" },
      { title: "Command Reference", href: "/docs/commands" },
      { title: "SSL Manager", href: "/docs/ssl" },
      { title: "Deployments", href: "/docs/deployments" },
    ],
  },
  {
    label: "Operations",
    icon: <Activity className="w-3.5 h-3.5" />,
    items: [
      { title: "Background Service", href: "/docs/service" },
      { title: "Easy DevOps Hub", href: "/docs/hub" },
      { title: "Maintenance & Updates", href: "/docs/maintenance" },
    ],
  },
  {
    label: "Reference",
    icon: <Code2 className="w-3.5 h-3.5" />,
    items: [
      { title: "Dashboard API", href: "/docs/api" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Platform Support", href: "/docs/platform" },
    ],
  },
  {
    label: "Help",
    icon: <LifeBuoy className="w-3.5 h-3.5" />,
    items: [{ title: "FAQ & Troubleshooting", href: "/docs/faq" }],
  },
];

function getPageKey(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.31c0 5.21 3.43 9.64 8.2 11.2.6.11.82-.26.82-.57v-2.23c-3.34.72-4.04-1.59-4.04-1.59-.55-1.37-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.23-3.17-.12-.3-.53-1.5.12-3.12 0 0 1-.32 3.3 1.21a11.5 11.5 0 0 1 6.02 0c2.28-1.53 3.29-1.21 3.29-1.21.66 1.62.25 2.82.12 3.12.77.83 1.23 1.88 1.23 3.17 0 4.54-2.81 5.53-5.48 5.83.43.37.82 1.09.82 2.2v3.25c0 .31.22.69.82.57C20.57 21.94 24 17.52 24 12.31 24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

export default function DocsSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const activeKey = getPageKey(pathname);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((group) => [group.label, true]))
  );

  const toggleGroup = (label: string) =>
    setOpenGroups((previous) => ({ ...previous, [label]: !previous[label] }));

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Mobile brand row */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5 lg:hidden">
        <Link href="/docs/overview" className="flex items-center gap-2.5 text-sm font-bold text-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-primary/30 bg-primary/10 font-mono text-[11px] font-bold text-primary">
            ez
          </span>
          Easy DevOps
          <span className="font-mono text-[11px] font-normal text-muted">/ docs</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition-colors hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Version header */}
      <div className="shrink-0 px-5 pb-4 pt-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Documentation</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
            v2.0.0
          </span>
          <span className="text-[11px] text-muted">CLI · Dashboard · Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="docs-scroll flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((group, index) => {
          const isOpen = openGroups[group.label];
          const groupHasActive = group.items.some((item) => getPageKey(item.href) === activeKey);
          return (
            <div key={group.label} className={index > 0 ? "mt-5" : ""}>
              <button
                onClick={() => toggleGroup(group.label)}
                aria-expanded={isOpen}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  groupHasActive ? "text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="w-4 text-[9px] tabular-nums text-muted/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {group.icon}
                <span className="flex-1">{group.label}</span>
                <ChevronDown
                  className={`h-3 w-3 text-muted/70 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
                />
              </button>

              {isOpen && (
                <div className="ml-4 mt-1 space-y-px border-l border-border pl-2">
                  {group.items.map((item) => {
                    const isActive = getPageKey(item.href) === activeKey;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`-ml-px flex items-center gap-2 border-l-2 py-1.5 pl-2.5 pr-2 text-[13px] leading-snug transition-colors duration-150 ${
                          isActive
                            ? "border-primary bg-primary/[0.07] font-medium text-primary"
                            : "border-transparent text-muted hover:border-border hover:bg-primary/[0.03] hover:text-foreground"
                        }`}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <span className="status-lamp" />
            Service ready
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
            Native service · PM2 · nginx
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <a
              href="https://ez.hub.devxor.team"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-background/60 px-2 py-1.5 text-[11px] font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              Hub
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/omar00050/Easy-DevOps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1.5 text-[11px] font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <GitHubIcon className="h-3 w-3" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-72 flex-col border-r border-border bg-surface/60 backdrop-blur-xl lg:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-[70] w-80 max-w-[85vw] border-r border-border bg-surface shadow-2xl lg:hidden">
            {sidebar}
          </aside>
        </>
      )}
    </>
  );
}
