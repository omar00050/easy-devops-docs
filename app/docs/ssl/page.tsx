import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "SSL Manager",
  description:
    "Issue and manage Let's Encrypt SSL certificates with Easy DevOps. Supports HTTP-01, DNS-01, and wildcard certificates via acme-client — no certbot required.",
  keywords: ["SSL management", "Let's Encrypt CLI", "acme-client", "HTTP-01", "DNS-01", "wildcard SSL", "free SSL certificates", "SSL certificate automation", "easy SSL"],
  alternates: { canonical: "/docs/ssl" },
  openGraph: {
    type: "article",
    url: "/docs/ssl",
    siteName: "Easy DevOps",
    title: "SSL Manager",
    description:
      "Issue and renew Let's Encrypt certificates — HTTP-01, DNS-01 and wildcard — via acme-client, no certbot needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSL Manager",
    description:
      "Issue and renew Let's Encrypt certificates — HTTP-01, DNS-01 and wildcard — via acme-client, no certbot needed.",
  },
};

export default function SSLPage() {
  return (
    <DocPage
      section="Using the CLI"
      title="SSL Manager"
      description={
        <>
          Easy DevOps issues Let&apos;s Encrypt certificates using the pure Node.js <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acme-client</code> library — no certbot binary needed.
        </>
      }
    >

      <h2 id="challenge-methods" className="text-xl font-bold mt-10 mb-4 text-foreground">Challenge Methods</h2>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Method</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">How it works</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><MethodBadge color="green">HTTP-01</MethodBadge></td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">nginx keeps running. Every port-80 server block proxies <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">/.well-known/acme-challenge/</code> to a loopback listener Easy DevOps starts on <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acmeChallengePort</code> (8089 by default); only a graceful reload is used. Standalone mode — which stops nginx and always restores it — is the fallback for a machine where nginx is not installed or not running, or an explicit setting.</td>
            <td className="py-3 px-4 text-muted text-xs">Standard single domains and SAN certs (fastest)</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><MethodBadge color="blue">DNS-01</MethodBadge></td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">You add a <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">_acme-challenge</code> TXT record to your DNS provider; Easy DevOps waits for propagation, then confirms.</td>
            <td className="py-3 px-4 text-muted text-xs">Wildcard certs (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">*.example.com</code>) and domains behind a firewall</td>
          </tr>
        </tbody>
      </table>

      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-lg p-4 text-sm text-muted mb-10 dark:bg-yellow-500/8 dark:border-yellow-500/20">
        💡 <strong className="text-foreground">Wildcard certificates</strong> (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">*.example.com</code>) <strong className="text-foreground">require DNS-01</strong>. HTTP-01 issuance for a wildcard is refused.
      </div>

      <h2 id="automatic-renewal" className="text-xl font-bold mt-10 mb-4 text-foreground">Automatic Renewal</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">The background service (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">ezz service install</code>) renews certificates on its own, so nothing has to be open. Without the service, the same job runs while the dashboard is open.</p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">HTTP-01 certificates are renewed 7 days before they expire.</strong> Change the window (1–30 days) or switch it off in Settings, in the dashboard or the CLI.</li>
        <li><strong className="text-foreground">nginx is never stopped by an unattended renewal.</strong> It uses proxy mode only, then reloads nginx so the new certificate is the one being served.</li>
        <li><strong className="text-foreground">A renewal keeps the certificate&apos;s names.</strong> One issued with <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">www</code> is renewed with <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">www</code>.</li>
        <li><strong className="text-foreground">DNS-01 certificates (every wildcard) are not renewed automatically.</strong> They need a TXT record you add at your DNS provider. They keep getting the expiry warning, which says a manual renewal is needed.</li>
        <li><strong className="text-foreground">Certificates no enabled domain uses are left alone,</strong> so a leftover cannot spend Let&apos;s Encrypt&apos;s failure budget.</li>
        <li><strong className="text-foreground">You are notified either way</strong> — &quot;renewed&quot; or &quot;renewal failed, and why&quot; — on the channels set for that domain&apos;s certificate-expiry event. The job runs every 12 hours and once at every daemon start; a failed attempt is not retried sooner than <strong className="text-foreground">6 hours</strong> after the previous one, so a restart loop cannot burn Let&apos;s Encrypt&apos;s failed-validation budget.</li>
      </ul>

      <h3 id="renewal-state" className="text-base font-bold mt-8 mb-3 text-foreground">What each certificate&apos;s plan is</h3>
      <p className="text-muted text-sm leading-relaxed mb-4">
        <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">GET /api/ssl</code> reports a plan for every certificate, and the SSL page shows it next to the expiry badge:
      </p>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Plan</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-green-500">auto</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">HTTP-01, used by an enabled domain, renewal switched on. Renewed in the background inside the window, with the last attempt recorded.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-yellow-500">manual</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Validated over DNS-01 (every wildcard). It needs a TXT record a person adds, so it is never renewed unattended; the expiry warning says so.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-muted">unused</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">No enabled domain serves it. Left alone, so a leftover cannot spend the failure budget.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-muted">off</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The certificate would qualify, but <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sslAutoRenew</code> is off. Only the expiry warning remains.</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Setting</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Default</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sslAutoRenew</code></td>
            <td className="py-3 px-4 text-muted">true</td>
            <td className="py-3 px-4 text-muted text-xs">Renew HTTP-01 certificates in the background.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sslAutoRenewDays</code></td>
            <td className="py-3 px-4 text-muted">7</td>
            <td className="py-3 px-4 text-muted text-xs">How many days before expiry to renew (1–30).</td>
          </tr>
        </tbody>
      </table>

      <h2 id="certificate-status" className="text-xl font-bold mt-10 mb-4 text-foreground">Certificate Status</h2>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Status</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Badge</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Healthy</td>
            <td className="py-3 px-4"><SSLBadge color="green">VALID</SSLBadge></td>
            <td className="py-3 px-4 text-muted text-xs">Expires in &gt; 30 days.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Expiring</td>
            <td className="py-3 px-4"><SSLBadge color="yellow">EXPIRING</SSLBadge></td>
            <td className="py-3 px-4 text-muted text-xs">Expires in 10–30 days. Renew soon.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Critical</td>
            <td className="py-3 px-4"><SSLBadge color="red">CRITICAL</SSLBadge></td>
            <td className="py-3 px-4 text-muted text-xs">Expires in &lt; 10 days. Immediate action needed.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="suggestion" className="text-xl font-bold mt-10 mb-4 text-foreground">Certificate suggestion</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">
        Adding a domain with SSL off does not make you retype a certificate path. The form asks the
        dashboard for a suggestion and shows the certificate it found, with the match it used:
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Match</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Why it was chosen</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-primary">exact</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The certificate directory is named after the domain — how every certificate issued here is stored.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-primary">san</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">One of the certificate&apos;s names is the domain itself (for example a certificate issued for <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">example.com</code> that lists <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">api.example.com</code>).</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-primary">wildcard</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">A name like <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">*.example.com</code> covers the domain — exactly one label, because it does not cover <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">a.b.example.com</code>.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-muted text-sm leading-relaxed mb-10">
        Exact beats SAN beats wildcard, and among wildcards the most specific suffix wins. A
        certificate that cannot be read is never suggested. The suggestion is a form value only: the
        paths are written when you save the domain. The lookup is{" "}
        <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">GET /api/domains/:name/ssl-suggestion</code>.
      </p>

      <h2 id="deletion" className="text-xl font-bold mt-10 mb-4 text-foreground">Deleting a certificate</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">
        The SSL page offers <strong className="text-foreground">Delete</strong> on a certificate whose
        files cannot be read (the <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">error</code>{" "}
        state), which is how a leftover or broken certificate folder is cleaned up. The same removal
        is available for any certificate through the API and from the Hub. It removes the
        certificate&apos;s directory (fullchain, private key and metadata) and cannot be undone.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li><strong className="text-foreground">Refused while an enabled domain still uses it.</strong> The answer names the nginx config files and line numbers that reference it, so you can disable SSL on those domains (or remove the lines) first. Nothing is deleted on a refusal.</li>
        <li>Deleting certificate files never edits nginx for you — that is the point of the refusal.</li>
        <li>API: <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">DELETE /api/ssl/:domain</code>. From the Hub the same action needs the <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">ssl.delete</code> permission.</li>
      </ul>

      <h2 id="file-structure" className="text-xl font-bold mt-10 mb-4 text-foreground">Certificate File Structure</h2>
      <CodeBlock lang="text" filename="Certificate paths">{`{sslDir}/{domain}/fullchain.pem          ← Certificate chain
{sslDir}/{domain}/privkey.pem            ← Private key
{sslDir}/{domain}/ez-cert.json           ← How it was validated (proxy, standalone or DNS-01)
{sslDir}/.account/account.key            ← ACME account key (reused across issuances)`}</CodeBlock>
      <p className="text-xs text-muted mt-[-16px] mb-10"><strong className="text-foreground">Defaults:</strong> Linux <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">/etc/easy-devops/ssl/</code> · Windows <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">C:\easy-devops\ssl\</code></p>

      <DocsPagination
        prev={{ title: "Command Reference", href: "/docs/commands", section: "Using the CLI" }}
        next={{ title: "Deployments", href: "/docs/deployments", section: "Using the CLI" }}
      />
    </DocPage>
  );
}

function MethodBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const cls = color === "green"
    ? "bg-green-500/12 text-green-500 border-green-500/25"
    : "bg-blue-500/12 text-blue-500 border-blue-500/25";
  return <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-bold border rounded ${cls}`}>{children}</span>;
}

function SSLBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const map: Record<string, string> = {
    green: "bg-green-500/12 text-green-500 border-green-500/25",
    yellow: "bg-yellow-500/12 text-yellow-500 border-yellow-500/25",
    red: "bg-red-500/12 text-red-500 border-red-500/25",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-bold border rounded ${map[color]}`}>{children}</span>;
}
