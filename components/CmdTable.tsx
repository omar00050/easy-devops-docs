"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export interface CmdGroup {
  title: string;
  commands: { name: string; description: string }[];
}

export default function CmdTable({ groups }: { groups: CmdGroup[] }) {
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(
    Object.fromEntries(groups.map((_, i) => [i, true]))
  );

  const filtered = groups.map((g) => ({
    ...g,
    commands: g.commands.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(g => g.commands.length > 0 || search.length === 0);

  const toggle = (i: number) => setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Filter commands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Groups */}
      {filtered.map((group, gi) => (
        <div key={gi} className="mb-4">
          <button
            onClick={() => toggle(gi)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
          >
            <span>{group.title}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${openSections[gi] ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            ><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {openSections[gi] && (
            <div className="overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Command</th>
                    <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {(search ? group.commands : group.commands).map((cmd, ci) => (
                    <tr key={ci} className={`transition-colors duration-150 ${ci % 2 === 0 ? "" : "bg-primary/[0.02]"} hover:bg-primary/[0.04]`}>
                      <td className="py-3 px-4 font-mono font-semibold text-sm text-primary leading-none">{cmd.name}</td>
                      <td className="py-3 px-4 text-muted leading-snug">{cmd.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
