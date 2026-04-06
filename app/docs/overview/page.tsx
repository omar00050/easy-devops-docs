import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Learn about Easy DevOps — a unified CLI and web dashboard for managing Nginx, Let's Encrypt SSL certificates (HTTP-01 & DNS-01), and Node.js on Linux and Windows.",
  keywords: ["Easy DevOps overview", "DevOps CLI overview", "Nginx management tool", "SSL certificate management", "Node.js version manager"],
  alternates: { canonical: "/docs/overview" },
};

export default function OverviewPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Getting Started</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Overview</h1>
      <p className="text-muted text-base leading-relaxed mb-10">
        Easy DevOps is a unified DevOps management tool — part CLI, part web dashboard — built for developers who need to manage <strong className="text-foreground">Nginx</strong>, <strong className="text-foreground">SSL certificates</strong>, and <strong className="text-foreground">Node.js</strong> on Linux and Windows servers without juggling dozens of scripts.
      </p>

      <h2 id="what-is-it" className="text-xl font-bold mt-10 mb-4 text-foreground">What is it?</h2>
      <p className="text-muted text-sm leading-relaxed mb-8">
        No external ACME binaries required — SSL certificates are issued via <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acme-client</code> (pure Node.js, Let's Encrypt).
      </p>

      <h2 id="cli-preview" className="text-xl font-bold mt-10 mb-4 text-foreground">CLI Preview</h2>
      <CodeBlock lang="text" filename="terminal">{`  ███████╗███████╗     Easy DevOps  v1.1.0
  ██╔════╝╚════██╗     ─────────────────────
  █████╗      ██╔╝     CLI & Web Dashboard
  ██╔══╝     ██╔╝      Nginx · SSL · Domains · Node.js
  ███████╗ ██████╗
  ╚══════╝ ╚═════╝

  nginx: ✅ v1.26.2 | ACME: acme-client | node: v22.21.1

? Select an option:
❯ 📦 Node.js Manager
  🌐 Nginx Manager
  🔒 SSL Manager
  🔗 Domain Manager
  🎛️ Open Dashboard
  ⚙️ Settings
  🔄 Check for Updates
  ✖ Exit`}</CodeBlock>

      <h2 id="core-capabilities" className="text-xl font-bold mt-10 mb-4 text-foreground">Core Capabilities</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="text-2xl mb-3">🖥️</div>
          <h3 className="text-sm font-bold mb-2">Interactive CLI</h3>
          <p className="text-xs text-muted leading-relaxed">Arrow-key menus with real-time status indicators for Nginx, ACME client, and Node.js versions.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="text-2xl mb-3">📊</div>
          <h3 className="text-sm font-bold mb-2">Web Dashboard</h3>
          <p className="text-xs text-muted leading-relaxed">Vue 3 interface with dark/light themes, Socket.io real-time updates, and configurable accent colors.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="text-2xl mb-3">🔒</div>
          <h3 className="text-sm font-bold mb-2">Pure Node.js SSL</h3>
          <p className="text-xs text-muted leading-relaxed">Let's Encrypt certificates via acme-client — no certbot, no external binaries. HTTP-01 and DNS-01 challenges supported.</p>
        </div>
      </div>

      <h2 id="tech-stack" className="text-xl font-bold mt-10 mb-4 text-foreground">Tech Stack</h2>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Tech</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono font-semibold text-sm text-primary">Node.js</td>
            <td className="py-3 px-4 text-muted">18+ (ESM)</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono font-semibold text-sm text-primary">Database</td>
            <td className="py-3 px-4 text-muted">SQLite via <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">good.db</code></td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono font-semibold text-sm text-primary">CLI</td>
            <td className="py-3 px-4 text-muted">inquirer ^9.2, chalk ^5.3, ora ^7</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono font-semibold text-sm text-primary">Dashboard</td>
            <td className="py-3 px-4 text-muted">Express 5, Socket.io, Vue 3 (CDN)</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono font-semibold text-sm text-primary">SSL</td>
            <td className="py-3 px-4 text-muted"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acme-client</code> (pure Node.js)</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono font-semibold text-sm text-primary">Platforms</td>
            <td className="py-3 px-4 text-muted">Linux, Windows</td>
          </tr>
        </tbody>
      </table>

      <DocsPagination
        next={{ title: "Features", href: "/docs/features", section: "Getting Started" }}
      />
    </div>
  );
}
