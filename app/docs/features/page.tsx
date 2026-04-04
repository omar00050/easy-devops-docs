import DocsPagination from "@/components/DocsPagination";

const features = [
  { icon: "🌐", title: "Nginx Management", desc: "Start, stop, reload, and view error logs. Built-in config editor. Automatic installation via apt-get (Linux) or winget (Windows)." },
  { icon: "🔑", title: "SSL Certificates", desc: "Issue and renew Let's Encrypt certs via acme-client. Supports HTTP-01, DNS-01, wildcard certs, and expiry tracking with color-coded status badges." },
  { icon: "🔗", title: "Domain Management", desc: "Reverse proxy configs with SSL, external URL backends, wildcard domains, WebSocket support, gzip, rate limiting, security headers, and custom timeouts." },
  { icon: "📦", title: "Node.js Manager", desc: "Switch Node.js versions via nvm or nvm-windows. Install/uninstall global npm packages. Update npm automatically." },
  { icon: "🔄", title: "Real-time Updates", desc: "Socket.io powered status updates in the web dashboard. Nginx status streams in real time." },
  { icon: "💾", title: "SQLite Storage", desc: "Persistent configuration stored in a single SQLite database file. No separate database server required." },
  { icon: "🛡️", title: "Bootstrap Installer", desc: "One-line installers for Linux and Windows that auto-detect Node.js, install nvm if needed, and register the global command." },
  { icon: "✨", title: "Themed Dashboard", desc: "Dark and light modes with 5 accent colors (teal, violet, amber, rose, cyan). Settings persist in localStorage." },
];

export default function FeaturesPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Getting Started</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Features</h1>
      <p className="text-muted text-base leading-relaxed mb-10">Everything you need to manage a production web server from one tool.</p>

      <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-12">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>

      <h2 id="domain-configuration" className="text-xl font-bold mt-10 mb-4 text-foreground">Domain Configuration Options</h2>
      <ul className="list-disc list-inside text-sm text-muted leading-[2] mb-4 space-y-1">
        <li><strong className="text-foreground">Backend:</strong> local host:port (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">127.0.0.1:3000</code>) or full external URL (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">https://app.vercel.app</code>)</li>
        <li><strong className="text-foreground">Wildcard domain</strong> (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">*.example.com</code>) — auto-enforces DNS-01 SSL validation</li>
        <li><strong className="text-foreground">SSL/HTTPS</strong> with certificate management</li>
        <li><strong className="text-foreground">WebSocket</strong> support (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">ws</code> upstream type)</li>
        <li><strong className="text-foreground">Gzip compression</strong></li>
        <li><strong className="text-foreground">Rate limiting</strong> (requests/second + burst)</li>
        <li><strong className="text-foreground">Security headers</strong> (X-Frame-Options, etc.)</li>
        <li><strong className="text-foreground">Custom timeout</strong> and body size limits</li>
        <li><strong className="text-foreground">Domain-specific access logs</strong></li>
      </ul>

      <DocsPagination
        prev={{ title: "Overview", href: "/docs/overview", section: "Getting Started" }}
        next={{ title: "Installation", href: "/docs/installation", section: "Getting Started" }}
      />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.08] hover:-translate-y-[3px] group">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-11 h-11 rounded-xl bg-primary/[0.12] border border-primary/[0.15] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <p className="text-[13px] text-muted leading-relaxed">{desc}</p>
    </div>
  );
}
