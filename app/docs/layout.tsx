"use client";

import { useState } from "react";
import { Menu, Sun, Moon, Home } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobOpen, setMobOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobOpen(true)}
            className="p-2 text-muted hover:text-foreground transition-colors lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2.5 font-semibold text-sm text-muted">
            <span>📚</span>
            Easy DevOps Docs
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link href="/" className="p-2 text-muted hover:text-foreground transition-colors" title="Back to home">
            <Home className="w-4 h-4" />
          </Link>
          <DocsThemeToggle />
        </div>
      </header>

      {/* Sidebar (handles its own mobile overlay internally) */}
      <DocsSidebar mobileOpen={mobOpen} onClose={() => setMobOpen(false)} />

      {/* Main */}
      <main className="lg:pl-64 pt-14 min-h-screen">
        <div className="max-w-[800px] w-full px-6 py-10 lg:py-12 lg:pl-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function DocsThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 text-muted hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
