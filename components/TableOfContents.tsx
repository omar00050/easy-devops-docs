"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const els = document.querySelectorAll("h2[id], h3[id]");
    const items: TOCItem[] = [];
    els.forEach((el) => {
      const id = el.id;
      const text = el.textContent || "";
      const level = el.tagName === "H3" ? 3 : 2;
      items.push({ id, text, level });
    });
    setHeadings(items);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block w-56 shrink-0 fixed right-8 top-16 max-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">On this page</div>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1 transition-colors duration-150 text-sm ${
                h.level === 3 ? "pl-4 text-[13px]" : "pl-0"
              } ${
                activeId === h.id
                  ? "text-primary font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
