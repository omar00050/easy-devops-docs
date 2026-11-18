import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CmdTable, { type CmdGroup } from "@/components/CmdTable";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Command Reference",
  description:
    "Complete Easy DevOps CLI command reference: main menu options, Nginx manager, SSL manager, domain manager, and Node.js manager sub-commands.",
  keywords: ["easy-devops commands", "DevOps CLI reference", "Nginx CLI commands", "SSL CLI commands", "domain manager CLI"],
  alternates: { canonical: "/docs/commands" },
  openGraph: {
    type: "article",
    url: "/docs/commands",
    siteName: "Easy DevOps",
    title: "Command Reference",
    description:
      "Every CLI command and sub-command in one reference — main menu, Nginx, SSL, domains and Node.js managers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Command Reference",
    description:
      "Every CLI command and sub-command in one reference — main menu, Nginx, SSL, domains and Node.js managers.",
  },
};

const groups: CmdGroup[] = [
  {
    title: "Main Menu Options",
    commands: [
      { name: "Node.js Manager", description: "Switch Node versions, manage global packages, update npm." },
      { name: "Nginx Manager", description: "Reload, restart, test config, view error log, install nginx." },
      { name: "SSL Manager", description: "List certs, issue new certs (HTTP-01 or DNS-01), renew expiring certs." },
      { name: "Domain Manager", description: "List, add, edit, enable/disable, delete reverse proxy configs." },
      { name: "Open Dashboard", description: "Starts the web dashboard — React UI served by the Express + Socket.io server." },
      { name: "Settings", description: "Configure ports, directories, passwords, ACME email, and Linux permissions." },
      { name: "Check for Updates", description: "Checks npm registry for a new version of easy-devops." },
      { name: "Exit", description: "Exit the CLI gracefully. Press Ctrl+C at any time." },
    ],
  },
  {
    title: "Background Service & Lifecycle",
    commands: [
      { name: "service install", description: "Install the native background service (systemd / Windows service) and enable it at boot." },
      { name: "service status", description: "Show whether the service is running and whether it starts on boot." },
      { name: "service start", description: "Start the service now." },
      { name: "service stop", description: "Stop it until the next logon or boot (temporary)." },
      { name: "service restart", description: "Stop and start the service in one step." },
      { name: "service logs", description: "Print recent service output and error log lines." },
      { name: "service repair", description: "Reinstall the service definition after an interrupted update." },
      { name: "service uninstall", description: "Remove the service definition. Data and certificates are kept." },
      { name: "runtime status", description: "Show the pinned Node runtime and the available LTS versions." },
      { name: "runtime update", description: "Move the service to a newer Node, with rollback if it fails." },
      { name: "daemon", description: "Run the background worker in the foreground for debugging. No web port is opened." },
      { name: "update", description: "Update Easy DevOps itself, then restart the service." },
      { name: "cleanup", description: "List reclaimable files (runtime backups, old logs, stale locks, nginx .bak files) and remove the ones you choose. Use --days N for the log age." },
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
      { name: "Reload nginx", description: "Tests config, then sends graceful reload signal." },
      { name: "Restart nginx", description: "Tests config, then full stop/start." },
      { name: "Test config", description: "Runs nginx -t and displays the result." },
      { name: "View error log", description: "Shows the last 50 lines of the Nginx error log." },
      { name: "Install nginx", description: "Installs via apt-get (Linux) or winget (Windows)." },
    ],
  },
  {
    title: "Domain Manager Sub-commands",
    commands: [
      { name: "List Domains", description: "Show all configured domains in a table with status." },
      { name: "Add Domain", description: "Interactive prompts for domain configuration." },
      { name: "Edit Domain", description: "Modify existing domain settings." },
      { name: "Enable / Disable", description: "Toggle domain on/off without deleting the config." },
      { name: "Delete Domain", description: "Remove domain (optionally delete SSL files too)." },
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
      { name: "Switch Node version", description: "List available LTS versions, switch to selected version." },
      { name: "Manage global packages", description: "Install, uninstall, or list globally installed npm packages." },
      { name: "Update npm", description: "Updates npm to the latest version." },
    ],
  },
  {
    title: "Settings Sub-commands",
    commands: [
      { name: "Dashboard Port", description: "Set the port the web dashboard listens on (default: 6443)." },
      { name: "Dashboard Password", description: "Change the login password for the web dashboard." },
      { name: "Nginx Directory", description: "Set the nginx installation path (nginxDir)." },
      { name: "SSL Directory", description: "Set the SSL certificate storage root (sslDir)." },
      { name: "ACME Email", description: "Set the email used for Let's Encrypt account registration." },
      { name: "Setup Linux Permissions", description: "Linux only. Runs sudo -v then writes /etc/sudoers.d/easy-devops with NOPASSWD rules for systemctl and the detected nginx binary. Required for nginx service control from the dashboard. Shows ✅ configured once done." },
    ],
  },
];

export default function CommandsPage() {
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
      <CodeBlock lang="text" filename="terminal">{`  ███████╗███████╗     Easy DevOps  v2.0.0
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

      <h2 id="commands" className="prose-heading-3 text-foreground">All Commands</h2>
      <CmdTable groups={groups} />

      <DocsPagination
        prev={{ title: "CLI Interface", href: "/docs/cli", section: "Using the CLI" }}
        next={{ title: "SSL Manager", href: "/docs/ssl", section: "Using the CLI" }}
      />
    </DocPage>
  );
}
