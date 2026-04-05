"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { BookOpen, Sun, Moon, Menu, X } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.78 0 12.31c0 5.21 3.43 9.64 8.2 11.2.6.11.82-.26.82-.57v-2.23c-3.34.72-4.04-1.59-4.04-1.59-.55-1.37-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.22 1.84 1.22 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.23-3.17-.12-.3-.53-1.5.12-3.12 0 0 1-.32 3.3 1.21a11.5 11.5 0 0 1 6.02 0c2.28-1.53 3.29-1.21 3.29-1.21.66 1.62.25 2.82.12 3.12.77.83 1.23 1.88 1.23 3.17 0 4.54-2.81 5.53-5.48 5.83.43.37.82 1.09.82 2.2v3.25c0 .31.22.69.82.57C20.57 21.94 24 17.52 24 12.31 24 5.78 18.63.5 12 .5z"/>
    </svg>
  );
}

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 300 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[17px] text-foreground shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/src/dashboard/public/img/icon.png"
              alt="Easy DevOps Logo"
              className="w-8 rounded-lg"
            />
            Easy DevOps
          </Link>

          {/* Desktop links (only on home) */}
          {isHome && (
            <div className="hidden md:flex items-center gap-1">
              <NavLinks />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isHome ? (
              <Link href="/docs/overview" className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                Documentation
                <BookOpen className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/" className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
                Home
              </Link>
            )}
            <a
              href="https://github.com/omar00050/Easy-DevOps"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted hover:text-foreground transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 text-muted hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-muted hover:text-foreground transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 right-0 w-72 h-full bg-surface p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-foreground">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            {isHome && <NavLinks vertical />}
            <div className="mt-6">
              <Link href="/docs/overview" className="block w-full px-4 py-2.5 text-sm font-medium bg-primary/10 text-primary rounded-lg text-center" onClick={() => setMobileOpen(false)}>
                Documentation →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLinks({ vertical = false }: { vertical?: boolean }) {
  const links = [
    { href: "#hero", label: "Home" },
    { href: "#features-section", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#platforms", label: "Platforms" },
    { href: "#faq-home", label: "FAQ" },
  ];

  return (
    <div className={vertical ? "space-y-1" : "flex items-center gap-1"}>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className={`px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-primary/[0.04] ${vertical ? "block" : ""}`}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
