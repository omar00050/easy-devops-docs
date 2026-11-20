import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import CodeBlock from "@/components/CodeBlock";
import { ArrowRight, Cloud, Monitor, Server, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Easy DevOps Hub",
  description:
    "Pair an Easy DevOps server with the Hub from the dashboard or the CLI: the outbound agent, the ezops:// connection string, per-permission control that is enforced locally, process control, agent statuses and deployments.",
  keywords: ["Easy DevOps Hub", "remote server management", "pair server", "hub pairing CLI", "hub permissions", "deploy through hub"],
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
    allowed: "Deploy, roll back, read deployment logs, create and manage apps, generate or regenerate a deploy key, test it and add it to GitHub, read or edit environment variables, link a domain with SSL, and trigger deploys from CI through the Hub.",
  },
  {
    group: "Processes",
    allowed: "Start, stop and restart one of your PM2 processes. Easy DevOps itself runs as a native background service, not a PM2 app, so it cannot be controlled this way.",
  },
  {
    group: "System",
    allowed: "Shown in the permission tree but not yet enabled: managing Node.js versions and rebooting the server stay local.",
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
        <li>Add the server in the Hub. It offers two pairing methods: a connection string, or a one-time command for the server&apos;s terminal.</li>
        <li>With the connection string: open the dashboard on the server, <strong className="text-foreground">Settings → Hub</strong>, paste it and save.</li>
        <li>With the command: run it on the server as it is shown. The string is fetched by the server itself, so nothing is pasted into a dashboard.</li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The connection string is three pipe-separated fields:{" "}
        <code className={C}>ezops://hubUrl|serverId|secret</code>. Anything else — a missing part, a
        path, a query string — is rejected before it is stored.
      </p>
      <CodeBlock lang="text" filename="ezops:// connection string">{`ezops://<hub-url>|<server-id>|<secret>

# Example shape (the values come from the Hub):
ezops://ez.hub.devxor.team|a1b2c3d4-...|<shown-once>

# Three pipe-separated parts after the scheme:
#   hubUrl    the Hub origin, e.g. ez.hub.devxor.team
#   serverId  the id the Hub assigned to this server
#   secret    the shared secret that authenticates the agent
#
# Stored in the SQLite database as hub-link:
#   { hubUrl, serverId, secret }
# The secret is never returned by an API, never logged,
# and never sent to the browser.`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>Re-pairing replaces the existing link; the old secret stops working.</li>
        <li>An unpaired server is a fully local product. Nothing about the Hub is required.</li>
        <li>Monitoring arrives on the same connection — no extra port or agent to install.</li>
      </ul>

      <h3 id="pairing-cli" className="text-base font-bold mt-8 mb-3 text-foreground">Pairing from the terminal</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The Hub&apos;s Add server page has a <strong className="text-foreground">From the CLI</strong> tab. It creates
        a command and shows it with a <strong className="text-foreground">five-minute countdown</strong> and a{" "}
        <strong className="text-foreground">Copy</strong> button:
      </p>
      <CodeBlock lang="bash" filename="on the server">{`ezz hub connect https://ez.hub.devxor.team/api/v1/connect/cli/<token>

# The agent reports back:
#   Linked to https://ez.hub.devxor.team.
#   Server: a1b2c3d4-...
#   Connected to https://ez.hub.devxor.team.`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">The link lasts five minutes and works once.</strong> The token in the path is the credential; the Hub deletes it on the first successful fetch. An expired, used, replaced or revoked link says which it is, and a new one is created in the Hub.</li>
        <li><strong className="text-foreground">Creating it rotates the server&apos;s secret</strong> and disconnects the agent that was connected. If the server was already linked, the Hub asks before doing that — the old agent goes offline and stays offline until it re-pairs.</li>
        <li><strong className="text-foreground">The command is the only copy of the link.</strong> It is shown in the Hub, copied from there, and fetched by the server over https. The connection string is never in the Hub&apos;s response, its logs or the page.</li>
        <li><strong className="text-foreground">The tab shows the real outcome.</strong> It waits for the server to report <strong className="text-green-500">connected</strong> rather than assuming the command worked; if the agent is offline it keeps waiting and says so.</li>
        <li><strong className="text-foreground">From the terminal afterwards:</strong> <code className={C}>ezz hub status</code> prints the Hub origin, the server id, the granted permissions and the agent state, and <code className={C}>ezz hub unlink --yes</code> removes the local link. The Hub keeps the server listed as offline until it is deleted there.</li>
      </ul>

      <h2 id="server-page" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Inside a server
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A paired server opens on the same sections as its own dashboard, in the same order and with the
        same names and icons: <strong className="text-foreground">Overview</strong>, <strong className="text-foreground">Domains</strong>, <strong className="text-foreground">SSL certificates</strong>, <strong className="text-foreground">Nginx</strong>, <strong className="text-foreground">Deployments</strong>, <strong className="text-foreground">Notifications</strong>, <strong className="text-foreground">Processes</strong>, <strong className="text-foreground">Logs</strong> and <strong className="text-foreground">Settings</strong>.
        The server list and switcher, the identity row with one overflow menu (rename, regenerate
        secret, remove), account and management sit around that view; the permission tree is read-only
        under Settings.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        A screen the Hub has no command for is read-only and says <strong className="text-foreground">Managed on the server</strong>, rather than offering a control that cannot work. Settings follows the same rule: it shows what the server reported, and changes are made on the server&apos;s own dashboard.
      </p>

      <h2 id="certificates" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Issuing and deleting certificates from the Hub
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Since 1.4.2 the Hub&apos;s <strong className="text-foreground">SSL certificates</strong> section works like the
        server&apos;s own: <strong className="text-foreground">Renew</strong>, <strong className="text-foreground">Renew all</strong>,{" "}
        <strong className="text-foreground">New certificate</strong> and <strong className="text-foreground">Delete</strong>.
        Each button needs its permission on the server (<code className={C}>ssl.renew</code>, <code className={C}>ssl.renewAll</code>,{" "}
        <code className={C}>ssl.issue</code>, <code className={C}>ssl.delete</code>); without it the button stays visible,
        disabled, and says which permission is off.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li><strong className="text-foreground">New certificate uses HTTP-01 only.</strong> The server first runs its
          preflight (DNS records, IPv6, a public HTTP check) and the Hub shows each check. Then the nine stages arrive live:
          preflight, account and order, challenge ready, waiting for validation, certificate received, files written,
          nginx config test, nginx reload, https verified. nginx keeps running.</li>
        <li><strong className="text-foreground">A failure names the stage.</strong> The failed stage is marked, with the
          real cause, a one-line fix and what was left behind (for example, that no certificate was requested, so
          Let&apos;s Encrypt rate limits are untouched).</li>
        <li><strong className="text-foreground">Wildcards and DNS-01 stay on the server.</strong> They need a TXT record
          you add by hand while the request waits, so the Hub shows the choice disabled with that reason. Issue them from
          the server&apos;s dashboard or the CLI.</li>
        <li><strong className="text-foreground">Delete is refused while the certificate is in use.</strong> If an enabled
          domain with SSL, or any nginx config, still points at it, nothing is deleted and the Hub lists the domains (and the
          config file and line). Turn SSL off on those domains, or disable them, then delete.</li>
        <li><strong className="text-foreground">The domain form creates certificates too.</strong> Saving a domain with
          SSL on and no certificate on disk is refused by the server with the paths it expected; the form then offers{" "}
          <strong className="text-foreground">Create certificate</strong>, fills the paths from the result and saves again —
          the same sequence as the server&apos;s dashboard. Blank paths mean the server&apos;s own certificate folder.</li>
        <li><strong className="text-foreground">Running one of these once without the permission</strong> (with a PIN
          entered on the server) is planned for 1.5.0.</li>
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
        status, the domain list, domain health, certificate expiry and the deployed-app list are always
        reported. A paired server is a monitored server; gating read-only telemetry would protect
        nothing and make the Hub useless.
      </p>

      <h2 id="process-control" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Process control from the Hub
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Starting, stopping and restarting your PM2 processes from the Hub is available, under three
        switches that are off by default: <code className={C}>process.start</code>,{" "}
        <code className={C}>process.stop</code> and <code className={C}>process.restart</code>.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li>The agent re-checks the permission map on this server before acting; the Hub&apos;s copy is a UI hint only.</li>
        <li>Only a process PM2 actually knows is acted on, so a typo cannot be reported as success.</li>
        <li>A process owned by a different OS user is refused with that user&apos;s name — PM2 keeps one process list per user.</li>
        <li>Easy DevOps&apos; own background service is not a PM2 app and is never in that list.</li>
      </ul>

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
        The server still verifies the app token itself; the Hub stores nothing. If the server is
        offline, does not answer, or refuses, the Action gets the same non-5xx answers as a command:
        <code className={C}>409 AGENT_OFFLINE</code>, <code className={C}>424 AGENT_TIMEOUT</code> or
        <code className={C}>422 AGENT_ERROR</code>, with <code className={C}>error</code> and
        <code className={C}>code</code> in the body. See{" "}
        <a href="/docs/deployments#github-actions">Deploying from GitHub Actions</a> for the workflow
        and the two secrets it needs.
      </p>

      <h2 id="deployment-changes" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What the Hub can do with deployments
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The server&apos;s Hub page has the same deployment actions as the local Deployments page, each
        behind its own switch:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Permission</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it allows</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 font-mono text-xs text-primary">deploy.run</td><td className="py-3 px-4 text-muted text-xs">Start a deployment of an existing app from its configured repository.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 font-mono text-xs text-primary">deploy.rollback</td><td className="py-3 px-4 text-muted text-xs">Switch an app back to an earlier release still on this server.</td></tr>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 font-mono text-xs text-primary">deploy.logs</td><td className="py-3 px-4 text-muted text-xs">Read a deployment&apos;s output.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 font-mono text-xs text-primary">deploy.manage</td><td className="py-3 px-4 text-muted text-xs">Create, edit and delete apps; issue a deploy token; generate, regenerate and test a deploy key and add it to GitHub read-only; link or unlink a domain; move an app; delete an old release.</td></tr>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 font-mono text-xs text-primary">deploy.env</td><td className="py-3 px-4 text-muted text-xs">Read and edit environment variables. Values pass through the Hub while being edited and are not stored there.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 font-mono text-xs text-primary">deploy.ci</td><td className="py-3 px-4 text-muted text-xs">Let a GitHub Action trigger a deployment by calling the Hub with the app&apos;s own token.</td></tr>
        </tbody>
      </table>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>Linking an app to a domain from the Hub needs <code className={C}>deploy.manage</code> <em>and</em> <code className={C}>domains.create</code>. Removing the domain needs <code className={C}>domains.delete</code> as well. Managing apps does not imply managing domains.</li>
        <li>The link can use <strong className="text-foreground">no certificate</strong>, a <strong className="text-foreground">new one over HTTP-01</strong>, or an <strong className="text-foreground">existing one from the server&apos;s suggestion</strong>, wildcards included. A new certificate also needs <code className={C}>ssl.issue</code>, and a new wildcard is refused because DNS-01 is out of scope here.</li>
        <li>A deploy key can be generated or regenerated, tested and added to GitHub from the Hub; only its public half and fingerprint come back. A token typed for &quot;Add it to GitHub for me&quot; passes through once and is not stored.</li>
        <li>The app list is monitoring and always visible; it carries environment-variable <em>names</em>, never values.</li>
      </ul>

      <h3 id="live-progress" className="text-base font-bold mt-8 mb-3 text-foreground">Live progress</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Any deployment streams into its run view while it runs — the current step, and new log lines
        when <code className={C}>deploy.logs</code> is granted — wherever it was started: the Hub, the
        server&apos;s own dashboard, <code className={C}>ezz daemon</code> or a CI hook. At most one event per second; one event
        carries at most 200 lines and 32 KiB, each line capped at 2000 characters, and the newest are
        kept if more arrived.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        Every line is redacted with the app&apos;s environment values and token, and PEM private-key
        blocks are removed on the server before they are sent. The Hub stores nothing: once the
        deployment ends, the stored run is the source of truth.
      </p>

      <h2 id="commands" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Commands, and how they answer
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The Hub sends commands down the connection the server already holds open. An action that
        finishes in seconds is answered in the same request; a long one is accepted and keeps running
        on the server. Both are covered by the permissions above.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li><strong className="text-foreground">Quick actions</strong> — reading or saving an nginx
          config, logs, the deployment list or one app&apos;s detail, a certificate suggestion, a PM2
          start/stop/restart — are answered within <strong className="text-foreground">15 seconds</strong>.
          The page shows the server&apos;s actual result, not an assumption.</li>
        <li><strong className="text-foreground">Long actions</strong> — a deployment, a rollback,
          certificate issue or renewal, nginx start/stop/restart — are accepted immediately and keep
          running. Their progress arrives as live events. If you reload the page, the Hub still has the
          answer for <strong className="text-foreground">10 minutes</strong>, so the page can collect it
          without running the command again.</li>
        <li><strong className="text-foreground">A failure says which kind.</strong> An offline server
          is <code className={C}>409 AGENT_OFFLINE</code> and nothing was sent; no answer within 15
          seconds is <code className={C}>424 AGENT_TIMEOUT</code> and names the command; the
          server&apos;s own refusal is <code className={C}>422 AGENT_ERROR</code>. The body keeps
          <code className={C}>error</code> and adds <code className={C}>code</code>, and a refusal with details
          (the domains that still use a certificate, missing certificate paths) carries them as{" "}
          <code className={C}>data</code>. These are
          deliberately not 5xx: the Hub sits behind Cloudflare, which may replace an origin 5xx page
          and hide the reason. None of them leave a spinner up.</li>
        <li><strong className="text-foreground">A result belongs to you.</strong> It is readable only by
          the account that owns the server, and expires when its ten minutes are up.</li>
        <li><strong className="text-foreground">The deployment panel follows the server.</strong> The app
          list is pushed when a run starts or ends; <strong className="text-foreground">Refresh</strong>
          re-reads the details and the run log, and returning to a background tab does one fresh read.
          Nothing polls a command every few seconds.</li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The server still checks every command against its own permission tree before running it, and it
        writes one timing line per command to its log — name, duration and outcome, never the payload.
      </p>

      <h2 id="signing-in" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Signing in to the Hub
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Failed sign-in attempts are limited per client address — the address the Hub sees through its
        proxy, not one the browser can choose. Only <em>failed</em> attempts count, so several people
        behind one office address do not lock each other out by signing in normally.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        When the limit is reached the Hub answers <code className={C}>429</code> with a wait, and the
        page says <strong className="text-foreground">&quot;Try again in …&quot;</strong> and disables
        the button until the countdown ends. That message is deliberately different from a wrong email
        or password, so a correct password is never reported as incorrect.
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
