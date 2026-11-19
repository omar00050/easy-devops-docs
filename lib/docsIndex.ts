export interface DocsHeading {
  id: string;
  text: string;
}

export interface DocsIndexEntry {
  title: string;
  href: string;
  section: string;
  description: string;
  headings: DocsHeading[];
}

export const docsIndex: DocsIndexEntry[] = [
  {
    title: "Overview",
    href: "/docs/overview",
    section: "Getting Started",
    description: "What Easy DevOps is, what runs where, and the stack behind it.",
    headings: [
      { id: "what-is-it", text: "What is it?" },
      { id: "how-it-fits-together", text: "How it fits together" },
      { id: "cli-preview", text: "CLI Preview" },
      { id: "core-capabilities", text: "Core Capabilities" },
      { id: "tech-stack", text: "Tech Stack" },
    ],
  },
  {
    title: "Features",
    href: "/docs/features",
    section: "Getting Started",
    description: "Nginx, SSL, domains, Node.js, deployments, notifications and the Hub.",
    headings: [],
  },
  {
    title: "Installation",
    href: "/docs/installation",
    section: "Getting Started",
    description: "Install with npm or the install script on Linux and Windows.",
    headings: [{ id: "requirements", text: "Requirements" }],
  },
  {
    title: "Quick Start",
    href: "/docs/quickstart",
    section: "Getting Started",
    description: "Five steps from a fresh server to a proxied domain with SSL.",
    headings: [
      { id: "the-path", text: "The path from install to a running fleet" },
      { id: "the-short-version", text: "The short version" },
    ],
  },
  {
    title: "CLI Interface",
    href: "/docs/cli",
    section: "Using the CLI",
    description: "The interactive menu, its clean pages and keyboard model, and every global flag.",
    headings: [
      { id: "interactive-menu", text: "The interactive menu" },
      { id: "pages", text: "Clean pages" },
      { id: "menu-map", text: "Menu map" },
      { id: "submenus", text: "Sub-menus" },
      { id: "flags", text: "Commands and global flags" },
    ],
  },
  {
    title: "Command Reference",
    href: "/docs/commands",
    section: "Using the CLI",
    description: "Every menu option and sub-command, searchable.",
    headings: [{ id: "commands", text: "All Commands" }],
  },
  {
    title: "SSL Manager",
    href: "/docs/ssl",
    section: "Using the CLI",
    description: "HTTP-01 and DNS-01 issuance, a pre-issuance preflight, live stages, wildcard certificates and auto-renewal.",
    headings: [
      { id: "challenge-methods", text: "Challenge Methods" },
      { id: "preflight", text: "Preflight" },
      { id: "stages", text: "Live stages" },
      { id: "automatic-renewal", text: "Automatic Renewal" },
      { id: "renewal-state", text: "What each certificate's plan is" },
      { id: "certificate-status", text: "Certificate Status" },
      { id: "suggestion", text: "Certificate suggestion" },
      { id: "deletion", text: "Deleting a certificate" },
      { id: "file-structure", text: "Certificate File Structure" },
    ],
  },
  {
    title: "Deployments",
    href: "/docs/deployments",
    section: "Using the CLI",
    description: "Git-based deploys, ordered steps and runtimes, ez.json, health checks, persistent folders and files, rollback and GitHub Actions.",
    headings: [
      { id: "how-it-works", text: "How a deployment runs" },
      { id: "runtime", text: "Runtime and presets" },
      { id: "steps", text: "Steps" },
      { id: "ez-json", text: "ez.json" },
      { id: "persistent-data", text: "Persistent data" },
      { id: "github-actions", text: "Deploying from GitHub Actions" },
      { id: "from-the-hub", text: "Deploying from the Hub" },
      { id: "rollback", text: "Rolling back" },
    ],
  },
  {
    title: "Background Service",
    href: "/docs/service",
    section: "Operations",
    description: "The native service, its pinned Node runtime, logs and repair.",
    headings: [
      { id: "what-runs", text: "What runs in the background" },
      { id: "service-commands", text: "Service commands" },
      { id: "runtime", text: "The pinned Node runtime" },
      { id: "logs", text: "Logs" },
    ],
  },
  {
    title: "Easy DevOps Hub",
    href: "/docs/hub",
    section: "Operations",
    description: "Pair a server with the Hub from the dashboard or the CLI, control its permissions and deploy through it.",
    headings: [
      { id: "pairing", text: "Pairing a server" },
      { id: "pairing-cli", text: "Pairing from the terminal" },
      { id: "permissions", text: "Hub permissions" },
      { id: "process-control", text: "Process control from the Hub" },
      { id: "agent-status", text: "Agent status" },
      { id: "hub-deploys", text: "Deploying through the Hub" },
      { id: "deployment-changes", text: "What the Hub can do with deployments" },
    ],
  },
  {
    title: "Maintenance & Updates",
    href: "/docs/maintenance",
    section: "Operations",
    description: "Self-update, cleanup, backups, setup codes and uninstall.",
    headings: [
      { id: "updates", text: "Updating Easy DevOps" },
      { id: "cleanup", text: "Reclaiming disk space" },
      { id: "backup", text: "Backup and restore" },
      { id: "setup-code", text: "Issuing a setup code" },
      { id: "uninstall", text: "Uninstalling" },
    ],
  },
  {
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    section: "Operations",
    description: "Where the logs are for each service mode, how to read service state, clean stop versus crash, and fixes for the known install, UAC, runtime and Hub issues.",
    headings: [
      { id: "logs", text: "Logs, per mode" },
      { id: "check-the-state", text: "Check the state" },
      { id: "clean-stop-or-crash", text: "Clean stop or crash" },
      { id: "known-problems", text: "Known problems and fixes" },
      { id: "npm-ebusy", text: "npm fails with EBUSY on better_sqlite3.node" },
      { id: "winsw-xml-not-found", text: "Server-mode install fails: WinSW-x64.xml not found" },
      { id: "stray-sc-files", text: "Stray files named query, qc, stop, start or delete" },
      { id: "status-unknown", text: "Status says Running: no (unknown), or calls a restart a crash loop" },
      { id: "uac-unknown-publisher", text: "A UAC prompt says Unknown publisher" },
      { id: "slow-first-start", text: "The first start looks stuck" },
      { id: "repair-while-running", text: "Repair fails while the service is running" },
      { id: "install-stopped-halfway", text: "An install that stopped half way" },
      { id: "original-data", text: "Where the original data went" },
      { id: "backup-at-null", text: "The install prints migrated; backup at null" },
      { id: "hub-state-not-reported", text: "Hub says the agent state is not reported yet" },
      { id: "cmd-vs-powershell", text: "cmd versus PowerShell" },
      { id: "recover", text: "How to recover" },
      { id: "asking-for-help", text: "What to send when asking for help" },
    ],
  },
  {
    title: "Dashboard API",
    href: "/docs/api",
    section: "Reference",
    description: "The published API contract, the request header, the session cookie, and a curl walkthrough.",
    headings: [
      { id: "transport", text: "Transport rules" },
      { id: "authentication", text: "Authentication and the session cookie" },
      { id: "curl", text: "A working curl walkthrough" },
    ],
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    section: "Reference",
    description: "Config fields, first-run authentication, the listen address, database keys and Linux permissions setup.",
    headings: [
      { id: "config-fields", text: "Config Fields" },
      { id: "first-run", text: "First run: no default password" },
      { id: "listen-address", text: "Listen address" },
      { id: "database-keys", text: "Database Keys" },
      { id: "linux-permissions", text: "Linux permissions" },
    ],
  },
  {
    title: "Platform Support",
    href: "/docs/platform",
    section: "Reference",
    description: "Feature parity between Linux and Windows servers.",
    headings: [],
  },
  {
    title: "FAQ & Troubleshooting",
    href: "/docs/faq",
    section: "Help",
    description: "First-run setup code, password changes, SSL challenges, macOS, Linux permissions and PM2.",
    headings: [],
  },
];
