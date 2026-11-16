"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import { Copy, Check } from "lucide-react";

// Register languages for PrismLight
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import powershell from "react-syntax-highlighter/dist/esm/languages/prism/powershell";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("powershell", powershell);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bat", bash);
SyntaxHighlighter.registerLanguage("cmd", bash);
SyntaxHighlighter.registerLanguage("text", bash);

interface CodeBlockProps {
  children: string;
  lang: string;
  filename?: string;
}

export default function CodeBlock({ children, lang, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable on insecure origins; the block stays selectable.
    }
  };

  return (
    <div className="terminal-surface group my-6 overflow-hidden rounded-xl">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d29922]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/80" />
        </span>

        <span className="ml-1 flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-[11px] text-[#8b949e]">{filename || `~/ez.${lang === "text" ? "log" : lang}`}</span>
          <span className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#6e7681] sm:inline">
            {lang}
          </span>
        </span>

        <button
          onClick={handleCopy}
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#8b949e] transition-colors duration-150 hover:bg-white/[0.09] hover:text-[#e6edf3]"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#3fb950]" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="docs-scroll overflow-x-auto">
        <SyntaxHighlighter
          language={lang}
          style={atomOneDark as Record<string, React.CSSProperties>}
          customStyle={{ margin: 0, padding: "18px 20px", background: "transparent" }}
          codeTagProps={{ style: { fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" } }}
          showLineNumbers={false}
          wrapLongLines
        >
          {children.replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
