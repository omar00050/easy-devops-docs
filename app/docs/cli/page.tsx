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
  Server,
  Link2,
  LayoutDashboard,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CLI Interface",
  description:
    "The Easy DevOps interactive CLI: keyboard-driven menus, live service status, sub-menus for nginx, SSL, domains and deployments, and every global flag.",
  keywords: ["Easy DevOps CLI", "ezz command", "interactive DevOps menu", "terminal UI", "CLI flags"],
  alternates: { canonical: "/docs/cli" },
  openGraph: {
    type: "article",
    url: "/docs/cli",
    siteName: "Easy DevOps",
    title: "CLI Interface",
    description:
      "The interactive terminal interface: menus, live service status, and every global flag for nginx, SSL, domains and deployments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLI Interface",
    description:
      "The interactive terminal interface: menus, live service status, and every global flag for nginx, SSL, domains and deployments.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

const menuMap = [
  { icon: Boxes, title: "Node.js Manager", desc: "Switch Node versions, manage global packages, update npm." },
  { icon: Globe, title: "Nginx Manager", desc: "Start, stop, reload, test config, read the error log." },
  { icon: ShieldCheck, title: "SSL Manager", desc: "Issue, renew and inspect Let's Encrypt certificates." },
  { icon: Link2, title: "Domain Manager", desc: "Add, edit, enable or delete reverse-proxy domains." },
  { icon: LayoutDashboard, title: "Open Dashboard", desc: "Start the web dashboard and print its URL." },
  { icon: Settings, title: "Settings", desc: "Ports, password, directories, ACME email, Linux permissions." },
  { icon: Server, title: "Background Service", desc: "Install, inspect and repair the native service." },
  { icon: RefreshCw, title: "Check for Updates", desc: "Ask npm for a newer Easy DevOps release." },
  { icon: Clock, title: "Exit", desc: "Leave cleanly. Ctrl+C works at any prompt." },
];

const flags = [
  { flag: "<none>", desc: "Start the interactive menu." },
  { flag: "system-info", desc: "Print detected system info and exit." },
  { flag: "--dash", desc: "Run the dashboard in this terminal and print its URL." },
  { flag: "--dev", desc: "Use an isolated .dev-data directory; combine with --dash." },
  { flag: "--classic-ui", desc: "Serve the legacy EJS dashboard for one run." },
  { flag: "dashboard setup-code", desc: "Issue a new first-run setup code." },
  { flag: "-h, --help", desc: "Show every command, flag and example." },
  { flag: "-v, --version", desc: "Print the installed version." },
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
        Run <code className={C}>ezz</code> with no arguments. The banner prints the nginx version,
        the Node runtime and whether the background service is running, so a broken server is
        visible before you choose anything.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-8">
        <li><strong className="text-foreground">Arrow keys</strong> move, <strong className="text-foreground">Enter</strong> selects, <strong className="text-foreground">Ctrl+C</strong> leaves at any prompt.</li>
        <li>Every manager is a sub-menu. You come back to the main menu when a task finishes — nothing is one-shot.</li>
        <li>Prompts validate as you type: domain names, ports and paths are checked before a config is written.</li>
        <li>The CLI and the dashboard read the same SQLite database, so a domain added in either place appears in both.</li>
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

      <h2 id="flags" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Global flags
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Everything below is non-interactive and safe in scripts. The full list — including the
        service, runtime, update, cleanup and uninstall command groups — is on the{" "}
        <a href="/docs/commands">Command Reference</a> page.
      </p>
      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Flag</th>
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
