"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BookOpen,
  Rocket,
  Settings,
  Shield,
  Terminal,
  Code,
  Monitor,
  HelpCircle,
  ChevronDown,
  X,
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
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { title: "Overview", href: "/docs/overview" },
      { title: "Features", href: "/docs/features" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    label: "Usage",
    icon: <Rocket className="w-4 h-4" />,
    items: [
      { title: "Quick Start", href: "/docs/quickstart" },
      { title: "Command Reference", href: "/docs/commands" },
      { title: "SSL Manager", href: "/docs/ssl" },
    ],
  },
  {
    label: "Reference",
    icon: <Code className="w-4 h-4" />,
    items: [
      { title: "Dashboard API", href: "/docs/api" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Platform Support", href: "/docs/platform" },
    ],
  },
  {
    label: "Help",
    icon: <HelpCircle className="w-4 h-4" />,
    items: [
      { title: "FAQ & Troubleshooting", href: "/docs/faq" },
    ],
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  overview: BookOpen,
  features: Monitor,
  installation: Terminal,
  quickstart: Rocket,
  commands: Terminal,
  ssl: Shield,
  api: Code,
  configuration: Settings,
  platform: Monitor,
  faq: HelpCircle,
};

function getPageKey(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
}

export default function DocsSidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const activeKey = getPageKey(pathname);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.label, true]))
  );

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
        <Link href="/docs/overview" className="flex items-center gap-2.5 font-bold text-sm text-foreground">
          <BookOpen className="w-4 h-4 text-primary" />
          Easy DevOps Docs
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-muted hover:text-foreground transition-colors lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {groups.map((group) => {
          const isOpen = openGroups[group.label];
          const groupHasActive = group.items.some((item) => getPageKey(item.href) === activeKey);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  groupHasActive ? "text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">{group.icon}{group.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
              </button>
              {isOpen && (
                <div className="ml-2 mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const itemKey = getPageKey(item.href);
                    const isActive = itemKey === activeKey;
                    const Icon = iconMap[itemKey] || BookOpen;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted hover:text-foreground hover:bg-primary/[0.04]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
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

      {/* Version */}
      <div className="px-5 py-3 border-t border-border shrink-0">
        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono font-bold bg-primary/10 text-primary rounded-md">
          v1.2.0
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border bg-surface z-50">
        {sidebar}
      </aside>

      {/* Mobile: drawer overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-surface z-[70] lg:hidden shadow-2xl">
            {sidebar}
          </aside>
        </>
      )}
    </>
  );
}
