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
          The daemon serves <strong className="text-foreground">no HTTP port</strong> of its own; the
          one exception is the deploy hook, which is off until you switch it on and binds to loopback
          by default. The dashboard is started on demand with <code className={C}>ezz --dash</code> or{" "}
          <code className={C}>Open Dashboard</code>; the two processes talk over local IPC. This is
          why the service can run on a server with no exposed dashboard at all.
        </p>
      </div>

      <h2 id="service-commands" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Service commands
      </h2>
      <CodeBlock lang="bash" filename="terminal">{`# Linux: sudo asks for your password in this terminal;
# nothing in Easy DevOps stores or sees it.
# Windows Personal: no elevation at all.
# Windows Server: one UAC consent for the service step.
ezz service install

# everyday inspection
ezz service status
ezz service logs

# lifecycle
ezz service stop
ezz service start
ezz service restart`}</CodeBlock>

      <p className="text-xs text-muted leading-relaxed mb-6">
        Administrator rights are needed for one thing only: <strong className="text-foreground">Windows
        Server mode</strong>, which registers a real Windows service and writes under{" "}
        <code className={C}>C:\ProgramData</code>. Windows Personal mode (a Startup-folder launcher)
        and everyday CLI use need none. On Linux, systemd unit installation uses{" "}
        <code className={C}>sudo</code> interactively, on your terminal — never through the dashboard.
        Which commands need it and which do not is set out in{" "}
        <a href="#administrator-rights" className="text-primary hover:underline">
          Administrator rights in Server mode
        </a>{" "}
        below.
      </p>

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

      <h2 id="administrator-rights" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Administrator rights in Server mode
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Since 1.4.3 the commands that replace the service&apos;s files check for an administrator
        before they touch anything; the rest run from a normal PowerShell as your own account. Which
        is which:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Command</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Needs an administrator</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">service install<br />service repair</td>
            <td className="py-3 px-4 text-muted text-xs">yes</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Registers the service and writes the wrapper and runtime under <code className={C}>C:\ProgramData\easy-devops</code>.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">service uninstall<br />uninstall --purge</td>
            <td className="py-3 px-4 text-muted text-xs">yes</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Removes the service entry, moves the data back and on purge deletes the folder.</td>
          </tr>
          <tr>
            <td className="py-3 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">update<br />runtime update</td>
            <td className="py-3 px-4 text-muted text-xs">yes</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Replaces the wrapper and the pinned <code className={C}>node.exe</code>, including the native modules built for it.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">service start<br />service stop<br />service restart</td>
            <td className="py-3 px-4 text-muted text-xs">no</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The installing account is granted start, stop and query on the EasyDevOps service — and nothing else.</td>
          </tr>
          <tr>
            <td className="py-3 px-4 font-mono text-xs font-semibold text-primary whitespace-nowrap">service status<br />the rest of the CLI</td>
            <td className="py-3 px-4 text-muted text-xs">no</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The installing account gets Modify on <code className={C}>C:\ProgramData\easy-devops</code>, so the database is writable from a normal PowerShell.</td>
          </tr>
        </tbody>
      </table>

      <p className="text-sm text-muted leading-relaxed mb-4">
        Run an elevated command from a normal PowerShell and it asks first:{" "}
        <code className={C}>This needs administrator rights. Relaunch as administrator? (Y/n)</code>.
        Yes opens a new elevated PowerShell window through a single UAC prompt — no password — which
        runs the same command, shows its own output and stays open at the end; the original window
        says it handed off and changes nothing. No prints the exact command and changes nothing. In a
        script or CI there is no terminal to ask, so nothing is relaunched: the command is printed and
        the exit code is 3.
      </p>
      <CodeBlock lang="powershell" filename="PowerShell">{`ezz service install
This needs administrator rights. Relaunch as administrator? (Y/n)

# Y   -> one UAC prompt, then the same command in an elevated window
# N   -> the command is printed, nothing changes
# no terminal (script, CI) -> the command is printed, exit code 3`}</CodeBlock>

      <p className="text-sm text-muted leading-relaxed mb-4">
        Both rights go to the account that ran install or repair, matched by SID rather than by name:
        start, stop and query on the service, and Modify on the data directory. Nothing else is
        granted — that account still cannot change the service&apos;s configuration or delete it, and
        the rights are never given to <code className={C}>Users</code> or{" "}
        <code className={C}>Everyone</code>. <code className={C}>ezz service status</code> shows the
        start and stop right on its <code className={C}>Without admin</code> line. An install made
        before 1.4.3 gets both by running <code className={C}>ezz service repair</code> once as
        administrator.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The runtime directory (<code className={C}>C:\ProgramData\easy-devops\runtime</code>) and the
        wrapper (<code className={C}>...\bin</code>) stay administrator-only on purpose: replacing{" "}
        <code className={C}>node.exe</code> there would run code as the service account. They no
        longer inherit the data directory&apos;s permissions, so the access above does not reach them.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        On <code className={C}>ezz service uninstall</code> the start and stop right goes with the
        service, and the data-directory access is removed when the data is moved back. If you keep the
        data in <code className={C}>C:\ProgramData</code> your account keeps access, so the CLI still
        works; <code className={C}>--purge</code> removes the folder.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        Dashboard <strong className="text-foreground">Settings &gt; Update</strong> in Server mode does
        not start an update from a non-elevated dashboard. It shows that updating needs{" "}
        <code className={C}>ezz update</code> from an Administrator PowerShell, with a copy button.
      </p>

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

      <div className="mt-3 rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">troubleshooting</div>
        <p className="text-muted leading-relaxed">
          A stop that was not clean, a crash loop, or an install that failed at the service step —
          see <a href="/docs/troubleshooting" className="text-primary hover:underline">Troubleshooting</a> for
          the log to read in each mode and the known fixes.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Deployments", href: "/docs/deployments", section: "Using the CLI" }}
        next={{ title: "Easy DevOps Hub", href: "/docs/hub", section: "Operations" }}
      />
    </DocPage>
  );
}
