import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";

export const metadata: Metadata = {
  title: "Configuration",
  description:
    "Easy DevOps configuration reference — dashboard port, password, nginx directory, SSL directory, and ACME email stored in a single SQLite database.",
  keywords: ["Easy DevOps configuration", "DevOps config", "easy-devops settings", "dashboard password", "acmeEmail"],
  alternates: { canonical: "/docs/configuration" },
};

export default function ConfigurationPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Reference</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Configuration</h1>
      <p className="text-muted text-base leading-relaxed mb-10">All configuration is stored in <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">data/easy-devops.sqlite</code> — a single SQLite file. No separate server needed.</p>

      <h2 id="config-fields" className="text-xl font-bold mt-10 mb-4 text-foreground">Config Fields</h2>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Field</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Default (Linux)</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Default (Windows)</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">dashboardPort</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">6443</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">6443</td>
            <td className="py-3 px-4 text-muted">Dashboard HTTP port</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">dashboardPassword</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">admin</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">admin</td>
            <td className="py-3 px-4 text-muted">Dashboard login password</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">nginxDir</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">/etc/nginx</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">C:\\nginx</td>
            <td className="py-3 px-4 text-muted">Nginx installation directory</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sslDir</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">/etc/easy-devops/ssl</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">C:\\easy-devops\\ssl</td>
            <td className="py-3 px-4 text-muted">SSL certificate storage root</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acmeEmail</code></td>
            <td className="py-3 px-4 text-muted italic">empty</td>
            <td className="py-3 px-4 text-muted italic">empty</td>
            <td className="py-3 px-4 text-muted">Email for Let's Encrypt account (required for cert issuance)</td>
          </tr>
        </tbody>
      </table>

      <h2 id="database-keys" className="text-xl font-bold mt-10 mb-4 text-foreground">Database Keys</h2>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Key</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Contents</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">config</code></td>
            <td className="py-3 px-4 text-muted">Dashboard port, password, nginxDir, sslDir, acmeEmail</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">system-detection</code></td>
            <td className="py-3 px-4 text-muted">Cached system info (OS, Node, nginx)</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">domains</code></td>
            <td className="py-3 px-4 text-muted">JSON array of domain configurations</td>
          </tr>
        </tbody>
      </table>

      <DocsPagination
        prev={{ title: "Dashboard API", href: "/docs/api", section: "Reference" }}
        next={{ title: "Platform Support", href: "/docs/platform", section: "Reference" }}
      />
    </div>
  );
}
