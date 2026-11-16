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
    headings: [],
  },
  {
    title: "CLI Interface",
    href: "/docs/cli",
    section: "Using the CLI",
    description: "The interactive menu, its keyboard model and every global flag.",
    headings: [
      { id: "interactive-menu", text: "The interactive menu" },
      { id: "menu-map", text: "Menu map" },
      { id: "flags", text: "Global flags" },
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
    description: "HTTP-01 and DNS-01 issuance, wildcard certificates and auto-renewal.",
    headings: [
      { id: "challenge-methods", text: "Challenge Methods" },
      { id: "automatic-renewal", text: "Automatic Renewal" },
      { id: "certificate-status", text: "Certificate Status" },
      { id: "file-structure", text: "Certificate File Structure" },
    ],
  },
  {
    title: "Deployments",
    href: "/docs/deployments",
    section: "Using the CLI",
    description: "Git-based deploys, ez.json, health checks, rollback and GitHub Actions.",
    headings: [
      { id: "how-it-works", text: "How a deployment runs" },
      { id: "ez-json", text: "ez.json" },
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
    description: "Pair a server with the Hub, control its permissions and deploy through it.",
    headings: [
      { id: "pairing", text: "Pairing a server" },
      { id: "permissions", text: "Hub permissions" },
      { id: "agent-status", text: "Agent status" },
      { id: "hub-deploys", text: "Deploying through the Hub" },
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
    title: "Dashboard API",
    href: "/docs/api",
    section: "Reference",
    description: "REST endpoints for nginx, domains, SSL, deployments and settings.",
    headings: [
      { id: "nginx", text: "Nginx" },
      { id: "domains", text: "Domains" },
      { id: "ssl", text: "SSL" },
      { id: "deployments", text: "Deployments" },
      { id: "settings", text: "Settings" },
      { id: "channels", text: "Notification Channels" },
    ],
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    section: "Reference",
    description: "Config fields, database keys and Linux permissions setup.",
    headings: [
      { id: "config-fields", text: "Config Fields" },
      { id: "database-keys", text: "Database Keys" },
      { id: "linux-permissions", text: "Linux Permissions" },
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
    description: "Command not found, password changes, SSL port conflicts and more.",
    headings: [],
  },
];
