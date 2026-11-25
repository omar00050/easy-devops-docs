import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import SecurityUpdateNotice from "@/components/SecurityUpdateNotice";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Troubleshooting",
  description:
    "Find the right Easy DevOps log for each service mode, recover a service stopped by an older update, repair a service that runs an older version than the CLI, confirm what the service is really doing, tell a clean stop from a crash, and fix the known install, UAC, runtime and Hub problems.",
  keywords: ["Easy DevOps troubleshooting", "Easy DevOps service recovery", "Easy DevOps 1.4.7", "Easy DevOps 1.4.6", "ezz service recover", "ezz service repair", "WinSW service", "sc.exe query EasyDevOps", "systemctl easy-devops", "service crash loop", "EPERM rename jobs.owner", "version drift"],
  alternates: { canonical: "/docs/troubleshooting" },
  openGraph: {
    type: "article",
    url: "/docs/troubleshooting",
    siteName: "Easy DevOps",
    title: "Troubleshooting",
    description:
      "Logs per mode, service state, clean stop versus crash, and the fixes for known issues.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troubleshooting",
    description:
      "Logs per mode, service state, clean stop versus crash, and the fixes for known issues.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

const badgeBase =
  "ml-2 inline-flex items-center rounded border px-1.5 py-0.5 align-middle font-mono text-[9px] font-bold uppercase tracking-wider";
const badgeFixed = `${badgeBase} border-primary/25 bg-primary/10 text-primary`;
const badgeAny = `${badgeBase} border-border bg-surface text-muted`;
const badge143 = `${badgeBase} border-primary/25 bg-primary/10 text-primary`;
const badge145 = `${badgeBase} border-primary/25 bg-primary/10 text-primary`;
const badge147 = `${badgeBase} border-primary/25 bg-primary/10 text-primary`;

export default function TroubleshootingPage() {
  return (
    <DocPage
      section="Operations"
      title="Troubleshooting"
      description="Start with the log for the mode this server runs in, then with what the service manager actually reports. Most problems end there; the rest are listed below with their fix."
    >
      <SecurityUpdateNotice />

      <h2 id="logs" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Logs, per mode
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Which file to open depends on how Easy DevOps runs here. The mode decides the supervisor,
        and the supervisor decides the log names:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Mode</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Log</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What is in it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">Windows Server</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary leading-relaxed align-top">
              C:\ProgramData\easy-devops\logs\EasyDevOps.wrapper.log<br />
              C:\ProgramData\easy-devops\logs\EasyDevOps.out.log<br />
              C:\ProgramData\easy-devops\logs\EasyDevOps.err.log
            </td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">
              WinSW start and stop records; then the daemon&apos;s output, then its errors. The service runs as <code className={C}>NT SERVICE\EasyDevOps</code>.
            </td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">Windows Personal</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary leading-relaxed align-top">
              %APPDATA%\easy-devops\daemon-supervisor.log
            </td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">
              The Startup-folder supervisor, which runs while the user is logged in. <code className={C}>ezz service status</code> prints the exact path.
            </td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">Linux</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary leading-relaxed align-top">
              journalctl -u easy-devops
            </td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">
              The stream of the systemd unit <code className={C}>easy-devops.service</code>, including every start and stop.
            </td>
          </tr>
        </tbody>
      </table>
      <CodeBlock lang="bash" filename="terminal">{`# any mode: the most recent daemon output and errors
ezz service logs

# Linux: the same stream from the unit, last 100 lines or live
journalctl -u easy-devops -n 100 --no-pager
journalctl -u easy-devops -f`}</CodeBlock>

      <div className="mb-10 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">note</div>
        <p className="text-muted leading-relaxed">
          The wrapper log exists only where WinSW runs — Windows Server mode. In Personal mode there
          is no wrapper, so <code className={C}>daemon-supervisor.log</code> is the log to read;{" "}
          <code className={C}>ezz service status</code> prints where it is.
        </p>
      </div>

      <h2 id="check-the-state" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Check the state
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        In 1.4.1, <code className={C}>ezz service status</code> asks Windows or systemd directly, so
        its answer agrees with <code className={C}>sc query</code> and with the daemon heartbeat. If
        the stored record and Windows disagree, it says so and tells you to run{" "}
        <code className={C}>ezz service install</code>.
      </p>
      <CodeBlock lang="powershell" filename="PowerShell (Administrator)">{`ezz service status

# the Service Control Manager's own view
sc.exe query EasyDevOps
sc.exe qc EasyDevOps
Get-Service EasyDevOps

# services.msc lists it as "Easy DevOps"`}</CodeBlock>

      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">important</div>
        <p className="text-muted leading-relaxed">
          In PowerShell, type <code className={C}>sc.exe</code> — never <code className={C}>sc</code>.{" "}
          <code className={C}>sc</code> is PowerShell&apos;s alias for{" "}
          <code className={C}>Set-Content</code>, so it silently writes a file instead of querying the
          service. In <strong className="text-foreground">cmd</strong>,{" "}
          <code className={C}>sc query EasyDevOps</code> works as expected.
        </p>
      </div>

      <CodeBlock lang="bash" filename="Linux">{`systemctl status easy-devops
systemctl is-enabled easy-devops   # does it start by itself?`}</CodeBlock>

      <h2 id="clean-stop-or-crash" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Clean stop or crash
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The same stop and restart can be routine or a failure. The wording in the logs is what
        separates them:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Signal</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Clean stop or restart</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Crash</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">out.log<br /><span className="font-normal text-muted">(Server mode)</span></td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed font-mono">Received SIGINT. Stopping...<br />Stopped.</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">ends with an error or a stack trace, with no stopping line before the exit</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">wrapper.log</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Stopping EasyDevOps, then <span className="font-mono">Process &lt;pid&gt; canceled with code 0</span>; a restart then shows <span className="font-mono">Starting WinSW in service mode</span> and <span className="font-mono">Started process &lt;pid&gt;</span></td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">the process exits with a non-zero code, and the next start is WinSW reacting to that exit</td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Timing</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">only the restart you asked for — a stop, restart, update or repair</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">WinSW restarts it after 5 s, then 20 s, then every minute</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">note</div>
        <p className="text-muted leading-relaxed">
          <code className={C}>Starting WinSW in console mode</code> lines are written every time a
          command calls the wrapper — install, status and the rest. They are not restarts.
        </p>
      </div>

      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>ezz service status</code> calls it a crash loop only when it finds three
        or more real, service-mode process starts within ten minutes that were not clean restarts. A
        single failure is reported as a failure, not as a loop.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        On Linux the same distinction is in <code className={C}>journalctl</code>:
      </p>
      <CodeBlock lang="text" filename="journalctl -u easy-devops">{`Stopped easy-devops.service.                          # a clean stop
Main process exited, code=exited, status=1/FAILURE     # a crash
Scheduled restart job                                  # systemd will try again`}</CodeBlock>

      <h2 id="known-problems" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Known problems and fixes
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Each entry is the symptom you saw, the cause, and the fix. Version numbers name the release
        that changed the behaviour. Every entry carries a label: problems marked{" "}
        <span className={badgeFixed}>fixed in 1.4.1</span> can only be met by people who installed
        1.4.0 — update to 1.4.1 or later; problems marked{" "}
        <span className={badgeAny}>any version</span> can still happen on the current release;
        entries marked <span className={badge143}>new in 1.4.3</span> or{" "}
        <span className={badge143}>fixed in 1.4.3</span> describe how administrator rights work
        since 1.4.3. Entries marked <span className={badge147}>fixed in 1.4.7</span> cover the
        upgrade failures found while the 1.4.4–1.4.6 security fixes were being applied, and two
        daemon problems found on the same servers — the version drift and the state-file crash.
      </p>

      <h3 id="service-stopped-after-update-1-4-4" className="text-base font-bold mt-8 mb-3 text-foreground">
        The service stopped after updating to 1.4.4–1.4.6
        <span className={badge147}>fixed in 1.4.7</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> The update finishes or exits part way
        through and the background service does not come back. On Windows Server, repair can then
        report <code className={C}>EPERM</code> while reading{" "}
        <code className={C}>C:\ProgramData\easy-devops\bin\EasyDevOps.exe</code>, or Windows can say
        that starting the service was refused for this account. On Linux, systemd can remain in a
        restart loop after an update from 1.4.3. The daemon reports that it cannot initialize{" "}
        <code className={C}>/root/.config/easy-devops/easy-devops.sqlite</code> and suggests checking
        write access even though it runs as root.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The affected upgrades could leave a mixed
        package, pinned runtime and service definition. On Windows Server, file protection could
        leave files beneath <code className={C}>bin</code> and <code className={C}>runtime</code> with
        empty access-control lists, so even an elevated administrator could not read the service
        binary. The recorded service descriptor still granted SYSTEM and Administrators full control,
        so the recorded failure was in the file DACLs. On Linux, the database startup message hid the
        operating-system or native-module error that actually stopped the daemon.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        Read the{" "}
        <a href="/docs/security-advisories" className="text-primary hover:underline">
          security advisory and upgrade steps
        </a>{" "}
        before changing anything. Install 1.4.7 first. If the CLI runs, recovery is one command on
        each platform:
      </p>
      <CodeBlock lang="powershell" filename="Windows Server, Administrator PowerShell">{`ezz --version
ezz service status
ezz service recover
ezz service status`}</CodeBlock>
      <CodeBlock lang="bash" filename="Linux">{`ezz --version
ezz service status
ezz service recover
ezz service status`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-3">
        On Windows, 1.4.7 first restores access to the code folders, then runs the normal repair. On
        Linux, it repairs the pinned runtime link, regenerates the unit and restarts it. Check that
        the service manager reports running, the daemon heartbeat advances, and{" "}
        <code className={C}>ezz service status</code> shows the same version on{" "}
        <code className={C}>Service version</code> and <code className={C}>CLI version</code>. On
        Windows Server, <code className={C}>EasyDevOps.out.log</code> must start with{" "}
        <code className={C}>Easy DevOps daemon v1.4.7</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">If <code className={C}>ezz</code> cannot start on
        Windows,</strong> open PowerShell as Administrator. First record the descriptor and the two
        code-folder ACLs:
      </p>
      <CodeBlock lang="powershell" filename="Windows Server, Administrator PowerShell">{String.raw`whoami /groups
sc.exe qc EasyDevOps
sc.exe sdshow EasyDevOps
icacls "C:\ProgramData\easy-devops\bin"
icacls "C:\ProgramData\easy-devops\runtime"
icacls "C:\ProgramData\easy-devops\bin\EasyDevOps.exe"
icacls "C:\ProgramData\easy-devops\runtime\node.exe"
icacls "C:\ProgramData\easy-devops\runtime\app\src\cli\index.js"`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-2">
        If <code className={C}>icacls</code> shows no entries for a file, reset only the files beneath{" "}
        <code className={C}>bin</code> and <code className={C}>runtime</code>, then give the service
        account read and execute access on both folders:
      </p>
      <CodeBlock lang="powershell" filename="Windows Server, Administrator PowerShell">{String.raw`icacls "C:\ProgramData\easy-devops\bin\*" /reset /T /C /Q
icacls "C:\ProgramData\easy-devops\runtime\*" /reset /T /C /Q
icacls "C:\ProgramData\easy-devops\bin" /grant "NT SERVICE\EasyDevOps:(OI)(CI)RX"
icacls "C:\ProgramData\easy-devops\runtime" /grant "NT SERVICE\EasyDevOps:(OI)(CI)RX"
sc.exe start EasyDevOps`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-2">
        If a reset is denied, take ownership of those files for Administrators and repeat
        the reset and the two grants:
      </p>
      <CodeBlock lang="powershell" filename="Windows Server, Administrator PowerShell">{String.raw`icacls "C:\ProgramData\easy-devops\bin\*" /setowner *S-1-5-32-544 /T /C /Q
icacls "C:\ProgramData\easy-devops\runtime\*" /setowner *S-1-5-32-544 /T /C /Q`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-2">
        If even that is denied — the elevated token itself is refused — run the same reset
        and grant blocks as LocalSystem. This is the fallback{" "}
        <code className={C}>ezz service recover</code> prints for that case: a SYSTEM
        PowerShell from a PsExec that is already on the machine, or a one-shot scheduled
        task whose user is SYSTEM. <code className={C}>whoami</code> must print{" "}
        <code className={C}>nt authority\system</code>. Leave the SYSTEM session as soon as
        the ACLs are repaired, and do not use it to edit the database or the service
        settings.
      </p>
      <CodeBlock lang="powershell" filename="Windows Server, Administrator PowerShell">{String.raw`psexec -s -i powershell.exe
whoami   # nt authority\system`}</CodeBlock>
      <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">warning</div>
        <p className="text-muted leading-relaxed">
          Never run a recursive ACL reset on the whole{" "}
          <code className={C}>C:\ProgramData\easy-devops</code> tree. The database, settings,
          certificates, deployments and logs are user data. These commands touch only the separate
          code folders. Do not guess a replacement for the service descriptor shown by{" "}
          <code className={C}>sc.exe sdshow</code>.
        </p>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">If <code className={C}>ezz</code> cannot start on
        Linux,</strong> preserve the unit and journal, then test the pinned runtime and database
        without changing them:
      </p>
      <CodeBlock lang="bash" filename="Linux">{`sudo systemctl cat easy-devops.service
sudo systemctl show easy-devops.service -p User -p ExecStart -p FragmentPath -p DropInPaths
sudo journalctl -u easy-devops.service -b -n 100 --no-pager
sudo ls -la /root/.config/easy-devops/

cd /usr/lib/node_modules/easy-devops
sudo npm ls better-sqlite3 good.db
sudo ls -la node_modules/better-sqlite3/build/Release/

sudo /root/.config/easy-devops/runtime/node -e 'const D=require("better-sqlite3");const db=new D("/root/.config/easy-devops/easy-devops.sqlite",{readonly:true,fileMustExist:true});console.log(db.prepare("select name from sqlite_master").all())'

sudo cp /root/.config/easy-devops/easy-devops.sqlite /tmp/ez-copy.sqlite && sudo node -e 'const D=require("better-sqlite3");new D("/tmp/ez-copy.sqlite").exec("create table if not exists _t(x)");console.log("write OK")'

sudo fuser -v /root/.config/easy-devops/easy-devops.sqlite*`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-2">
        Then follow the answer, not a guess. Each result has one safe fix:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-3">
        <li>
          <strong className="text-foreground">The module does not load</strong> —{" "}
          <code className={C}>npm ls</code> fails, the <code className={C}>build/Release</code>{" "}
          folder has no <code className={C}>better_sqlite3.node</code>, or the error names{" "}
          <code className={C}>NODE_MODULE_VERSION</code> or a different Node: rebuild it in the
          package folder with the Node the service runs:{" "}
          <code className={C}>cd /usr/lib/node_modules/easy-devops &amp;&amp; sudo npm rebuild better-sqlite3</code>.
        </li>
        <li>
          <strong className="text-foreground">
            The read-only open fails with <code className={C}>SQLITE_CORRUPT</code> or{" "}
            <code className={C}>SQLITE_NOTADB</code>
          </strong>{" "}
          — stop. Keep the database and its <code className={C}>-wal</code> and{" "}
          <code className={C}>-shm</code> files, take a copy, and report it with the exact
          error. Do not delete or recreate it.
        </li>
        <li>
          <strong className="text-foreground">
            <code className={C}>fuser</code> names a process
          </strong>{" "}
          — a leftover process from the failed update still holds the database. Identify it,
          stop only that confirmed leftover Easy DevOps process, then start the service again.
        </li>
        <li>
          <strong className="text-foreground">
            The read-only open and the copy both succeed
          </strong>{" "}
          — the database is fine. Install 1.4.7 and run{" "}
          <code className={C}>ezz service recover</code>: it rewrites the unit from a valid
          template and restarts the service.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-3">
        A malformed unit is the other half of this failure. If{" "}
        <code className={C}>systemctl cat</code> shows <code className={C}>Environment=</code>{" "}
        lines in <code className={C}>[Unit]</code>, or a line that ends in a comment, the unit
        was written by 1.4.4–1.4.6. 1.4.7 builds it from a template and puts every{" "}
        <code className={C}>Environment=</code> line in <code className={C}>[Service]</code>, so{" "}
        <code className={C}>ezz service recover</code> replaces it. Do not edit the installed
        unit by hand and expect the next repair to keep the edit. Read{" "}
        <a href="/docs/security-advisories" className="text-primary hover:underline">
          the advisory
        </a>{" "}
        and the{" "}
        <a href="/docs/maintenance" className="text-primary hover:underline">update guide</a>, and
        ask for help with the collected output if the database check fails.
      </p>

      <h3 id="version-drift" className="text-base font-bold mt-8 mb-3 text-foreground">
        The service runs an older version than the CLI
        <span className={badge147}>fixed in 1.4.7</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> In Windows Server mode,{" "}
        <code className={C}>ezz --version</code> reports one version while{" "}
        <code className={C}>ezz service status</code> shows a different{" "}
        <code className={C}>Service version</code>, or{" "}
        <code className={C}>C:\ProgramData\easy-devops\logs\EasyDevOps.out.log</code> starts
        with an older <code className={C}>Easy DevOps daemon v…</code> line. Since 1.4.7{" "}
        <code className={C}>ezz</code> prints a warning naming both versions on every command
        except <code className={C}>daemon</code> and the repair and recover commands themselves.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The service does not run the package
        you type. It runs its own copy under{" "}
        <code className={C}>C:\ProgramData\easy-devops\runtime</code>, which only an
        administrator may replace. A plain{" "}
        <code className={C}>npm install -g easy-devops</code> updates the CLI and nothing else,
        so before 1.4.7 the service kept running the old code — including the security problems
        it was supposed to fix — and nothing said so. This check is Windows Server only: on Linux
        and in Windows Personal mode the service runs the package the CLI runs, so there is no
        second copy to compare.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Fix.</strong> From an Administrator PowerShell:
      </p>
      <CodeBlock lang="powershell" filename="Windows Server, Administrator PowerShell">{`ezz service status      # Service version and CLI version
ezz service repair      # copies the installed package to the runtime
ezz service status      # both versions now match`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-3">
        Nothing repairs itself on purpose: a repair replaces the code the service runs, so it
        stays a decision you make. In an interactive terminal the warning also offers the
        existing &quot;Relaunch as administrator?&quot; flow; from a script or CI it only warns.
        If the versions still differ afterwards, the runtime copy could not be replaced — read{" "}
        <code className={C}>ezz service status</code> for the reason and the wrapper log.
      </p>

      <h3 id="daemon-eperm-rename" className="text-base font-bold mt-8 mb-3 text-foreground">
        The daemon crashed with EPERM renaming jobs.owner
        <span className={badge147}>fixed in 1.4.7</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> On Windows,{" "}
        <code className={C}>EasyDevOps.err.log</code> contains{" "}
        <code className={C}>[daemon] uncaught exception</code> with{" "}
        <code className={C}>EPERM: operation not permitted, rename &apos;…\jobs.owner.&lt;pid&gt;.tmp&apos; -&gt; &apos;…\jobs.owner&apos;</code>{" "}
        and the service restarts in a loop, so monitoring, notifications and the Hub keep
        dropping.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> Every small state file is written by
        renaming a temporary file over the old one. On Windows that rename is refused while
        another process has the target open, even for a moment — the CLI reading the lock, the
        dashboard reading the marker. 1.4.6 treated that refusal as fatal.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Fix.</strong> Update to 1.4.7 and restart the
        service. Each write now retries briefly on <code className={C}>EPERM</code>,{" "}
        <code className={C}>EBUSY</code> and <code className={C}>EACCES</code>; a heartbeat that
        still cannot write is logged once as{" "}
        <code className={C}>[state] could not write …</code> and retried on the next beat
        instead of ending the process.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-3">
        If the message keeps appearing after the update, the data directory itself is not
        writable or another program holds those files. Check{" "}
        <code className={C}>icacls &quot;C:\ProgramData\easy-devops&quot;</code> and run{" "}
        <code className={C}>ezz service repair</code> as administrator. Do not delete{" "}
        <code className={C}>daemon.lock</code>, <code className={C}>jobs.owner</code> or{" "}
        <code className={C}>daemon-state.json</code> while the service is running — that is how
        two processes end up believing they own the same work.
      </p>

      <h3 id="npm-ebusy" className="text-base font-bold mt-8 mb-3 text-foreground">
        npm fails with EBUSY on better_sqlite3.node
        <span className={badgeAny}>any version</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> Updating with{" "}
        <code className={C}>npm i -g easy-devops</code>, or installing a downloaded package with{" "}
        <code className={C}>npm i -g ./easy-devops-&lt;version&gt;.tgz</code>, fails with{" "}
        <code className={C}>EBUSY: resource busy or locked</code> on a path ending in{" "}
        <code className={C}>better_sqlite3.node</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> An Easy DevOps process from the old
        version is still running from the npm folder that is being replaced, and Windows keeps the
        native module file locked. Usually it is a dashboard started from the menu — its command
        line contains <code className={C}>src\dashboard\server.js</code> — or another{" "}
        <code className={C}>ezz</code> window left open.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-3">
        <strong className="text-foreground">Fix.</strong> Stop that process, then install again.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        1. Find the candidates — this lists every Node process with its command line:
      </p>
      <CodeBlock lang="powershell" filename="PowerShell">{`Get-CimInstance Win32_Process -Filter "name='node.exe'" | Select ProcessId, CommandLine`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-2">
        2. Stop <strong className="text-foreground">only</strong> the Easy DevOps process whose
        CommandLine points into the global npm folder&apos;s easy-devops package — for example{" "}
        <code className={C}>...\npm\node_modules\easy-devops\src\dashboard\server.js</code> or{" "}
        <code className={C}>...\easy-devops\src\cli\index.js</code>:
      </p>
      <CodeBlock lang="powershell" filename="PowerShell">{`Stop-Process -Id <ProcessId>`}</CodeBlock>
      <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">warning</div>
        <p className="text-muted leading-relaxed">
          Never stop PM2 apps or other node processes you do not recognise. Never stop the Windows
          service&apos;s <code className={C}>C:\ProgramData\easy-devops\runtime\node.exe</code> —
          that is the background service, which runs from its own copy and does not block npm. Use{" "}
          <code className={C}>ezz service stop</code> if you want it stopped.
        </p>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-2">
        3. If npm left a half-renamed folder behind, delete the leftover{" "}
        <code className={C}>node_modules\.easy-devops-*</code> folder in the global npm folder
        (find it with <code className={C}>npm root -g</code>):
      </p>
      <CodeBlock lang="powershell" filename="PowerShell">{`Get-ChildItem (npm root -g) -Filter '.easy-devops-*' -Force | Remove-Item -Recurse -Force`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-2">
        4. Run the install again: <code className={C}>npm i -g easy-devops</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Prevention.</strong> Stop the dashboard before updating
        (Easy DevOps &gt; Dashboard &gt; Stop) and close other <code className={C}>ezz</code> windows.
      </p>

      <h3 id="winsw-xml-not-found" className="text-base font-bold mt-8 mb-3 text-foreground">
        Server-mode install fails: WinSW-x64.xml not found
        <span className={badgeFixed}>fixed in 1.4.1</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> In 1.4.0 the install stops at{" "}
        <code className={C}>Registering the service</code> with{" "}
        <code className={C}>Unable to locate WinSW-x64.[xml|yml] file within executable directory</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The 1.4.0 build did not put the WinSW
        definition file next to the wrapper executable, which is exactly where the wrapper looks for it.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> Update to 1.4.1 with{" "}
        <code className={C}>npm install -g easy-devops@latest</code> or{" "}
        <code className={C}>ezz update</code>, then run <code className={C}>ezz service install</code>{" "}
        again in an Administrator PowerShell. It reuses the data already moved to{" "}
        <code className={C}>C:\ProgramData\easy-devops</code>, renames the old{" "}
        <code className={C}>WinSW-x64.exe</code>, registers, starts and verifies the service.
      </p>

      <h3 id="stray-sc-files" className="text-base font-bold mt-8 mb-3 text-foreground">
        Stray files named query, qc, stop, start or delete
        <span className={badgeFixed}>fixed in 1.4.1</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> Files appear in the folder the command
        was run from — often <code className={C}>C:\Windows\System32</code> in an Administrator
        PowerShell — with the content <code className={C}>EasyDevOps</code>. The same cause made{" "}
        <code className={C}>ezz service stop</code> and <code className={C}>ezz service start</code>{" "}
        report success without touching the service.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> 1.4.0, and earlier 1.4.1 builds, called{" "}
        <code className={C}>sc</code>, which PowerShell maps to <code className={C}>Set-Content</code>:
        the query or control word was written to a file instead of sent to the service.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> Delete them; they are harmless. 1.4.1 always
        calls <code className={C}>sc.exe</code>.
      </p>

      <h3 id="status-unknown" className="text-base font-bold mt-8 mb-3 text-foreground">
        Status says Running: no (unknown), or calls a restart a crash loop
        <span className={badgeFixed}>fixed in 1.4.1</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong>{" "}
        <code className={C}>ezz service status</code> prints{" "}
        <code className={C}>Running: no (unknown)</code> and{" "}
        <code className={C}>Start on boot: unknown</code> while Windows reports the service{" "}
        <code className={C}>RUNNING</code>, or it reports a crash loop after a routine restart.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> In 1.4.0 the status query went through{" "}
        <code className={C}>sc</code>, which PowerShell turns into <code className={C}>Set-Content</code>,
        so no answer came back; and every{" "}
        <code className={C}>Starting WinSW in console mode</code> line was counted as a restart.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> 1.4.1 asks Windows with{" "}
        <code className={C}>sc.exe</code> and counts only real service-mode process starts — three
        unclean restarts in ten minutes is a crash loop. Update, then run{" "}
        <code className={C}>ezz service status</code> again.
      </p>

      <h3 id="uac-unknown-publisher" className="text-base font-bold mt-8 mb-3 text-foreground">
        A UAC prompt says Unknown publisher
        <span className={badgeAny}>any version</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> A UAC prompt for{" "}
        <code className={C}>EasyDevOps.exe</code> shows <code className={C}>Unknown publisher</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> <code className={C}>EasyDevOps.exe</code>{" "}
        is WinSW, the open-source service wrapper, v2.12.0, downloaded from its GitHub release and
        verified by SHA-256 before use. It is not code-signed, so Windows cannot show a publisher.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> 1.4.1 checks elevation first and stops with{" "}
        <code className={C}>Open PowerShell with Run as administrator and run the command again</code>{" "}
        before copying or migrating anything, so in an elevated terminal no prompt appears. Open an
        Administrator PowerShell and run the install there. 1.4.3 replaces that stop with the relaunch
        prompt in the entry below.
      </p>

      <h3 id="relaunch-as-administrator" className="text-base font-bold mt-8 mb-3 text-foreground">
        The command says This needs administrator rights
        <span className={badge143}>new in 1.4.3</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> From a normal PowerShell,{" "}
        <code className={C}>ezz service install</code> in Server mode,{" "}
        <code className={C}>ezz service uninstall</code>, <code className={C}>ezz service repair</code>,{" "}
        <code className={C}>ezz update</code>, <code className={C}>ezz runtime update</code> or{" "}
        <code className={C}>ezz uninstall --purge</code> stops at{" "}
        <code className={C}>This needs administrator rights. Relaunch as administrator? (Y/n)</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> Those commands replace the service&apos;s
        files — the wrapper under <code className={C}>C:\ProgramData\easy-devops\bin</code> and the
        pinned runtime under <code className={C}>C:\ProgramData\easy-devops\runtime</code> — which only
        an administrator may write. 1.4.3 checks elevation before the first change, so a refused
        prompt cannot leave the service half-replaced.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">What happens.</strong>{" "}
        <code className={C}>Y</code>, the default, opens a new elevated PowerShell window through a
        single UAC prompt — no password — and runs the same command with the same arguments there.
        That window prints its own output and stays open at the end; the window you started from says
        it handed off and changes nothing. <code className={C}>N</code> prints the exact command and
        changes nothing.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">In a script or CI.</strong> With no terminal to ask,
        nothing is relaunched: the command is printed and the exit code is 3, which tells a missing
        elevation from a command that ran and failed.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Commands that never ask.</strong>{" "}
        <code className={C}>ezz service status</code>,{" "}
        <code className={C}>ezz service start|stop|restart</code> and the other CLI commands run as the
        account that installed the service — see{" "}
        <a href="/docs/service#administrator-rights" className="text-primary hover:underline">
          Administrator rights in Server mode
        </a>.
      </p>
      <CodeBlock lang="powershell" filename="PowerShell">{`PS C:\\> ezz service install
This needs administrator rights. Relaunch as administrator? (Y/n)

# Y   -> one UAC prompt, then the same command in an elevated window
# N   -> the command is printed, nothing changes
# no terminal (script, CI) -> the command is printed, exit code 3`}</CodeBlock>

      <h3 id="service-access-denied" className="text-base font-bold mt-8 mb-3 text-foreground">
        ezz service start, stop or restart fails with Access is denied
        <span className={badge143}>fixed in 1.4.3</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> From a normal PowerShell,{" "}
        <code className={C}>ezz service start</code>, <code className={C}>ezz service stop</code> or{" "}
        <code className={C}>ezz service restart</code> fails with{" "}
        <code className={C}>Access is denied</code>, while the same command succeeds in an
        Administrator PowerShell and the service is installed and running.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> Before 1.4.3 the service belonged to
        administrators only, so only an elevated terminal could send it a start or stop.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Fix.</strong> Install and repair now grant the account that
        ran them — matched by SID, not by name — start, stop and query on{" "}
        <code className={C}>EasyDevOps</code>, and nothing else: that account cannot change the
        service&apos;s configuration and cannot delete it, and the right is never given to{" "}
        <code className={C}>Users</code> or <code className={C}>Everyone</code>. An install made
        before 1.4.3 gets it by running <code className={C}>ezz service repair</code> once as
        administrator; <code className={C}>ezz service status</code> then shows it on its{" "}
        <code className={C}>Without admin</code> line.
      </p>
      <CodeBlock lang="powershell" filename="PowerShell">{`# once, in an Administrator PowerShell
ezz service repair

# then, from a normal PowerShell
ezz service status    # Without admin: start, stop, query
ezz service stop`}</CodeBlock>

      <h3 id="service-uninstall-hang" className="text-base font-bold mt-8 mb-3 text-foreground">
        Windows Server uninstall stalls while removing permissions
        <span className={badge145}>fixed in 1.4.5</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong>{" "}
        <code className={C}>ezz service uninstall</code> remains at{" "}
        <code className={C}>Removing the service account grants…</code> or{" "}
        <code className={C}>Removing service-account permissions…</code> for either data choice.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> Versions before 1.4.5 started one
        permissions command for every object in the data directory, and the move path also copied the
        large runtime and wrapper folders. A large tree could leave the uninstall spinner running for
        a very long time.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Fix.</strong> Stop the stalled command with{" "}
        <kbd>Ctrl+C</kbd>, update to 1.4.5, and run <code className={C}>ezz service uninstall</code>{" "}
        again from an Administrator PowerShell. The operation now names each stage, limits each one to
        five minutes, and returns a nonzero error naming the stage when the limit is reached.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Data behavior.</strong> Keeping data performs no copy or
        move. Moving data copies and verifies user files only, excludes{" "}
        <code className={C}>runtime</code>, <code className={C}>runtime.prev</code>, and{" "}
        <code className={C}>bin</code>, and keeps a backup. A copy, verification, activation, or
        deadline failure restores the live source before the database is reopened. If Windows blocks
        a rollback, the error names both paths.
      </p>

      <h3 id="service-wrapper-eperm" className="text-base font-bold mt-8 mb-3 text-foreground">
        Service repair or status fails with EPERM beside EasyDevOps.exe
        <span className={badge147}>fixed in 1.4.7</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> In Windows Server mode,{" "}
        <code className={C}>ezz service repair</code> reports{" "}
        <code className={C}>EPERM: operation not permitted</code> for{" "}
        <code className={C}>C:\ProgramData\easy-devops\bin\EasyDevOps.exe</code>, or{" "}
        <code className={C}>ezz service status</code> reports <code className={C}>spawn EPERM</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> Two different faults produce this, and{" "}
        <code className={C}>icacls</code> tells them apart. Before 1.4.5, repair could try to
        inspect or replace the wrapper while Windows denied access and end with the service
        stopped. On 1.4.4–1.4.6 a repair or update could leave the files under{" "}
        <code className={C}>bin</code> and <code className={C}>runtime</code> with an access list
        that has no entries at all — run{" "}
        <code className={C}>icacls "C:\ProgramData\easy-devops\bin\EasyDevOps.exe"</code> and look
        for empty output. That is the lock-out described in the entry above.
      </p>
      <p className="text-sm leading-relaxed mb-2">
        <strong className="text-foreground">Fix.</strong> Update to 1.4.7, open PowerShell as
        Administrator, and run <code className={C}>ezz service recover</code> (then{" "}
        <code className={C}>ezz service status</code>). Recovery repairs the code-tree permissions
        and verifies them before it runs the normal repair; if{" "}
        <code className={C}>icacls</code> shows empty DACLs and <code className={C}>ezz</code>{" "}
        cannot run at all, use the manual steps in{" "}
        <a href="#service-stopped-after-update-1-4-4" className="text-primary hover:underline">
          the 1.4.4–1.4.6 recovery entry
        </a>
        .
      </p>

      <h3 id="readonly-database" className="text-base font-bold mt-8 mb-3 text-foreground">
        SqliteError: attempt to write a readonly database
        <span className={badge143}>fixed in 1.4.3</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> In Server mode, a command that writes
        fails from a normal PowerShell with{" "}
        <code className={C}>SqliteError: attempt to write a readonly database</code> —{" "}
        <code className={C}>ezz hub status</code>, a domain change, or any other CLI command.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The database lives in{" "}
        <code className={C}>C:\ProgramData\easy-devops</code>, which before 1.4.3 only administrators
        and the service account could write. Your account opened it read-only.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Fix.</strong> 1.4.3 grants the installing account Modify
        on <code className={C}>C:\ProgramData\easy-devops</code>, so hub status, domain changes and the
        other CLI commands work from a normal PowerShell. On an install from before 1.4.3, run{" "}
        <code className={C}>ezz service repair</code> once as administrator. A 1.4.3 CLI names{" "}
        <code className={C}>ezz service repair</code> in the message instead of printing a stack trace.
      </p>
      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">note</div>
        <p className="text-muted leading-relaxed">
          The data directory is the only part that is shared.{" "}
          <code className={C}>C:\ProgramData\easy-devops\runtime</code> and{" "}
          <code className={C}>...\bin</code> stay administrator-only on purpose — replacing{" "}
          <code className={C}>node.exe</code> would run code as the service account — and they no
          longer inherit the data directory&apos;s permissions, so this grant does not reach them.
        </p>
      </div>

      <h3 id="update-needs-administrator" className="text-base font-bold mt-8 mb-3 text-foreground">
        Settings &gt; Update says to use an Administrator PowerShell
        <span className={badge143}>new in 1.4.3</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> In Server mode,{" "}
        <strong className="text-foreground">Settings &gt; Update</strong> does not start an update when
        the dashboard was not started elevated. It says that updating needs{" "}
        <code className={C}>ezz update</code> from an Administrator PowerShell, with a copy button.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> An update replaces the wrapper and the
        pinned runtime, which only an administrator may write, and a dashboard cannot raise UAC for
        you.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> Copy the command and run it in an
        Administrator PowerShell. From a normal PowerShell, <code className={C}>ezz update</code>{" "}
        offers the relaunch prompt described above and does the same after one UAC consent.
      </p>

      <h3 id="slow-first-start" className="text-base font-bold mt-8 mb-3 text-foreground">
        The first start looks stuck
        <span className={badgeAny}>any version</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> The install waits, then reports{" "}
        <code className={C}>started, still initialising</code> while the service is already{" "}
        <code className={C}>RUNNING</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The first start of the copied{" "}
        <code className={C}>node.exe</code> can take tens of seconds because Windows Defender scans
        it. The install waits about 45 s for the daemon to report in.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> Check again a minute later with{" "}
        <code className={C}>ezz service status</code>. Nothing needs reinstalling.
      </p>

      <h3 id="repair-while-running" className="text-base font-bold mt-8 mb-3 text-foreground">
        Repair fails while the service is running
        <span className={badgeFixed}>fixed in 1.4.1</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> In 1.4.0,{" "}
        <code className={C}>ezz service repair</code> fails with{" "}
        <code className={C}>EBUSY ... runtime\node.exe</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> Windows locks a running executable, so
        the runtime copy cannot be replaced underneath it.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> 1.4.1 stops the service, refreshes the
        runtime copy, starts it again and restores the previous copy if the new one does not start.
        Update, then run <code className={C}>ezz service repair</code>.
      </p>

      <h3 id="install-stopped-halfway" className="text-base font-bold mt-8 mb-3 text-foreground">
        An install that stopped half way
        <span className={badgeAny}>any version</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> The install ended in the middle — a
        network drop, a refused elevation prompt, or a terminal that was closed.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The step never finished, so the service
        may be partly registered and the data partly moved.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> Run <code className={C}>ezz service install</code>{" "}
        again; it resumes. Server mode and the migrated data are kept, and any half-registered service
        is removed and registered again.
      </p>

      <h3 id="original-data" className="text-base font-bold mt-8 mb-3 text-foreground">
        Where the original data went
        <span className={badgeAny}>any version</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> After moving to Server mode,{" "}
        <code className={C}>%APPDATA%\easy-devops</code> is no longer where it was and you need the
        old copy, or you want Personal mode back.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The migration renames the old data
        directory out of the way. Normally it is{" "}
        <code className={C}>%APPDATA%\easy-devops.backup-&lt;date-time&gt;</code>; if Windows could not
        rename it, it was left at <code className={C}>%APPDATA%\easy-devops</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> The install prints the path, and nothing is
        deleted. To move the data back to <code className={C}>%APPDATA%</code>, run{" "}
        <code className={C}>ezz service uninstall</code> and choose to move the data back — the
        default keeps <code className={C}>C:\ProgramData\easy-devops</code>. Personal mode needs the
        data back in <code className={C}>%APPDATA%</code> first.
      </p>

      <h3 id="backup-at-null" className="text-base font-bold mt-8 mb-3 text-foreground">
        The install prints migrated; backup at null
        <span className={badgeFixed}>fixed in 1.4.1</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong> During the move to Server mode, the
        install says <code className={C}>migrated; backup at null</code> instead of naming a backup
        directory.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> The install process still had the
        database open, so Windows refused to rename the original to its backup name. The original was
        always kept — the message simply did not say where.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> Nothing was lost: the data is at{" "}
        <code className={C}>%APPDATA%\easy-devops</code>, or at the path the entry above describes.
        1.4.1 closes the database for the move and prints the real backup path, or where the
        original was left.
      </p>

      <h3 id="hub-state-not-reported" className="text-base font-bold mt-8 mb-3 text-foreground">
        Hub says the agent state is not reported yet
        <span className={badgeFixed}>fixed in 1.4.1</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Symptom.</strong>{" "}
        <code className={C}>ezz hub status</code> or <code className={C}>ezz hub connect</code> says
        the agent state is <code className={C}>not reported by the background service yet</code>,
        while the Hub shows the server online.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">Cause.</strong> In 1.4.0 the CLI could not read the
        service&apos;s named pipe, which belongs to{" "}
        <code className={C}>NT SERVICE\EasyDevOps</code>. The connection itself is fine — only the
        report is missing.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-8">
        <strong className="text-foreground">Fix.</strong> 1.4.1 also reads the state the service
        writes to its data directory. If it still says so, check that the service is running and read{" "}
        <code className={C}>EasyDevOps.out.log</code>.
      </p>

      <h3 id="cmd-vs-powershell" className="text-base font-bold mt-8 mb-3 text-foreground">
        cmd versus PowerShell
        <span className={badgeAny}>any version</span>
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <strong className="text-foreground">Symptom.</strong> A command that works in cmd does nothing
        in PowerShell, or an environment variable prints empty.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <strong className="text-foreground">Cause.</strong> The two shells name the same things
        differently, and <code className={C}>sc</code> means <code className={C}>Set-Content</code> in
        PowerShell. Use the form for the shell you are in:
      </p>
      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Task</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">cmd</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">PowerShell</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Query the service</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary">sc query EasyDevOps</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary">sc.exe query EasyDevOps</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Restart it</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary">sc stop EasyDevOps<br />sc start EasyDevOps</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary">Restart-Service EasyDevOps<br />Get-Service EasyDevOps</td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Data directory</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary">%APPDATA%</td>
            <td className="py-3 px-4 font-mono text-[11px] text-primary">$env:APPDATA</td>
          </tr>
          <tr className="bg-primary/[0.015]">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Server mode</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed" colSpan={2}>
              Run Easy DevOps commands from an <strong className="text-foreground">Administrator PowerShell</strong>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="recover" className="text-xl font-bold mt-10 mb-4 text-foreground">
        How to recover
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Five commands cover almost every recovery. Run the Windows ones in an Administrator terminal
        when the service is in Server mode.
      </p>
      <CodeBlock lang="bash" filename="terminal">{`ezz service install     # safe to repeat; re-registers the service
ezz service restart     # stop and start in one step
ezz service repair      # after nginx/SSL path changes or an update
ezz service recover     # repairs a service broken by an earlier upgrade
ezz service uninstall   # keeps the data by default; nginx and sites untouched`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li><strong className="text-foreground">Reinstall</strong> — <code className={C}>ezz service install</code> is safe to repeat; it re-registers the service.</li>
        <li><strong className="text-foreground">Stop, start, restart</strong> — <code className={C}>ezz service stop|start|restart</code>, or services.msc, or <code className={C}>sc.exe stop EasyDevOps</code> and <code className={C}>sc.exe start EasyDevOps</code>. On Linux, <code className={C}>sudo systemctl restart easy-devops</code>.</li>
        <li><strong className="text-foreground">Repair</strong> — <code className={C}>ezz service repair</code> after changing nginx or SSL paths, or after an update.</li>
        <li><strong className="text-foreground">Recover</strong> — <code className={C}>ezz service recover</code> after a 1.4.4–1.4.6 upgrade, or whenever the files under <code className={C}>bin</code> or <code className={C}>runtime</code> are unreadable. Windows Server mode only on Windows; Linux uses sudo.</li>
        <li><strong className="text-foreground">Uninstall</strong> — <code className={C}>ezz service uninstall</code> asks whether to keep the data in <code className={C}>C:\ProgramData\easy-devops</code> (the default) or move it back to <code className={C}>%APPDATA%</code>. nginx and your sites are never touched.</li>
      </ul>

      <h2 id="asking-for-help" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What to send when asking for help
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Open an issue at{" "}
        <a href="https://github.com/omar00050/Easy-DevOps/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          github.com/omar00050/Easy-DevOps/issues
        </a>{" "}
        and include:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>The full output of <code className={C}>ezz service status</code>.</li>
        <li>The last ~50 lines of the relevant logs — <code className={C}>ezz service logs</code>, or the files above, or <code className={C}>journalctl</code>.</li>
        <li><code className={C}>ezz --version</code>, or the banner.</li>
        <li>Windows edition and build (<code className={C}>winver</code>, or <code className={C}>Get-ComputerInfo -Property OsName,OsVersion</code>), or the Linux distribution (<code className={C}>cat /etc/os-release</code>).</li>
        <li>The Node version.</li>
      </ul>

      <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">warning</div>
        <p className="text-muted leading-relaxed">
          Remove secrets before posting: Hub connection strings and pairing links, passwords, tokens,
          webhook URLs, Telegram bot tokens, environment values and private keys.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Security advisories", href: "/docs/security-advisories", section: "Operations" }}
        next={{ title: "Dashboard API", href: "/docs/api", section: "Reference" }}
      />
    </DocPage>
  );
}
