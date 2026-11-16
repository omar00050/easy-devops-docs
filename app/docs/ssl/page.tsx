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
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">nginx keeps running and forwards the ACME challenge to Easy DevOps (proxy mode). Only when nginx is not running, or is not serving port 80, does Easy DevOps bind port 80 itself (standalone mode).</td>
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
        💡 <strong className="text-foreground">Wildcard certificates</strong> (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">*.example.com</code>) <strong className="text-foreground">require DNS-01</strong>. HTTP-01 is automatically disabled for wildcard domains.
      </div>

      <h2 id="automatic-renewal" className="text-xl font-bold mt-10 mb-4 text-foreground">Automatic Renewal</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">The background service (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">ezz service install</code>) renews certificates on its own, so nothing has to be open. Without the service, the same job runs while the dashboard is open.</p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">HTTP-01 certificates are renewed 7 days before they expire.</strong> Change the window (1–30 days) or switch it off in Settings, in the dashboard or the CLI.</li>
        <li><strong className="text-foreground">nginx is never stopped by an unattended renewal.</strong> It uses proxy mode only, then reloads nginx so the new certificate is the one being served.</li>
        <li><strong className="text-foreground">A renewal keeps the certificate&apos;s names.</strong> One issued with <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">www</code> is renewed with <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">www</code>.</li>
        <li><strong className="text-foreground">DNS-01 certificates (every wildcard) are not renewed automatically.</strong> They need a TXT record you add at your DNS provider. They keep getting the expiry warning, which says a manual renewal is needed.</li>
        <li><strong className="text-foreground">Certificates no enabled domain uses are left alone,</strong> so a leftover cannot spend Let&apos;s Encrypt&apos;s failure budget.</li>
        <li><strong className="text-foreground">You are notified either way</strong> — &quot;renewed&quot; or &quot;renewal failed, and why&quot; — on the channels set for that domain&apos;s certificate-expiry event. A failed attempt is retried on the next check, every 12 hours.</li>
      </ul>
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

      <h2 id="file-structure" className="text-xl font-bold mt-10 mb-4 text-foreground">Certificate File Structure</h2>
      <CodeBlock lang="text" filename="Certificate paths">{`{sslDir}/{domain}/fullchain.pem          ← Certificate chain
{sslDir}/{domain}/privkey.pem            ← Private key
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
