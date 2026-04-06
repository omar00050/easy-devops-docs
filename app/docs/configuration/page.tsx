import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";

export const metadata: Metadata = {
  title: "Configuration",
  description:
    "Easy DevOps configuration reference — dashboard port, password, nginx directory, SSL directory, and ACME email. Database stored in user home directory, survives npm updates.",
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
      <p className="text-muted text-base leading-relaxed mb-6">All configuration is stored in a single SQLite file in a persistent user directory — never inside the npm package folder, so it survives updates.</p>
      <div className="bg-surface border border-border rounded-xl p-5 text-sm mb-10">
        <p className="font-bold text-foreground mb-2">Database location</p>
        <ul className="space-y-1 text-muted">
          <li><span className="text-foreground font-medium">Linux / macOS:</span> <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">~/.config/easy-devops/easy-devops.sqlite</code></li>
          <li><span className="text-foreground font-medium">Windows:</span> <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">%APPDATA%\easy-devops\easy-devops.sqlite</code></li>
        </ul>
        <p className="text-muted mt-3 text-xs">If you are upgrading from v1.0.x, Easy DevOps automatically migrates the old database on first run — no manual action needed.</p>
      </div>

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

      <h2 id="linux-permissions" className="text-xl font-bold mt-10 mb-4 text-foreground">Linux Permissions</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">
        On Linux, the dashboard runs as a regular user with no attached terminal. Nginx service control
        (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">systemctl start/stop/reload/restart nginx</code>) requires <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sudo</code> — but interactive sudo is not available from a web API.
      </p>
      <p className="text-muted text-sm leading-relaxed mb-4">
        Easy DevOps solves this with a one-time setup that writes NOPASSWD sudoers rules to <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">/etc/sudoers.d/easy-devops</code>. After setup, all service control commands use <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sudo -n</code> (non-interactive) and work without prompting for a password.
      </p>
      <div className="space-y-3 mb-6">
        <div className="bg-surface border border-border rounded-xl p-5 text-sm">
          <p className="font-bold text-foreground mb-1">From the CLI</p>
          <p className="text-muted">Go to <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">Settings → Setup Linux Permissions</code>. The CLI prompts for your sudo password once via <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sudo -v</code>, then creates the sudoers file and sets directory ownership.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 text-sm">
          <p className="font-bold text-foreground mb-1">From the Dashboard</p>
          <p className="text-muted">Open <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">Settings → Linux Permissions</code>. Enter your sudo password and click <strong>Setup Permissions</strong>. The server uses <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sudo -S</code> to pipe the password — no terminal needed. A status badge shows <strong>✓ Configured</strong> once complete.</p>
        </div>
      </div>
      <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-5 text-sm mb-10">
        <p className="font-bold text-amber-500 mb-1">Important — nginx -t never needs sudo</p>
        <p className="text-muted">The nginx config test (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">nginx -t</code>) is read-only and world-readable. Easy DevOps runs it <em>without</em> sudo. On Linux, <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">nginx -t</code> exits with code 1 after printing "syntax is ok" because it cannot write <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">/run/nginx.pid</code> as a non-root user. Easy DevOps detects this and correctly reports the config as valid by checking output text rather than exit code.</p>
      </div>

      <DocsPagination
        prev={{ title: "Dashboard API", href: "/docs/api", section: "Reference" }}
        next={{ title: "Platform Support", href: "/docs/platform", section: "Reference" }}
      />
    </div>
  );
}
