import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "PM2 on Windows Server",
  description:
    "Easy DevOps on a Windows Server in Server mode runs as a real Windows service under NT SERVICE\\EasyDevOps, while PM2 belongs to the user who installed it. What the service can see, what the Hub shows and refuses, what still manages your apps, and what happens to them after a reboot.",
  keywords: [
    "PM2 Windows Server",
    "PM2 service account",
    "NT SERVICE\\EasyDevOps PM2",
    "PM2_HOME",
    "pm2 resurrect",
    "pm2 save",
    "Hub PM2 not installed",
    "Easy DevOps PM2",
  ],
  alternates: { canonical: "/docs/pm2-windows-server" },
  openGraph: {
    type: "article",
    url: "/docs/pm2-windows-server",
    siteName: "Easy DevOps",
    title: "PM2 on Windows Server",
    description:
      "The operator's own PM2, why the Windows service cannot see it, what the Hub refuses, and the honest reboot behaviour.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM2 on Windows Server",
    description:
      "The operator's own PM2, why the Windows service cannot see it, what the Hub refuses, and the honest reboot behaviour.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

export default function Pm2WindowsServerPage() {
  return (
    <DocPage
      section="Operations"
      title="PM2 on Windows Server"
      description="One standard PM2, installed by you, in your own profile. In Server mode the background service runs as a different Windows account and cannot use it — and Easy DevOps says so instead of creating a second one."
    >

      <h2 id="how-it-works" className="text-xl font-bold mt-10 mb-4 text-foreground">
        The PM2 Easy DevOps uses
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        There is exactly one PM2 model, and it is yours: the standard PM2 anyone installs with{" "}
        <code className={C}>npm i -g pm2</code>, with the default <code className={C}>PM2_HOME</code>{" "}
        of that account — for example <code className={C}>C:\Users\admin\.pm2</code>. Easy DevOps
        does <strong className="text-foreground">not</strong> create its own PM2, does not set a{" "}
        <code className={C}>PM2_HOME</code> of its own, does not install a second copy, does not start
        a second PM2 daemon, and never moves, restarts or touches an app you already have.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Which process talks to that PM2 depends on how Easy DevOps runs on the machine:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Where Easy DevOps runs</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Account</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Its PM2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium">Linux service</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">the installing user — <code className={C}>root</code> on a root install</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">the same account, so the daemon, the CLI, deploys and PM2 are one identity. Unchanged in 1.4.9.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-foreground font-medium">Windows Personal</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">you, at logon (a Startup-folder supervisor)</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">yours, because it is the same account.</td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium">Windows Server</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">the service, as <code className={C}>NT SERVICE\EasyDevOps</code></td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">cannot use yours. The dashboard and the CLI, run by you, still do.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-muted leading-relaxed mb-10">
        PM2 is optional. Easy DevOps itself is a native service, not a PM2 app, and it runs without
        PM2 at all; PM2 is what runs the apps you deploy or start yourself, from the Processes and
        Deployments pages or from your own terminal.
      </p>

      <h2 id="service-account" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Why the service cannot see that PM2
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        In Windows Server mode the background service is a real Windows service running as the
        virtual account <code className={C}>NT SERVICE\EasyDevOps</code>, with no password and no
        profile of yours. Three facts each make your PM2 invisible to it:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>
          <strong className="text-foreground">The npm global prefix is per user.</strong>{" "}
          <code className={C}>npm i -g pm2</code> as <code className={C}>admin</code> writes{" "}
          <code className={C}>pm2.cmd</code> into <code className={C}>C:\Users\admin\AppData\Roaming\npm</code>,
          which is on that user&apos;s <code className={C}>PATH</code> only. The service account&apos;s{" "}
          <code className={C}>where.exe pm2</code> finds nothing.
        </li>
        <li>
          <strong className="text-foreground">PM2_HOME is per user.</strong> Without an explicit{" "}
          <code className={C}>PM2_HOME</code>, PM2 uses the profile of whoever runs it. The service
          account&apos;s profile is not <code className={C}>C:\Users\admin\.pm2</code>, so its pid
          file, dump and logs are not yours either.
        </li>
        <li>
          <strong className="text-foreground">Running pm2 as the service would start a second
          daemon.</strong> Every PM2 command starts a PM2 daemon when none answers it. On Windows,
          PM2&apos;s RPC pipe names are fixed machine-wide rather than per <code className={C}>PM2_HOME</code>,
          so a command issued as the service is not a safe read-only probe: it can leave a daemon
          owned by the service account that you cannot see or stop.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-4">
        So the service does the one safe thing: it never spawns <code className={C}>pm2</code> or{" "}
        <code className={C}>npm</code>, reports what it knows, and stops. Nothing is created, nothing
        is converted, no migration runs and no app is touched.
      </p>
      <div className="mb-10 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">note</div>
        <p className="text-muted leading-relaxed">
          This is why the Hub shows <code className={C}>PM2 runs under the user admin; the Easy DevOps
          service (NT SERVICE\EasyDevOps) cannot see it.</code> It is a statement about accounts, not
          about a missing installation.
        </p>
      </div>

      <h2 id="hub" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What the Hub shows and refuses
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Since 1.4.9 the agent reports the service from inside the service — installed, Windows
        service mode, starting at boot, the account it runs as, the version and the data directory —
        and sends an explicit PM2 record on <strong className="text-foreground">every</strong> push,
        in both <code className={C}>service:state</code> and <code className={C}>processes:list</code>.
        A missing field means <em>unknown</em>, never <code className={C}>false</code>, so an older Hub
        keeps working with a 1.4.9 agent and the other way round.
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">PM2 state</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it means</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What to do</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap align-top">available / empty</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The PM2 daemon answered, with apps or with none. This is what the operator&apos;s dashboard and CLI see.</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Nothing.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap align-top">not_running</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">PM2 is installed but its daemon is not up. The read never starts one.</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Start an app with PM2, or run <code className={C}>pm2 resurrect</code>.</td>
          </tr>
          <tr>
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap align-top">not_installed</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">There is no PM2 this process can use.</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Run <code className={C}>npm i -g pm2</code> on the server.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap align-top">unavailable</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The service account may not use PM2 (<code className={C}>service_account</code>), or PM2 did not answer (<code className={C}>list_failed</code>). The record carries <code className={C}>message</code>, <code className={C}>fix</code> and, when known, <code className={C}>user</code>.</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Follow the fix text; on Windows Server that means managing the apps on the server as the user who runs PM2.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-muted leading-relaxed mb-4">
        With the operator recorded, the Hub shows the exact sentence and next step. Without it the
        texts are still honest and name the gap:
      </p>
      <CodeBlock lang="text" filename="Hub - PM2 unavailable">{`PM2 runs under the user admin; the Easy DevOps service (NT SERVICE\\EasyDevOps) cannot see it.
Manage these apps on the server as admin (the Easy DevOps dashboard there, or pm2 list).
Hub process actions and Hub deploys need that PM2, so this server refuses them.

# or, when install/repair could not record the account:
PM2 runs under the account that started it; the Easy DevOps service (NT SERVICE\\EasyDevOps) cannot see it.
Run ezz service repair in an Administrator PowerShell, signed in as the user who runs PM2,
so the Hub can name that user. Manage the apps on the server meanwhile.`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-4">
        In Windows Server mode the agent therefore refuses to act, and refuses{" "}
        <strong className="text-foreground">before anything is spawned, listed or changed</strong>:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li><strong className="text-foreground">Hub process actions</strong> (start, stop, restart) are refused with the reason above; no <code className={C}>pm2</code> runs.</li>
        <li><strong className="text-foreground">Hub deploys</strong> are refused the same way, before the deploy lock is taken, before a run record or release folder is written and before any step runs — a refused deploy leaves nothing half-built behind.</li>
        <li>The Processes area shows the reason and the next step instead of <code className={C}>PM2 is not installed</code> or an endless <code className={C}>Waiting for the process list…</code>.</li>
      </ul>

      <h2 id="dashboard-cli" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What still manages your apps
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Everything you run on the server as the user who owns PM2 keeps working exactly as before.
        That is the answer to a Hub that refuses: use one of these.
      </p>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Entry point</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it does with your PM2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">Local dashboard</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The Processes page lists your apps and starts, stops and restarts them; the Deployments page deploys, rolls back and reports health under your PM2. Opened from the server as <code className={C}>admin</code>, it sees exactly what <code className={C}>pm2 list</code> sees.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">CLI</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The same PM2 as the dashboard, because it is the same account. Deployments are started from the dashboard, the Hub or CI; the CLI has no deploy-app creation path.</td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">Your terminal</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed"><code className={C}>pm2 list</code>, <code className={C}>pm2 logs</code> and the rest, as that user, are the ground truth.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The account matters more than the tool: Easy DevOps reads the PM2 of the account it runs
        as, and PM2 keeps its daemon, pid file and dump per user. A dashboard started as a different
        Windows user therefore does not report yours — run it as the user who installed PM2. The
        Processes page names that account in its PM2 heading for exactly this reason.
      </p>

      <h2 id="reboot" className="text-xl font-bold mt-10 mb-4 text-foreground">
        After a reboot
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        This part is deliberately blunt, because nothing Easy DevOps does changes it:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li><strong className="text-foreground">PM2 has no startup mechanism on Windows.</strong> <code className={C}>pm2 startup</code> understands Linux init systems only; there is no Windows equivalent.</li>
        <li><strong className="text-foreground">Easy DevOps installs no boot hook for PM2 apps.</strong> The Windows service starts the Easy DevOps daemon, not your PM2 apps, and no installer or repair step writes a PM2 startup task.</li>
        <li><strong className="text-foreground">So apps started under a user&apos;s PM2 do not come back after a reboot</strong> until that user signs in and runs <code className={C}>pm2 resurrect</code>, using the dump written earlier by <code className={C}>pm2 save</code>.</li>
      </ul>
      <CodeBlock lang="powershell" filename="PowerShell - after signing in">{`# save the current app list while it is the one you want
pm2 save

# after a reboot: sign in as the same user, then
pm2 resurrect
pm2 list`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-4">
        There is no setting that makes this survive a reboot with nobody signed in while keeping the
        one-PM2 model; a launcher that runs at logon or a scheduled task would still wait for a
        sign-in. If apps must be up with no session, run them as a Windows service of their own, not
        under a user&apos;s PM2.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        Linux is different for one reason: the account. On a root install the systemd unit and PM2
        both run as <code className={C}>root</code>, so PM2&apos;s own <code className={C}>pm2 startup</code>{" "}
        plus <code className={C}>pm2 save</code> restores the apps at boot with no login. Easy DevOps
        does not install that hook either — it is PM2&apos;s command, run once by you.
      </p>

      <h2 id="operator" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Telling the Hub which user runs PM2
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>ezz service install</code> records the account that ran it — name, home
        and the PM2 path it found — beside the SID the Windows permissions already use. The record is
        written by the CLI process, never by the daemon, because only the CLI can see your profile. A
        value it cannot read never replaces a recorded one.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        An install made before 1.4.9 has the SID but not that profile, so the Hub can only say{" "}
        <code className={C}>the account that started it</code>. Give it the name in one step:
      </p>
      <CodeBlock lang="powershell" filename="Administrator PowerShell">{`# signed in as the user who runs PM2
ezz service repair`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-10">
        Repair re-registers the service definition and re-pins the runtime exactly as before, refreshes
        the operator record and leaves data and certificates untouched. Afterwards the Hub&apos;s
        message names the user and the fix. Installing as an administrator who does not run PM2 records
        that administrator; run repair as the PM2 user to correct it.
      </p>

      <h2 id="install" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Installing PM2
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        PM2 is installed with the standard command, as you, into your own npm prefix and default{" "}
        <code className={C}>PM2_HOME</code>. Three places offer it, and none of them ever installs it
        silently:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Where</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">How</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap align-top">The installer</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Asked after Easy DevOps is installed and before the background-service offer, only when PM2 is missing and only with a terminal. The default answer is <strong className="text-foreground">No</strong>; with no terminal it prints the command and installs nothing. A failed PM2 install never fails the Easy DevOps install.</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap align-top">The dashboard</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">An <strong className="text-foreground">Install PM2</strong> button on the Deployments page, shown with the warning when PM2 is missing. It runs the same <code className={C}>npm i -g pm2</code> (no body, behind the dashboard session).</td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap align-top">Your terminal</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed"><code className={C}>npm i -g pm2</code>. Always correct, and the only way on the Hub, which shows the command rather than installing remotely.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The installer flags, when you want to skip the question:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Script</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Install without asking</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Never install</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap">install.sh</td>
            <td className="py-3 px-4 font-mono text-xs text-foreground"><code className={C}>--pm2</code></td>
            <td className="py-3 px-4 font-mono text-xs text-foreground"><code className={C}>--no-pm2</code></td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap">install.ps1</td>
            <td className="py-3 px-4 font-mono text-xs text-foreground"><code className={C}>-Pm2</code></td>
            <td className="py-3 px-4 font-mono text-xs text-foreground"><code className={C}>-NoPm2</code></td>
          </tr>
          <tr>
            <td className="py-3 px-4 font-mono text-xs text-primary whitespace-nowrap">install.bat</td>
            <td className="py-3 px-4 font-mono text-xs text-foreground"><code className={C}>--pm2</code> → <code className={C}>-Pm2</code></td>
            <td className="py-3 px-4 font-mono text-xs text-foreground"><code className={C}>--no-pm2</code> → <code className={C}>-NoPm2</code></td>
          </tr>
        </tbody>
      </table>
      <CodeBlock lang="bash" filename="Linux installer">{`# the offer, only when PM2 is missing and there is a terminal
  Easy DevOps runs the apps it deploys with PM2, and shows the PM2 apps
  you already have. PM2 is not installed yet.

  It would be installed globally, for the account running this installer
  (admin), with that account's npm and its usual PM2 home. Nothing else
  is created, and existing apps are not touched.

  Install PM2 now? [y/N]

# no terminal: nothing is installed and nothing is guessed
  PM2 is not installed.
  No terminal is available, so it was not installed. Install it with:
    npm i -g pm2`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-10">
        On Windows Server the installer adds one honest line after a successful install: the PM2 it
        just installed belongs to the account that ran the installer, and the background service runs
        as <code className={C}>NT SERVICE\EasyDevOps</code> and cannot use another account&apos;s PM2 —
        so Easy DevOps reports that instead of creating a second one. Creating your first deploy app
        when PM2 is missing does not fail: the app is created (creating it does not start it) and the
        response carries the same offer, which the Deployments page turns into the Install PM2 button.
      </p>

      <h2 id="migration" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Migration: none
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        There is nothing to migrate and nothing is migrated. The owner&apos;s decision is the standard
        PM2 of the operator, unchanged, and 1.4.9 adds no Easy DevOps-owned PM2, no{" "}
        <code className={C}>PM2_HOME</code> under <code className={C}>C:\ProgramData</code>, no second
        daemon and no move of any app. An existing app keeps its name, its folder, its dump entry and
        the account it runs as.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The only change a server sees is what Easy DevOps reports and what it refuses: the Hub names
        the account whose PM2 the machine uses, and says why it cannot act on it, instead of calling a
        working PM2 &quot;not installed&quot;.
      </p>

      <div className="mt-3 rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">related</div>
        <p className="text-muted leading-relaxed">
          <a href="/docs/service" className="text-primary hover:underline">Background Service</a> for
          the Windows service itself,{" "}
          <a href="/docs/deployments" className="text-primary hover:underline">Deployments</a> for
          what runs under PM2, and{" "}
          <a href="/docs/troubleshooting#hub-service-pm2-1-4-8" className="text-primary hover:underline">
            Troubleshooting
          </a>{" "}
          when the Hub still shows the old labels.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Background Service", href: "/docs/service", section: "Operations" }}
        next={{ title: "Easy DevOps Hub", href: "/docs/hub", section: "Operations" }}
      />
    </DocPage>
  );
}
