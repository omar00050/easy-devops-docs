import type { Metadata } from "next";
import { latestVersion } from "@/lib/version";
import DocsPagination from "@/components/DocsPagination";
import CmdTable, { type CmdGroup } from "@/components/CmdTable";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Command Reference",
  description:
    "The real Easy DevOps CLI map: main menu, Nginx, SSL, domain and Node.js sub-menus, service and runtime commands, settings, and every global flag.",
  keywords: ["easy-devops commands", "DevOps CLI reference", "Nginx CLI commands", "SSL CLI commands", "domain manager CLI"],
  alternates: { canonical: "/docs/commands" },
  openGraph: {
    type: "article",
    url: "/docs/commands",
    siteName: "Easy DevOps",
    title: "Command Reference",
    description:
      "Every CLI command and sub-command in one reference — menu map, Nginx, SSL, domains, Node.js, service, runtime and settings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Command Reference",
    description:
      "Every CLI command and sub-command in one reference — menu map, Nginx, SSL, domains, Node.js, service, runtime and settings.",
  },
};

const groups: CmdGroup[] = [
  {
    title: "Main Menu Options",
    commands: [
      { name: "Node.js Manager", description: "Switch Node versions, manage global packages, update npm." },
      { name: "Nginx Manager", description: "Start, stop, reload or restart nginx, test config, view error log, install nginx." },
      { name: "SSL Manager", description: "Create a certificate, renew one, renew everything expiring within 30 days." },
      { name: "Domain Manager", description: "List, add, edit, enable/disable, delete reverse proxy configs." },
      { name: "Open Dashboard", description: "Start the web dashboard (React UI served by the Express + Socket.io server), open it, or stop it." },
      { name: "Settings", description: "Port, auth and listen address, directories, ACME email, auto-renew, deployments folder, Linux permissions." },
      { name: "Check for Updates", description: "Checks the npm registry for a new version of easy-devops and installs it." },
      { name: "Exit", description: "Exit the CLI gracefully. Press Ctrl+C at any time." },
    ],
  },
  {
    title: "Commands and Lifecycle",
    commands: [
      { name: "service install", description: "Install the native background service (systemd / Windows service / Startup launcher) and enable it." },
      { name: "service status", description: "Show whether the service is installed, running, and whether it starts on boot or logon." },
      { name: "service start", description: "Start the service now." },
      { name: "service stop", description: "Stop it until the next logon or boot (temporary)." },
      { name: "service restart", description: "Stop and start the service in one step." },
      { name: "service logs", description: "Print recent service output and error log lines." },
      { name: "service repair", description: "Rewrite the service definition, re-pin the runtime and restart it after an interrupted update." },
      { name: "service uninstall", description: "Remove the service definition. Data and certificates are kept." },
      { name: "runtime status", description: "Show the pinned Node runtime and the Node versions available from the live lookup." },
      { name: "runtime update", description: "Move the service to a newer Node, with rollback if it fails." },
      { name: "daemon", description: "Run the background worker in the foreground for debugging. No web port is opened." },
      { name: "update", description: "Update Easy DevOps itself, then restart the service." },
      { name: "cleanup", description: "List reclaimable files (runtime backups, old logs, stale locks, nginx .bak files, PM2 logs, Node versions) and remove the ones you choose. Use --days N for the log age." },
      { name: "uninstall", description: "Remove Easy DevOps. Needs --purge to do anything; the data directory is exported as a backup first." },
      { name: "dashboard setup-code", description: "Issue a new first-run setup code, printed to the local terminal only." },
      { name: "system-info", description: "Print detected system info (OS, Node, nginx) and exit." },
    ],
  },
  {
    title: "Global Flags",
    commands: [
      { name: "--dash", description: "Start the web dashboard in the foreground and print its URL. Ctrl+C stops it cleanly." },
      { name: "--dev", description: "Use an isolated data directory (.dev-data in the project), so development never touches the installed configuration. Combines with --dash." },
      { name: "--classic-ui", description: "Serve the old EJS dashboard instead of the React one, for one run. Temporary fallback." },
      { name: "--purge", description: "With uninstall: remove the service, the pinned runtime and the data directory, after exporting a backup." },
      { name: "--days N", description: "With cleanup: treat logs older than N days as reclaimable (default 14)." },
      { name: "--yes", description: "Answer confirmations yes. For scripts; uninstall --purge still prints what it will do." },
      { name: "-h, --help", description: "Show the full command help." },
      { name: "-v, --version", description: "Print the installed version and exit." },
    ],
  },
  {
    title: "Nginx Manager Sub-commands",
    commands: [
      { name: "Reload nginx", description: "Tests config, then sends a graceful reload. Shown while nginx is running." },
      { name: "Restart nginx", description: "Tests config, then a full stop/start. Shown while nginx is running." },
      { name: "Stop nginx", description: "Stop nginx. Shown while nginx is running." },
      { name: "Start nginx", description: "Start an installed but stopped nginx." },
      { name: "Test config", description: "Runs nginx -t and displays the result." },
      { name: "View error log", description: "Shows the last 50 lines of the nginx error log." },
      { name: "Install nginx", description: "Linux: apt-get. Windows: downloads the current stable build from nginx.org and extracts it into nginxDir (winget is not used)." },
    ],
  },
  {
    title: "Domain Manager Sub-commands",
    commands: [
      { name: "List Domains", description: "Show all configured domains in a table with status." },
      { name: "Add Domain", description: "Interactive prompts for domain configuration, including SSL and optional certificate creation." },
      { name: "Edit Domain", description: "Modify existing domain settings." },
      { name: "Enable / Disable", description: "Toggle domain on/off without deleting the config." },
      { name: "Delete Domain", description: "Remove a domain and its nginx config." },
    ],
  },
  {
    title: "SSL Manager Sub-commands",
    commands: [
      { name: "Create new certificate", description: "Issue a new Let's Encrypt certificate via HTTP-01 or DNS-01 challenge." },
      { name: "Renew a certificate", description: "Select and renew a specific certificate by domain." },
      { name: "Renew all expiring (< 30 days)", description: "Batch-renew all certificates expiring within 30 days." },
    ],
  },
  {
    title: "Node.js Manager Sub-commands",
    commands: [
      { name: "Switch Node version", description: "Fetch the available LTS versions live from nvm, then switch to the selected one." },
      { name: "Manage global packages", description: "Install, uninstall, or list globally installed npm packages." },
      { name: "Update npm", description: "Update npm to the latest version." },
    ],
  },
  {
    title: "Settings Sub-commands",
    commands: [
      { name: "Dashboard Port", description: "Set the port the web dashboard listens on (default: 6443)." },
      { name: "Dashboard Auth", description: "Require a password, or run without one when the dashboard listens on this machine only." },
      { name: "Listen On", description: "127.0.0.1 (this machine only) or 0.0.0.0 (all interfaces)." },
      { name: "Nginx Directory", description: "Set the nginx installation path (nginxDir)." },
      { name: "SSL Directory", description: "Set the SSL certificate storage root (sslDir)." },
      { name: "ACME Email", description: "Set the email used for Let's Encrypt account registration. Required before a certificate can be issued." },
      { name: "SSL Auto-Renew", description: "Turn background HTTP-01 renewal on or off and set the window (1–30 days, default 7)." },
      { name: "Deployments Folder", description: "Where new deployed apps are created. Changing it does not move existing apps." },
      { name: "Setup Linux Permissions", description: "Linux only. Prints and runs the exact commands that install /etc/sudoers.d/easy-devops. sudo asks for your password in this terminal; Easy DevOps never sees it. The rule grants exactly five systemctl nginx commands." },
    ],
  },
];

export default async function CommandsPage() {
  const version = await latestVersion();
  const versionLabel = version ? `  v${version}` : "";

  return (
    <DocPage
      section="Using the CLI"
      title="Command Reference"
      description={
        <>
          Launch with <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">easy-devops</code> or the short alias <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">ezz</code> — both are registered as npm bin commands and do the same thing. Select an option with arrow keys, then follow the sub-menu prompts.
        </>
      }
    >

      <h2 id="cli-banner" className="text-xl font-bold mt-10 mb-4 text-foreground">CLI Banner</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The real banner prints your machine&apos;s detected nginx and Node versions, not a fixed pair.
        The example below shows the shape; the values differ on your server.
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

      <h2 id="commands" className="prose-heading-3 text-foreground">All Commands</h2>
      <CmdTable groups={groups} />

      <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm">
        <p className="font-bold text-foreground mb-1">There is no CLI deploy command</p>
        <p className="text-muted leading-relaxed">
          Deployments are managed from the dashboard&apos;s Deployments page, from a GitHub Action
          through the deploy hook, or from the Hub. The interactive CLI has no deploy menu.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "CLI Interface", href: "/docs/cli", section: "Using the CLI" }}
        next={{ title: "SSL Manager", href: "/docs/ssl", section: "Using the CLI" }}
      />
    </DocPage>
  );
}
