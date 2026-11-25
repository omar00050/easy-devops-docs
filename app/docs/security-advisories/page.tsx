import type { Metadata } from "next";
import DocPage from "@/components/DocPage";
import DocsPagination from "@/components/DocsPagination";

export const metadata: Metadata = {
  title: "Security advisories",
  description: "Affected versions, fixes and upgrade instructions for Easy DevOps security releases.",
  alternates: { canonical: "/docs/security-advisories" },
};

export default function SecurityAdvisoriesPage() {
  return (
    <DocPage section="Operations" title="Security advisories" description="Check which installations are affected and what to do on each server.">
      <h2 id="v1-4-5" className="text-xl font-bold mb-4">1.4.5 security update</h2>
      <p className="text-sm leading-relaxed mb-4">
        <strong>1.4.4 and earlier are affected by the remaining issues fixed in 1.4.5. Versions 1.4.3 and 1.4.4 are not recommended.</strong>{" "}
        The security audit covered 1.4.3. Version 1.4.4 fixed the deployment, Windows permission,
        private-key and runtime findings in its advisory. Version 1.4.5 completes the audit and also
        fixes Windows Server repair and status failures when the existing wrapper cannot be opened.
      </p>
      <h3 id="upgrade" className="text-lg font-bold mt-8 mb-3">How to upgrade</h3>
      <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
        <li>For an npm installation, run <code>ezz update</code>. For a source installation, update the checkout that runs the service to the 1.4.5 release. Confirm <code>ezz --version</code> reports 1.4.5 or later.</li>
        <li>In Windows Server mode, after updating, open PowerShell as Administrator and run <code>ezz service repair</code>. This applies the runtime protections and repairs private-key and service permissions.</li>
        <li>Use the dashboard directly on the server or through a local HTTPS reverse proxy or secure tunnel. The dashboard no longer listens on a network interface. Pair remote Hubs over <code>https</code>.</li>
      </ol>
      <p className="text-sm leading-relaxed mt-4">For a custom Windows nginx or SSL directory, an administrator must also set the matching machine environment variable, <code>EASY_DEVOPS_APPROVED_NGINX_DIR</code> or <code>EASY_DEVOPS_APPROVED_SSL_DIR</code>, to its existing absolute directory before repair.</p>
      <p className="text-sm leading-relaxed mt-4">On Linux, custom certificate or nginx configuration paths must be inside the supported Easy DevOps roots. If this server used paths outside those roots, move the files and update the dashboard settings before the next certificate operation or update. The <code>nginx -t</code> check and managed-certificate inventory report any path that is still unsupported.</p>
      <h3 id="fixes" className="text-lg font-bold mt-8 mb-3">What changed</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
        <li>Deployment-generated PM2 configuration, launchers and release metadata now live in an engine-owned directory outside the app checkout. They use exclusive temporary files and atomic replacement, so links in a repository cannot redirect those writes.</li>
        <li>Windows ACL grant and revoke operations call the permissions tool with a direct argument list. Only approved, canonical, existing directories are accepted, and links, reparse points, system trees, and container roots are refused. Recursive ACL repair also refuses hard-linked files before a protected tree is reset.</li>
        <li>Windows Server data migration refuses linked, reparse-pointed, and non-directory source or destination paths, and hard-linked destination files, before copying. A hard-linked source file is only read. The Server mode marker uses exclusive creation and atomic replacement. Windows reinstall removes the registered service through the service manager before replacing the wrapper, waits for the service record to disappear, and stops on an unknown service state.</li>
        <li>Windows Server uninstall now displays each operation and fails a stage that runs longer than five minutes. Removal uses one preflighted recursive permission operation instead of one process per object. Keeping data performs no copy or move. Moving data copies and verifies user files only, excludes runtime and wrapper folders, and keeps a backup. A copy, verification, activation, or deadline failure restores the live source before the database is reopened. If Windows blocks a rollback, the error names both paths so the data remains recoverable.</li>
        <li>Windows nginx commands treat paths from settings as literal PowerShell values, so path characters cannot be evaluated as another command.</li>
        <li>Linux nginx error-log views use a bounded reader with direct arguments, and backend URLs with embedded usernames or passwords are refused before configuration is written.</li>
        <li>Raw Advanced nginx content requires <code>nginx.config.edit</code>. Typed values that become nginx configuration reject line breaks, <code>;</code>, <code>{"{"}</code>, and <code>{"}"}</code> before a file is written.</li>
        <li>Changing an app's repository origin clears its stored token, so a token for the previous repository cannot be sent to the new one.</li>
        <li>Site and ACME account private keys use private directories and <code>0600</code> files. Renewal replaces keys atomically, and renewal and service repair correct existing permissions.</li>
        <li>Authenticated Git fetches keep tokens and their encoded forms in child-only environment configuration, away from process arguments and deployment logs.</li>
        <li>The daemon resolves modules only inside its pinned runtime. Optional WebSocket accelerators use admin-owned throwing stubs, and service environments disable those accelerators explicitly. Install and repair replace the Windows runtime and wrapper folders instead of merging into old content, and every optional-package stub is recreated even when a previous package or link has the same name. Update and runtime update reapply the protections.</li>
        <li>Linux systemd installation stages the unit in a fresh private directory with an exclusively created file and cleans it up after success or failure.</li>
        <li>The updater validates the complete version before stopping anything and passes that validated value as a separate argument.</li>
        <li>Deployment output is redacted before it is stored or sent. Log reads and retirement refuse links and changed parent directories. Logs and diagnostic fields written by versions before 1.4.5 are retired before Hub progress or purge backups can read them.</li>
        <li>The Windows Node installer uses a private per-attempt directory and verifies the expected SHA-256 before launch. Linux installer helpers are bundled and hash-pinned. Automatic nvm-windows installation remains disabled unless a reviewed executable digest is configured, and a missing nvm installation fails closed.</li>
        <li>Linux permission setup accepts only the dedicated Easy DevOps SSL and nginx configuration roots after checking links, ownership and writable ancestors.</li>
        <li>Certificate issuance, deletion and purge share one lifecycle lock, which recovers safely when an owner process ID has been reused. Removal deletes only files recorded in the managed-artifact manifest, without recursive directory removal. Unrelated files, linked paths and unsafe roots are preserved.</li>
        <li>Deleting a domain can retain a shared, unmanaged, or otherwise unsafe certificate while still deleting the domain. Reference checks follow renamed hard links and linked nginx configuration directories with cycle protection. The result explains why the certificate was retained and lists remaining configuration references by filename and line. If purge cannot finish certificate cleanup, it preserves the data directory and managed-artifact manifest.</li>
        <li>An SSL directory that overlaps the data directory, including through a linked canonical path, is refused.</li>
        <li>The dashboard, including passwordless mode, is reachable only on loopback. Remote sessions require a local HTTPS proxy or tunnel and use secure cookies. New remote Hub links require HTTPS.</li>
        <li>Nginx log tails and deployment output use fixed byte and line limits, so large files and noisy builds cannot exhaust the daemon.</li>
        <li>Failed setup-code guesses are counted atomically under concurrent requests. A stale empty or incomplete lock left by an interrupted process is recovered instead of blocking setup.</li>
        <li>Hub pairing responses are read through a streaming 16 KiB limit and fail safely on invalid framing or stalled bodies.</li>
        <li>Routine Hub telemetry uses explicit safe projections. Certificate paths and raw nginx settings require <code>nginx.config.view</code>, and deployment diagnostics require <code>deploy.logs</code>. A credential-bearing backend host saved by an older version is omitted before transmission.</li>
        <li>Revoking Hub configuration access clears retained SSL path data. Revoking deployment-log access immediately removes diagnostics from the last deployment payload before process state is refreshed. Telemetry and commands already loading recheck the current grants before results or side-channel events are sent. Slow mutations recheck immediately before changing PM2, domains, certificates, deployments, hooks, or nginx, and queued progress is discarded when the permission revision changes. Permission refreshes run serially, so an older response cannot overwrite a newer revocation, and malformed permission maps are refused.</li>
        <li>Windows service and access-control operations pass values as separate executable arguments. Elevated commands rebuild their environment from Windows and machine values, so inherited paths and Node loader settings cannot choose the tools, service locations, or modules used after elevation. Approved dedicated Easy DevOps directories beneath <code>ProgramData</code> remain supported, while system trees and container roots are refused. The data root is normalized to Administrators ownership before service and installing-account access is applied.</li>
        <li>Dashboard updates reserve one run before checking the registry and use an atomic per-run worker claim. Persisted status, version, process ID and port fields are bounded and validated, a status file that grows after it is opened is rejected, and concurrent requests cannot launch overlapping updates.</li>
        <li>Windows Server repair stops the service before checking its wrapper, reports an unreadable wrapper without replacing it, restores the service, and no longer ends with <code>EPERM</code>. Access-denied service files appear as unknown rather than as an absent installation. Service status reports each probe failure as a warning, and deletion waits until Windows has released the service registration.</li>
      </ul>
      <DocsPagination
        prev={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
        next={{ title: "Troubleshooting", href: "/docs/troubleshooting", section: "Operations" }}
      />
    </DocPage>
  );
}
