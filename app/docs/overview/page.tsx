import type { Metadata } from "next";
import { latestVersion } from "@/lib/version";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";
import SystemMap from "@/components/SystemMap";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Learn about Easy DevOps — a unified CLI and web dashboard for managing Nginx, Let's Encrypt SSL certificates (HTTP-01 & DNS-01), and Node.js on Linux and Windows.",
  keywords: ["Easy DevOps overview", "DevOps CLI overview", "Nginx management tool", "SSL certificate management", "Node.js version manager"],
  alternates: { canonical: "/docs/overview" },
  openGraph: {
    type: "article",
    url: "/docs/overview",
    siteName: "Easy DevOps",
    title: "Overview",
    description:
      "What Easy DevOps is: one CLI and web dashboard for Nginx, Let's Encrypt SSL and Node.js on Linux and Windows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overview",
    description:
      "What Easy DevOps is: one CLI and web dashboard for Nginx, Let's Encrypt SSL and Node.js on Linux and Windows.",
  },
};

export default async function OverviewPage() {
  const version = await latestVersion();
  const versionLabel = version ? `  v${version}` : "";

  return (
    <DocPage
      section="Getting Started"
      title="Overview"
      description={
        <>
        Easy DevOps is a unified DevOps management tool — part CLI, part web dashboard — built for developers who need to manage <strong className="text-foreground">Nginx</strong>, <strong className="text-foreground">SSL certificates</strong>, and <strong className="text-foreground">Node.js</strong> on Linux and Windows servers without juggling dozens of scripts. It also <strong className="text-foreground">deploys your apps</strong>: give it a git repository and it is fetched, built and kept running, from the dashboard or from GitHub Actions.
        </>
      }
    >

      <h2 id="what-is-it" className="text-xl font-bold mt-10 mb-4 text-foreground">What is it?</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">
        It runs on the server itself and manages the real stack — nginx configs and reloads, Let's Encrypt
        certificates, and PM2 apps deployed from a git repository — rather than wrapping someone else's
        control panel. One install covers the daily loop: add a domain, issue SSL, deploy a release, watch
        health and renewals, and keep it running through the background service.
      </p>
      <p className="text-muted text-sm leading-relaxed mb-8">
        No external ACME binaries required — SSL certificates are issued via <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acme-client</code> (pure Node.js, Let's Encrypt).
      </p>

      <h2 id="how-it-fits-together" className="text-xl font-bold mt-10 mb-4 text-foreground">How it fits together</h2>
      <p className="text-muted text-sm leading-relaxed mb-2">
        One engine, three ways in. The CLI, the web dashboard and the Hub all drive the same core — the same
        nginx configs, the same certificates, the same deployments. Nothing is duplicated and nothing is
        rewritten per surface.
      </p>
      <SystemMap />

      <h2 id="cli-preview" className="text-xl font-bold mt-10 mb-4 text-foreground">CLI Preview</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The banner reports your machine&apos;s detected nginx and Node versions. The example below
        shows the layout, not fixed versions.
      </p>
      <CodeBlock lang="text" filename="terminal (example output)">{`  ███████╗███████╗     Easy DevOps${versionLabel}
  ██╔════╝╚════██╗     ─────────────────────
  █████╗      ██╔╝     CLI & Web Dashboard
  ██╔══╝     ██╔╝      Nginx · SSL · Domains · Node.js
  ███████╗ ██████╗
  ╚══════╝ ╚═════╝

  nginx: <detected> | ACME: acme-client | node: <detected>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
          <p className="text-xs text-muted leading-relaxed">React 19 interface with dark/light themes, Socket.io real-time updates, and configurable accent colors.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="text-2xl mb-3">🔒</div>
          <h3 className="text-sm font-bold mb-2">Pure Node.js SSL</h3>
          <p className="text-xs text-muted leading-relaxed">Let's Encrypt certificates via acme-client — no certbot, no external binaries. HTTP-01 and DNS-01 challenges supported.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="text-2xl mb-3">🚀</div>
          <h3 className="text-sm font-bold mb-2">Git Deployments</h3>
          <p className="text-xs text-muted leading-relaxed">Deploy from a git repository: build a fresh release, health-check it, swap PM2, and roll back to a previous release in one click.</p>
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
            <td className="py-3 px-4 text-muted">Express 5, Socket.io, React 19 + Vite</td>
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
    </DocPage>
  );
}
