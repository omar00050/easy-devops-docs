import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";

export default function SSLPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Usage</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">SSL Manager</h1>
      <p className="text-muted text-base leading-relaxed mb-10">Easy DevOps issues Let's Encrypt certificates using the pure Node.js <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acme-client</code> library — no certbot binary needed.</p>

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
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Easy DevOps stops nginx, binds port 80, serves the ACME challenge token, then restarts nginx.</td>
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
        prev={{ title: "Command Reference", href: "/docs/commands", section: "Usage" }}
        next={{ title: "Dashboard API", href: "/docs/api", section: "Reference" }}
      />
    </div>
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
