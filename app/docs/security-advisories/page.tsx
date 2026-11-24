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
      <h2 id="v1-4-4" className="text-xl font-bold mb-4">1.4.4 security update</h2>
      <p className="text-sm leading-relaxed mb-4">
        <strong>1.4.3 is affected and is not recommended.</strong> Its Windows Server permission change
        makes updating especially important on shared servers. Earlier releases may share some issues.
        The audit covered 1.4.3.
      </p>
      <h3 id="upgrade" className="text-lg font-bold mt-8 mb-3">How to upgrade</h3>
      <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
        <li>For an npm installation, run <code>ezz update</code>. For a source installation, update the checkout that runs the service to the 1.4.4 release. Confirm the CLI banner shows 1.4.4 or later.</li>
        <li>In Windows Server mode, after updating, open PowerShell as Administrator and run <code>ezz service repair</code> to apply the new service protections.</li>
      </ol>
      <p className="text-sm leading-relaxed mt-4">For a custom Windows nginx or SSL directory, an administrator must also set the matching machine environment variable, <code>EASY_DEVOPS_APPROVED_NGINX_DIR</code> or <code>EASY_DEVOPS_APPROVED_SSL_DIR</code>, to its existing absolute directory before repair.</p>
      <h3 id="fixes" className="text-lg font-bold mt-8 mb-3">What changed</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
        <li>Deployments write PM2 configuration and release metadata without following links in the checkout.</li>
        <li>Windows service permission changes validate the selected directories and pass their paths directly to the permissions tool.</li>
        <li>Editing raw Advanced nginx settings through the Hub requires <code>nginx.config.edit</code>. Structured domain fields reject characters that could introduce extra directives.</li>
        <li>Changing the repository origin clears the saved deployment token. Supply a new token if the new repository needs one.</li>
        <li>Site and ACME account private keys have restricted permissions. Renewal replaces keys atomically. Renewal and repair correct existing key permissions.</li>
        <li>Git credentials stay out of deployment command arguments and logs.</li>
        <li>The daemon uses dependencies from its own runtime and disables optional native WebSocket modules.</li>
        <li>Linux service installation uses private temporary storage for the systemd unit.</li>
        <li>The updater checks the full version string before stopping the service.</li>
      </ul>
      <DocsPagination
        prev={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
        next={{ title: "Troubleshooting", href: "/docs/troubleshooting", section: "Operations" }}
      />
    </DocPage>
  );
}
