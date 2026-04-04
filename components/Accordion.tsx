"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export default function Accordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border-b border-border last:border-b-0 bg-surface">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4.5 text-[15px] font-semibold text-foreground hover:text-primary transition-colors text-left"
            >
              <span>{item.question}</span>
              <Plus className={`w-4 h-4 shrink-0 ml-3 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
              <div className="px-5 pb-5 text-sm text-muted leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
