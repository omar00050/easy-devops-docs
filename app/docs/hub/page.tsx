import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import CodeBlock from "@/components/CodeBlock";
import { ArrowRight, Cloud, Monitor, Server, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Easy DevOps Hub",
  description:
    "Pair an Easy DevOps server with the Hub: the outbound agent, the ezops:// connection string, per-permission control that is enforced locally, agent statuses and deploying from CI through the Hub.",
  keywords: ["Easy DevOps Hub", "remote server management", "pair server", "hub permissions", "deploy through hub"],
  alternates: { canonical: "/docs/hub" },
  openGraph: {
    type: "article",
    url: "/docs/hub",
    siteName: "Easy DevOps",
    title: "Easy DevOps Hub",
    description:
      "Pair a server with the Hub: the outbound agent, ezops:// connection string, locally enforced permissions and CI deployments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy DevOps Hub",
    description:
      "Pair a server with the Hub: the outbound agent, ezops:// connection string, locally enforced permissions and CI deployments.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

const permissionGroups = [
  {
    group: "Nginx",
    allowed: "Start, stop, restart, reload, test the config, view and edit config files, read access and error logs.",
  },
  {
    group: "Domains",
    allowed: "Create, edit, enable or disable, and delete reverse-proxy domains.",
  },
  {
    group: "SSL certificates",
    allowed: "Issue a certificate, renew one, renew everything expiring, and delete certificate files. Wildcard issuance over DNS-01 is not available through the Hub yet.",
  },
  {
    group: "Deployments",
    allowed: "Deploy, roll back, read deployment logs, create and manage apps, read or edit environment variables, and trigger deploys from CI through the Hub.",
  },
  {
    group: "Processes & System",
    allowed: "Shown in the permission tree but not yet enabled. Starting or stopping PM2 processes and rebooting the server stay local for now.",
  },
];

const statuses = [
  { status: "connected", tone: "text-green-500", desc: "Authenticated and streaming. Commands are checked against the local permission tree before anything runs." },
  { status: "connecting", tone: "text-yellow-500", desc: "The socket is open and the handshake is in progress." },
  { status: "unreachable", tone: "text-yellow-500", desc: "A network or transport failure. The agent retries with backoff; the server itself keeps working normally." },
  { status: "rejected", tone: "text-red-500", desc: "The Hub refused the credentials — the server was deleted there, or the secret no longer matches. Retrying cannot help; pair again." },
  { status: "not linked", tone: "text-muted", desc: "No connection string has been saved. The server is fully local." },
];

export default function HubPage() {
  return (
    <DocPage
      section="Operations"
      title="Easy DevOps Hub"
      description="One place to see and manage every server you run. Pairing is an outbound connection from the server: no inbound port, no public dashboard, and every action gated by permissions you set locally."
    >
      {/* Topology */}
      <div className="my-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-xl border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <Server className="h-3.5 w-3.5 text-primary" />
            your server
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Runs the daemon and the dashboard. Holds the data, certificates and permissions.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1 text-muted sm:w-24">
          <span className="font-mono text-[9px] uppercase tracking-wider">wss</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            <Cloud className="h-3.5 w-3.5" />
            the hub
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            The control plane at ez.hub.devxor.team. Relays commands, stores no server data.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1 text-muted sm:w-20">
          <ArrowRight className="h-4 w-4 rotate-90 text-primary sm:rotate-0" />
          <span className="font-mono text-[9px] uppercase tracking-wider">https</span>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <Monitor className="h-3.5 w-3.5 text-primary" />
            you
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            A browser, from anywhere. The server never accepts an inbound connection.
          </p>
        </div>
      </div>

      <h2 id="pairing" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Pairing a server
      </h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Add the server in the Hub and copy the connection string it issues.</li>
        <li>Open the dashboard on the server: <strong className="text-foreground">Settings → Hub</strong>.</li>
        <li>Paste the string and save. The agent connects outbound and the status turns <strong className="text-green-500">connected</strong>.</li>
      </ol>
      <CodeBlock lang="text" filename="ezops:// connection string">{`ezops://ez.hub.devxor.team/<server-id>?secret=<shown-once>

# Stored in the SQLite database as hub-link:
#   { hubUrl, serverId, secret }
# The secret authenticates the agent and is never returned by
# an API, never logged, and never sent to the browser.`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li>Re-pairing replaces the existing link; the old secret stops working.</li>
        <li>An unpaired server is a fully local product. Nothing about the Hub is required.</li>
        <li>Monitoring arrives on the same connection — no extra port or agent to install.</li>
      </ul>

      <h2 id="permissions" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Hub permissions
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Every permission starts <strong className="text-foreground">off</strong>. A new pairing can
        watch your server, but it cannot change anything until you allow it. The tree lives in{" "}
        <strong className="text-foreground">Settings → Hub → Permissions</strong>.
      </p>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Group</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What can be granted</th>
          </tr>
        </thead>
        <tbody>
          {permissionGroups.map((item, index) => (
            <tr key={item.group} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">{item.group}</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">{item.allowed}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6 rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          enforced here, not there
        </div>
        <p className="text-muted leading-relaxed">
          The Hub receives a copy of your permission settings for display, but the real check runs
          in the local agent before a command touches anything. A Hub that sends a command for a
          permission that is off gets nothing done — even if its copy says otherwise.
        </p>
      </div>

      <p className="text-sm text-muted leading-relaxed mb-10">
        <strong className="text-foreground">Monitoring is never gated.</strong> Metrics, nginx
        status, the domain list, domain health and certificate expiry are always reported. A paired
        server is a monitored server; gating read-only telemetry would protect nothing and make the
        Hub useless.
      </p>

      <h2 id="agent-status" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Agent status
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The dashboard shows the agent state next to the pairing fields. Each state has one obvious
        next step:
      </p>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Status</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((item, index) => (
            <tr key={item.status} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
              <td className={`py-3 px-4 font-mono text-xs font-semibold whitespace-nowrap ${item.tone}`}>
                {item.status}
              </td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="hub-deploys" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Deploying through the Hub
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A GitHub Action can deploy to a server that has <em>no public domain and no open port</em>.
        The Action calls the Hub; the Hub forwards the request down the connection the server
        already holds open.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Enable <strong className="text-foreground">Deploy from CI through the Hub</strong> in Settings → Hub.</li>
        <li>Grant the <code className={C}>deploy.ci</code> permission to the Hub.</li>
        <li>Use the app&apos;s GitHub tab to create its deploy token — the Action authenticates with it.</li>
        <li>Point <code className={C}>EZ_DEPLOY_URL</code> at the Hub instead of the server; the workflow file does not change.</li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The server still verifies the app token itself; the Hub stores nothing. See{" "}
        <a href="/docs/deployments#github-actions">Deploying from GitHub Actions</a> for the workflow
        and the two secrets it needs.
      </p>

      <a
        href="https://ez.hub.devxor.team"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/[0.06] p-5 transition-colors hover:bg-primary/10"
      >
        <span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-primary">open</span>
          <span className="mt-1 block text-sm font-semibold text-foreground">ez.hub.devxor.team</span>
          <span className="mt-0.5 block text-xs text-muted">Create an account, add a server, copy its connection string.</span>
        </span>
        <ExternalLink className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>

      <DocsPagination
        prev={{ title: "Background Service", href: "/docs/service", section: "Operations" }}
        next={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
      />
    </DocPage>
  );
}
