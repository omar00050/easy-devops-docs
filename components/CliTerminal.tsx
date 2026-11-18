"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

type LineKind =
  | "prompt"
  | "banner"
  | "status"
  | "menu"
  | "menuActive"
  | "info"
  | "progress"
  | "ok"
  | "dim"
  | "blank";

interface Line {
  kind: LineKind;
  text: string;
  delay?: number;
}

interface Scene {
  id: string;
  label: string;
  lines: Line[];
}

const scenes: Scene[] = [
  {
    id: "menu",
    label: "main menu",
    lines: [
      { kind: "prompt", text: "ezz" },
      { kind: "banner", text: "  Easy DevOps  ·  interactive CLI" },
      { kind: "status", text: "  nginx ● <detected>    node <detected>    service ● running", delay: 460 },
      { kind: "blank", text: "" },
      { kind: "info", text: "? Select an option", delay: 420 },
      { kind: "menuActive", text: "❯ Node.js Manager" },
      { kind: "menu", text: "  Nginx Manager" },
      { kind: "menu", text: "  SSL Manager" },
      { kind: "menu", text: "  Domain Manager" },
      { kind: "menu", text: "  Open Dashboard" },
      { kind: "menu", text: "  Settings" },
      { kind: "menu", text: "  Check for Updates" },
      { kind: "menu", text: "  Exit" },
      { kind: "dim", text: "  ↑↓ move   ↵ select   ctrl+c quit", delay: 500 },
    ],
  },
  {
    id: "ssl",
    label: "issue a certificate",
    lines: [
      { kind: "prompt", text: "ezz  →  SSL Manager  →  Create new certificate" },
      { kind: "blank", text: "" },
      { kind: "info", text: "? Domain               app.example.com", delay: 420 },
      { kind: "info", text: "? Challenge            HTTP-01" },
      { kind: "progress", text: "… Contacting Let's Encrypt" },
      { kind: "progress", text: "… Writing challenge response" },
      { kind: "ok", text: "✔ Certificate issued · app.example.com", delay: 520 },
      { kind: "dim", text: "  expires in 89 days · /etc/easy-devops/ssl/app.example.com/" },
      { kind: "ok", text: "✔ nginx -t passed", delay: 360 },
      { kind: "ok", text: "✔ nginx reloaded — zero downtime" },
      { kind: "blank", text: "" },
      { kind: "dim", text: "Auto-renewal is on. This certificate renews 7 days before expiry." },
    ],
  },
  {
    id: "deploy",
    label: "deploy an app",
    lines: [
      { kind: "prompt", text: "dashboard  →  Deployments  →  Deploy storefront" },
      { kind: "blank", text: "" },
      { kind: "info", text: "[1/6] fetch     main@4f2c1a9", delay: 480 },
      { kind: "info", text: "[2/6] install   npm ci · 412 packages" },
      { kind: "info", text: "[3/6] build     npm run build · 8.4s" },
      { kind: "info", text: "[4/6] switch    ez-storefront → online" },
      { kind: "info", text: "[5/6] health    GET /healthz · 200" },
      { kind: "ok", text: "[6/6] release   4f2c1a9 is live", delay: 520 },
      { kind: "blank", text: "" },
      { kind: "dim", text: "Previous release kept for instant rollback · 3 older releases pruned" },
      { kind: "dim", text: "The CLI has no deploy command: use the dashboard, a GitHub Action, or the Hub." },
    ],
  },
];

export default function CliTerminal({ className = "" }: { className?: string }) {
  const [scene, setScene] = useState(0);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(0);
  const [reduced, setReduced] = useState(false);

  const lines = scenes[scene].lines;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener?.("change", apply);
    return () => media.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) {
      setVisible(lines.length);
      return;
    }

    setVisible(0);
    let count = 0;
    let timer = 0;

    const tick = () => {
      count += 1;
      setVisible(count);
      if (count < lines.length) {
        timer = window.setTimeout(tick, lines[count - 1]?.delay ?? 320);
      }
    };

    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [scene, run, reduced, lines]);

  const finished = visible >= lines.length;

  return (
    <div className={`terminal-surface overflow-hidden rounded-xl ${className}`}>
      {/* Window bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d29922]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/80" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-[#8b949e]">ezz — terminal</span>
        <span className="ml-auto hidden items-center gap-1.5 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#6e7681] sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
          visual preview
        </span>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-[#8b949e] transition-colors hover:bg-white/[0.09] hover:text-[#e6edf3]"
          aria-label="Replay the terminal animation"
        >
          <RotateCcw className="h-3 w-3" />
          replay
        </button>
      </div>

      {/* Scenario tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.07] bg-[#0b0f14]/60 px-2">
        {scenes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setScene(index)}
            className={`border-b-2 px-2.5 py-2 font-mono text-[10.5px] transition-colors ${
              index === scene
                ? "border-primary text-[#e6edf3]"
                : "border-transparent text-[#6e7681] hover:text-[#8b949e]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Output */}
      <div className="docs-scroll min-h-[336px] overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.75] sm:px-5 sm:text-[12.5px]">
        <div className="whitespace-pre text-[#c9d1d9]">
          {lines.slice(0, visible).map((line, index) => (
            <TerminalLine key={`${run}-${index}`} line={line} />
          ))}
          {!finished && visible > 0 && (
            <span className="terminal-caret text-[#c9d1d9]" aria-hidden="true" />
          )}
          {finished && (
            <div className="mt-1 flex items-center gap-2 text-[#6e7681]">
              <span className="text-primary">❯</span>
              <span className="terminal-caret text-[#8b949e]" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-4 py-2 font-mono text-[10px] text-[#6e7681]">
        <span>illustrative output — condensed for the docs</span>
        <span className="hidden sm:inline">exit 0</span>
      </div>
    </div>
  );
}

function TerminalLine({ line }: { line: Line }) {
  if (line.kind === "blank") return <div className="h-[1.75em]" />;

  if (line.kind === "prompt") {
    return (
      <div className="animate-[docs-route-in_180ms_ease-out_both]">
        <span className="text-primary">$ </span>
        <span className="font-semibold text-[#e6edf3]">{line.text}</span>
      </div>
    );
  }

  if (line.kind === "banner") {
    return <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#e6edf3]">{line.text}</div>;
  }

  if (line.kind === "status") {
    return (
      <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#8b949e]">
        {line.text.split("●").map((part, index, parts) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && <span className="text-[#3fb950]">●</span>}
          </span>
        ))}
      </div>
    );
  }

  if (line.kind === "menuActive") {
    return (
      <div className="animate-[docs-route-in_180ms_ease-out_both] -mx-1 rounded bg-primary/15 px-1 text-primary">
        {line.text}
      </div>
    );
  }

  if (line.kind === "menu") {
    return <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#c9d1d9]">{line.text}</div>;
  }

  if (line.kind === "info") {
    return <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#c9d1d9]">{line.text}</div>;
  }

  if (line.kind === "ok") {
    return (
      <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#3fb950]">{line.text}</div>
    );
  }

  if (line.kind === "progress") {
    return <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#d29922]">{line.text}</div>;
  }

  return <div className="animate-[docs-route-in_180ms_ease-out_both] text-[#6e7681]">{line.text}</div>;
}
