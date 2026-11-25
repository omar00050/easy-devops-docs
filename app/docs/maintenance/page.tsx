import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import SecurityUpdateNotice from "@/components/SecurityUpdateNotice";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Maintenance & Updates",
  description:
    "Keep an Easy DevOps installation healthy: self-update, reclaim disk space with cleanup, back up and restore configuration, reissue first-run setup codes and uninstall cleanly.",
  keywords: ["Easy DevOps update", "cleanup disk", "backup configuration", "setup code", "uninstall Easy DevOps"],
  alternates: { canonical: "/docs/maintenance" },
  openGraph: {
    type: "article",
    url: "/docs/maintenance",
    siteName: "Easy DevOps",
    title: "Maintenance & Updates",
    description:
      "Self-update, cleanup, backup and restore, setup-code reissue, and a clean uninstall.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maintenance & Updates",
    description:
      "Self-update, cleanup, backup and restore, setup-code reissue, and a clean uninstall.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

export default function MaintenancePage() {
  return (
    <DocPage
      section="Operations"
      title="Maintenance & Updates"
      description="The routine jobs: staying current, reclaiming disk, keeping a copy of your configuration, and leaving cleanly if you ever need to."
    >
      <SecurityUpdateNotice />

      <h2 id="updates" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Updating Easy DevOps
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Updates are lifted over the installation, not over your data. The database and certificates
        live in a persistent user directory outside the npm package, so an update never asks you to
        reconfigure anything.
      </p>
      <CodeBlock lang="bash" filename="terminal">{`ezz update
# checks npm for a newer release, installs it,
# then restarts the background service`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">Settings → Update</strong> in the dashboard runs the same flow. The HTTP request only records the run and starts a detached worker; that worker stops the dashboard, installs the new version (rolling back if the new one will not start), starts the dashboard again on the same port, and writes every phase to <code className={C}>update-status.json</code> in the data directory. The page reads it back and shows the result, including the last lines of <code className={C}>logs/update.log</code>.</li>
        <li>Phases are <code className={C}>starting</code>, <code className={C}>stopping</code>, <code className={C}>updating</code>, <code className={C}>restarting</code>, then <code className={C}>done</code> or <code className={C}>failed</code>. A worker that disappears leaves the run as <code className={C}>interrupted</code> (no heartbeat for 45 seconds), never as still running.</li>
        <li>The CLI menu&apos;s <strong className="text-foreground">Check for Updates</strong> and <code className={C}>ezz update</code> run the same check and install.</li>
        <li>Node itself is updated separately with <code className={C}>ezz runtime update</code> — see <a href="/docs/service#runtime">the pinned runtime</a>.</li>
        <li>An interrupted update is recoverable with <code className={C}>ezz service repair</code>; data is never part of the transaction.</li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The Hub cannot run an update: the update stops and replaces the process that would have
        reported back. That is the one operation that stays out of the Hub.
      </p>

      <h2 id="cleanup" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Reclaiming disk space
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>ezz cleanup</code> audits, then removes only what you pick. It covers the
        files that accumulate quietly:
      </p>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-4">
        <li>Runtime backups left by Node upgrades</li>
        <li>Old service logs</li>
        <li>Stale lock files</li>
        <li>nginx <code className={C}>.bak</code> config files</li>
      </ul>
      <CodeBlock lang="bash" filename="terminal">{`ezz cleanup            # list what can be reclaimed; delete nothing
ezz cleanup --days 30  # treat logs older than 30 days as reclaimable
ezz cleanup --yes      # in scripts, after reviewing the list`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The default log age is 14 days. Running the audit alone is always safe — nothing is removed
        until you confirm a selection.
      </p>

      <h2 id="backup" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Backup and restore
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The dashboard can export your configuration as a single JSON file and restore it later:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">Download backup</strong> — settings and domains. Both the dashboard password and its hash are deliberately excluded.</li>
        <li><strong className="text-foreground">Restore</strong> — accepts the same file and rewrites the configuration from it. The password, listen address and auth mode are kept from the current installation rather than restored, so an old backup cannot re-open the listener or bring back a removed password.</li>
        <li>Certificates are files on disk, not database rows; back up <code className={C}>sslDir</code> separately if you need them.</li>
        <li><code className={C}>uninstall --purge</code> exports a backup before it removes anything.</li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        For a complete copy of the installation state, also copy the SQLite database described in{" "}
        <a href="/docs/configuration#database-keys">Configuration</a>.
      </p>

      <h2 id="setup-code" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Issuing a setup code
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        First-run setup has to be reachable before a password exists, so a one-time code proves that
        whoever is setting the password can read the server&apos;s own terminal or service log.
      </p>
      <CodeBlock lang="bash" filename="terminal">{`ezz dashboard setup-code
# prints a six-digit code to this terminal and the service log
# nowhere else: never in an API response, event or Hub message`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>The code expires after <strong className="text-foreground">24 hours</strong>.</li>
        <li>Failed attempts are rate-limited per address, and a <strong className="text-foreground">global cap of 20</strong> invalidates the code entirely. Only the machine itself can issue another.</li>
        <li>Only a hash is stored, in the same scrypt form as the dashboard password.</li>
        <li>Need a new one after the cap? Run the command above on the server.</li>
      </ul>

      <h2 id="uninstall" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Uninstalling
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>ezz uninstall</code> alone changes nothing — it explains what a purge
        would remove. Add <code className={C}>--purge</code> to proceed:
      </p>
      <CodeBlock lang="bash" filename="terminal">{`ezz uninstall --purge
# removes: the service definition, the pinned Node runtime,
#          the data directory (after exporting a backup)
# keeps:   nginx, your sites and their configs, every certificate`}</CodeBlock>
      <p className="text-sm text-muted leading-relaxed mb-4">
        In Windows Server mode, <code className={C}>ezz service uninstall</code> shows each
        operation and limits it to five minutes. <strong className="text-foreground">Keep data</strong>{" "}
        leaves the database and Server-mode marker in place. <strong className="text-foreground">Move
        data</strong> copies and verifies user files, leaves runtime and wrapper folders out of the
        copy, and keeps a backup. A copy, verification, activation, or deadline failure restores the
        live source before the database is reopened. If Windows blocks a rollback, the error names both
        paths. If a stage reaches its limit, the command names that stage and returns an error.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        <code className={C}>--yes</code> answers the confirmations for scripted use;{" "}
        <code className={C}>uninstall --purge</code> still prints what it is about to do before doing
        it.
      </p>

      <h2 id="diagnostics" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Diagnostics
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <div className="font-mono text-xs font-semibold text-primary">ezz system-info</div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            OS, architecture, Node, npm and nginx versions, detected in one pass and printed without entering the menu.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <div className="font-mono text-xs font-semibold text-primary">ezz service logs</div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Recent daemon output and errors. The place to look first when monitors or notifications stop.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <div className="font-mono text-xs font-semibold text-primary">ezz --dev</div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Isolated <code className={C}>.dev-data</code> directory. Development never touches an installed configuration.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <div className="font-mono text-xs font-semibold text-primary">ezz --help</div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Every command, action and example, generated from the installed version.
          </p>
        </div>
      </div>

      <div className="mb-2 rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">troubleshooting</div>
        <p className="text-muted leading-relaxed">
          When an update or repair did not finish, or the service keeps restarting,{" "}
          <a href="/docs/troubleshooting" className="text-primary hover:underline">Troubleshooting</a> covers
          the logs, the clean-stop versus crash signals and the recovery commands.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Easy DevOps Hub", href: "/docs/hub", section: "Operations" }}
        next={{ title: "Security advisories", href: "/docs/security-advisories", section: "Operations" }}
      />
    </DocPage>
  );
}
