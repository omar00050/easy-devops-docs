"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function OnThisPage() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    setHeadings([]);
    setActiveId("");

    const scan = () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        "main article .doc-content h2[id], main article .doc-content h3[id]"
      );
      setHeadings(
        Array.from(nodes).map((node) => ({
          id: node.id,
          text: node.textContent?.replace(/#$/, "").trim() || node.id,
          level: node.tagName === "H3" ? 3 : 2,
        }))
      );
    };

    const timer = window.setTimeout(scan, 40);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }
      let current = "";
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 140) current = heading.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        <span className="h-px w-4 bg-primary/60" />
        On this page
      </div>

      <ul className="docs-scroll max-h-[calc(100vh-14rem)] space-y-px overflow-y-auto border-l border-border">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`-ml-px block border-l-2 py-1.5 pr-2 leading-snug transition-colors duration-150 ${
                  heading.level === 3 ? "pl-6 text-[12.5px]" : "pl-4 text-[13px]"
                } ${
                  isActive
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted hover:border-border hover:text-foreground"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary"
      >
        <ArrowUp className="h-3 w-3" />
        Back to top
      </button>
    </nav>
  );
}
