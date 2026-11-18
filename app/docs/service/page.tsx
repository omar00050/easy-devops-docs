import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Background Service",
  description:
    "The Easy DevOps native service: what the daemon does, how to install, inspect and repair it on Linux and Windows, the pinned Node runtime, and where its logs live.",
  keywords: ["Easy DevOps service", "systemd easy-devops", "Windows service DevOps", "background daemon", "pinned Node runtime"],
  alternates: { canonical: "/docs/service" },
  openGraph: {
    type: "article",
    url: "/docs/service",
    siteName: "Easy DevOps",
    title: "Background Service",
    description:
      "What the native service does, how to install, inspect and repair it, the pinned Node runtime, and where logs live.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Service",
    description:
      "What the native service does, how to install, inspect and repair it, the pinned Node runtime, and where logs live.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

const actions = [
  { action: "install", desc: "Write the service definition and enable it at boot (Linux / Windows Server) or at logon (Windows Personal). Prompts for the mode when Windows can go either way." },
  { action: "status", desc: "Show whether the service runs and whether it starts by itself. The dashboard shows the same state on the Processes page." },
  { action: "start", desc: "Start it now." },
  { action: "stop", desc: "Stop it until the next boot or logon. Use this before maintenance." },
  { action: "restart", desc: "Stop and start in one step." },
  { action: "logs", desc: "Print recent output and error lines from the service log." },
  { action: "repair", desc: "Reinstall the service definition without touching data or certificates — for when an interrupted update left it broken." },
  { action: "uninstall", desc: "Remove the service definition. The data directory and every certificate stay where they are." },
];

export default function ServicePage() {
  return (
    <DocPage
      section="Operations"
      title="Background Service"
      description="The CLI is the control surface. A small native service is what keeps watching, notifying and staying connected while no terminal is open."
    >

      <h2 id="what-runs" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What runs in the background
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The service starts <code className={C}>ezz daemon</code> — one long-running process that
        owns the work that cannot wait for someone to open a terminal:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">Monitors</strong> — domain health checks at a steady interval and certificate expiry tracking.</li>
        <li><strong className="text-foreground">Notifications</strong> — dispatch to your Discord and Telegram channels, including recovery messages when something comes back.</li>
        <li><strong className="text-foreground">Revision watcher</strong> — notices deployments and keeps their status current.</li>
        <li><strong className="text-foreground">Hub agent</strong> — the outbound connection to a paired Easy DevOps Hub, when one is configured.</li>
        <li><strong className="text-foreground">IPC channel</strong> — feeds live events to an open dashboard without either side opening a public port.</li>
        <li><strong className="text-foreground">Deploy hook</strong> — off until switched on; when enabled it listens for CI, even with the dashboard closed.</li>
      </ul>

      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">note</div>
        <p className="text-muted leading-relaxed">
          The daemon serves <strong className="text-foreground">no HTTP port</strong>. The dashboard
          is started on demand with <code className={C}>ezz --dash</code> or{" "}
          <code className={C}>Open Dashboard</code>; the two processes talk over local IPC. This is
          why the service can run on a server with no exposed dashboard at all.
        </p>
      </div>

      <h2 id="service-commands" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Service commands
      </h2>
      <CodeBlock lang="bash" filename="terminal">{`# install once, from an elevated shell where the platform needs it
ezz service install

# everyday inspection
ezz service status
ezz service logs

# lifecycle
ezz service stop
ezz service start
ezz service restart`}</CodeBlock>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it does</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((item, index) => (
            <tr key={item.action} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
              <td className="py-2.5 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">service {item.action}</td>
              <td className="py-2.5 px-4 text-xs text-muted leading-relaxed">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 id="platforms" className="text-base font-bold mt-8 mb-3 text-foreground">How each platform runs it</h3>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Platform</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Mechanism</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Starts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium">Linux</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">systemd unit <code className={C}>easy-devops.service</code></td>
            <td className="py-3 px-4 text-muted text-xs">at boot</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-foreground font-medium">Windows Server</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">WinSW service <code className={C}>EasyDevOps</code>, running as <code className={C}>NT SERVICE\EasyDevOps</code></td>
            <td className="py-3 px-4 text-muted text-xs">at boot</td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium">Windows Personal</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Startup-folder supervisor — no admin rights, no Windows service</td>
            <td className="py-3 px-4 text-muted text-xs">at logon</td>
          </tr>
        </tbody>
      </table>

      <h2 id="runtime" className="text-xl font-bold mt-10 mb-4 text-foreground">
        The pinned Node runtime
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A service records an absolute path to one Node binary. If that path lives inside nvm and you
        later switch versions, the service would be pointing at a runtime that no longer exists.
        Easy DevOps pins a runtime per installation instead — a managed link at{" "}
        <code className={C}>&lt;data directory&gt;/runtime/node</code> on Linux, and a copied{" "}
        <code className={C}>node.exe</code> for a Windows Server service.
      </p>
      <CodeBlock lang="bash" filename="terminal">{`ezz runtime status   # the pinned version and available LTS releases
ezz runtime update   # move the service to a newer Node, with rollback`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li><code className={C}>runtime update</code> keeps the previous runtime long enough to roll back if the service fails to start on the new one.</li>
        <li>Updating Node with nvm does not move the service; the pin is deliberate. Use <code className={C}>runtime update</code>.</li>
        <li>Native modules are rebuilt for the pinned ABI — pairing a different Node with an existing <code className={C}>.node</code> file is what breaks services after a version switch.</li>
      </ul>

      <h2 id="logs" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Logs and diagnostics
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>ezz service logs</code> prints the most recent output and error lines.
        On Linux, <code className={C}>journalctl -u easy-devops</code> carries the same stream. For a
        live look while debugging, run the worker in your terminal instead:
      </p>
      <CodeBlock lang="bash" filename="terminal">{`ezz daemon
# foreground, no web port. Ctrl+C to stop.
# Refuses to start a second copy — the single-instance lock is held
# by the installed service while it runs.`}</CodeBlock>

      <div className="rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">repair</div>
        <p className="text-muted leading-relaxed">
          If an update is interrupted, the CLI stays usable even when the service definition is
          broken. <code className={C}>ezz service repair</code> rewrites the unit or service entry,
          re-pins the runtime and leaves your data untouched.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Deployments", href: "/docs/deployments", section: "Using the CLI" }}
        next={{ title: "Easy DevOps Hub", href: "/docs/hub", section: "Operations" }}
      />
    </DocPage>
  );
}
