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
    await navigator.clipboard.writeText(children.replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] my-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8b949e]">
          {filename || lang}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#8b949e] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] rounded-md hover:text-[#e6edf3] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-150"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={lang}
          style={atomOneDark as Record<string, React.CSSProperties>}
          customStyle={{ margin: 0, padding: "20px", background: "#0d1117" }}
          showLineNumbers={false}
          wrapLongLines
        >
          {children.replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
