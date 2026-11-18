import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import CliTerminal from "@/components/CliTerminal";
import {
  Boxes,
  Globe,
  Settings,
  ShieldCheck,
  RefreshCw,
  Link2,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CLI Interface",
  description:
    "The Easy DevOps interactive CLI: the real main menu, its sub-menus, live service status, and every non-interactive command and global flag.",
  keywords: ["Easy DevOps CLI", "ezz command", "interactive DevOps menu", "terminal UI", "CLI flags"],
  alternates: { canonical: "/docs/cli" },
  openGraph: {
    type: "article",
    url: "/docs/cli",
    siteName: "Easy DevOps",
    title: "CLI Interface",
    description:
      "The interactive terminal interface: the menu map, sub-menus, and every non-interactive command and flag.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLI Interface",
    description:
      "The interactive terminal interface: the menu map, sub-menus, and every non-interactive command and flag.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

const menuMap = [
  { icon: Boxes, title: "Node.js Manager", desc: "Switch Node versions, manage global packages, update npm." },
  { icon: Globe, title: "Nginx Manager", desc: "Start, stop, reload or restart nginx, test the config, view the error log, install nginx." },
  { icon: ShieldCheck, title: "SSL Manager", desc: "Create a certificate, renew one, renew everything expiring within 30 days." },
  { icon: Link2, title: "Domain Manager", desc: "List, add, edit, enable/disable and delete reverse-proxy domains." },
  { icon: LayoutDashboard, title: "Open Dashboard", desc: "Start the web dashboard, open it in a browser, or stop it." },
  { icon: Settings, title: "Settings", desc: "Port, auth and listen address, directories, ACME email, auto-renew, deployments folder, Linux permissions." },
  { icon: RefreshCw, title: "Check for Updates", desc: "Ask npm for a newer Easy DevOps release and install it." },
  { icon: LogOut, title: "Exit", desc: "Leave cleanly. Ctrl+C works at any prompt." },
];

const flags = [
  { flag: "<none>", desc: "Start the interactive menu." },
  { flag: "system-info", desc: "Print detected system info and exit." },
  { flag: "daemon", desc: "Run the background worker in the foreground: monitoring, notifications and the Hub agent. No web port is opened." },
  { flag: "service <action>", desc: "Native background service: install, uninstall, status, start, stop, restart, logs, repair." },
  { flag: "runtime <action>", desc: "The Node runtime the service is pinned to: status, update." },
  { flag: "update", desc: "Update Easy DevOps itself, then restart the service." },
  { flag: "cleanup", desc: "List reclaimable files and remove the ones you choose. Add --days N for the log age." },
  { flag: "uninstall", desc: "Remove Easy DevOps. Needs --purge to do anything." },
  { flag: "dashboard <action>", desc: "Currently setup-code: issue a new first-run setup code." },
  { flag: "--dash", desc: "Run the dashboard in this terminal and print its URL." },
  { flag: "--dev", desc: "Use an isolated .dev-data directory; combine with --dash." },
  { flag: "--classic-ui", desc: "Serve the legacy EJS dashboard for one run." },
  { flag: "--purge", desc: "With uninstall: remove the service, the pinned runtime and the data directory, after exporting a backup." },
  { flag: "--days N", desc: "With cleanup: treat logs older than N days as reclaimable (default 14)." },
  { flag: "--yes", desc: "Answer the confirmations yes. For scripts." },
  { flag: "-h, --help", desc: "Show every command, flag and example." },
  { flag: "-v, --version", desc: "Print the installed version." },
];

const subMenus = [
  { name: "Nginx Manager", items: "Reload nginx · Restart nginx · Stop nginx · Start nginx · Test config · View error log · Install nginx (when nginx is not installed)" },
  { name: "SSL Manager", items: "Create new certificate (HTTP-01 or DNS-01) · Renew a certificate · Renew all expiring within 30 days" },
  { name: "Domain Manager", items: "List Domains · Add Domain · Edit Domain · Enable / Disable Domain · Delete Domain" },
  { name: "Node.js Manager", items: "Switch Node version · Manage global packages · Update npm" },
  { name: "Open Dashboard", items: "Start dashboard · Stop dashboard · Open in browser · How to use (the first two depend on whether it is already running)" },
  { name: "Settings", items: "Dashboard Port · Dashboard Auth · Listen On · Nginx Directory · SSL Directory · ACME Email · SSL Auto-Renew · Deployments Folder · Setup Linux Permissions" },
];

export default function CliPage() {
  return (
    <DocPage
      section="Using the CLI"
      title="CLI Interface"
      description="One binary, two names: easy-devops and ezz. Everything the tool does is reachable from a keyboard-driven menu that shows the state of your server before you touch it."
    >
      <CliTerminal className="mt-2" />
      <p className="mt-3 text-center font-mono text-[11px] text-muted">
        Visual preview — try the three scenarios above.
      </p>

      <h2 id="interactive-menu" className="text-xl font-bold mt-10 mb-4 text-foreground">
        The interactive menu
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Run <code className={C}>ezz</code> with no arguments. The banner prints the version and the
        data directory in use, followed by a detected-status line, so a broken server is visible before
        you choose anything.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-8">
        <li><strong className="text-foreground">Arrow keys</strong> move, <strong className="text-foreground">Enter</strong> selects, <strong className="text-foreground">Ctrl+C</strong> leaves at any prompt.</li>
        <li>Every manager is a sub-menu. You come back to the main menu when a task finishes — nothing is one-shot.</li>
        <li>Prompts validate as you type: domain names, ports and paths are checked before a config is written.</li>
        <li>The CLI and the dashboard read the same SQLite database, so a domain added in either place appears in both.</li>
        <li>Node.js versions are fetched live from nvm (<code className={C}>nvm ls-remote --lts</code> on Linux, <code className={C}>nvm list available</code> on Windows) — the menu never ships a hard-coded list.</li>
      </ul>

      <h2 id="menu-map" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Menu map
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
        {menuMap.map((item) => (
          <div
            key={item.title}
            className="group flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4 transition-colors hover:border-primary/30"
          >
            <span className="mt-0.5 rounded-lg border border-border bg-background/60 p-2 text-primary">
              <item.icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{item.title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{item.desc}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted leading-relaxed mb-8">
        The background service is not a menu item. It is managed with{" "}
        <code className={C}>ezz service …</code> from a terminal, and its state is shown on the
        Processes page in the dashboard.
      </p>

      <h2 id="submenus" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Sub-menus
      </h2>
      <div className="space-y-2 mb-10">
        {subMenus.map((menu) => (
          <div key={menu.name} className="rounded-xl border border-border bg-surface/50 p-4">
            <div className="text-sm font-semibold text-foreground">{menu.name}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted">{menu.items}</div>
          </div>
        ))}
      </div>

      <h2 id="flags" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Commands and global flags
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Everything below is non-interactive and safe in scripts. The same list is on the{" "}
        <a href="/docs/commands">Command Reference</a> page.
      </p>
      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Command / flag</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it does</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((item, index) => (
            <tr key={item.flag} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
              <td className="py-2.5 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">{item.flag}</td>
              <td className="py-2.5 px-4 text-xs text-muted leading-relaxed">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">tip</div>
        <p className="text-muted leading-relaxed">
          Developing Easy DevOps itself? <code className={C}>npm run dev</code> launches the menu
          against <code className={C}>.dev-data</code>, and <code className={C}>ezz --dev --dash</code>{" "}
          serves the dashboard from the same isolated directory. Your installed configuration is
          never touched.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Quick Start", href: "/docs/quickstart", section: "Getting Started" }}
        next={{ title: "Command Reference", href: "/docs/commands", section: "Using the CLI" }}
      />
    </DocPage>
  );
}
