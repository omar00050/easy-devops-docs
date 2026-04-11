import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore Easy DevOps features: Nginx management, Let's Encrypt SSL/TLS certificates (HTTP-01 & DNS-01), wildcard certs, domain reverse proxy configs, Node.js version switching, real-time dashboard, and Discord/Telegram notifications.",
  keywords: ["Nginx management", "SSL certificates", "Let's Encrypt", "DNS-01", "HTTP-01", "wildcard SSL", "domain management", "Node.js switching", "reverse proxy", "real-time dashboard", "Discord notifications", "Telegram notifications"],
  alternates: { canonical: "/docs/features" },
};

const features = [
  { icon: "🌐", title: "Nginx Management", desc: "Start, stop, reload, and view error logs. Built-in config editor. Automatic installation via apt-get (Linux) or winget (Windows)." },
  { icon: "🔑", title: "SSL Certificates", desc: "Issue and renew Let's Encrypt certs via acme-client. Supports HTTP-01, DNS-01, wildcard certs, and expiry tracking with color-coded status badges." },
  { icon: "🔗", title: "Domain Management", desc: "Reverse proxy configs with SSL, external URL backends, wildcard domains, WebSocket support, gzip, rate limiting, security headers, and custom timeouts." },
  { icon: "🔔", title: "Notifications", desc: "Named Discord and Telegram channels configured once and assigned per domain per event type. State-aware dispatch prevents spam — alerts fire only on status changes. Recovery notifications sent when services come back online." },
  { icon: "📦", title: "Node.js Manager", desc: "Switch Node.js versions via nvm or nvm-windows. Install/uninstall global npm packages. Update npm automatically." },
  { icon: "📋", title: "Log Viewer", desc: "Stream nginx error.log and access.log in real time via Socket.io. Toggle between logs, auto-scroll, pause/resume, and colour-coded output." },
  { icon: "💾", title: "SQLite Storage", desc: "Persistent configuration stored in a single SQLite database file in your home directory. Survives npm updates. No separate database server required." },
  { icon: "🛡️", title: "Bootstrap Installer", desc: "One-line installers for Linux and Windows that auto-detect Node.js, install nvm if needed, and register the global command." },
  { icon: "✨", title: "Themed Dashboard", desc: "Dark and light modes with 5 accent colors (teal, violet, amber, rose, cyan). Settings persist in localStorage." },
  { icon: "🔄", title: "Real-time Updates", desc: "Socket.io powered live updates: nginx status every 5 s, domain health badges every 60 s, cert expiry on connect and every 12 hours." },
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

      <h2 id="notifications" className="text-xl font-bold mt-10 mb-4 text-foreground">Notifications</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Easy DevOps can send alerts to Discord and Telegram when something goes wrong — and again when it recovers.
        Channels are registered once in <strong className="text-foreground">Settings → Notifications</strong> and then assigned to domains per event type.
      </p>
      <ul className="list-disc list-inside text-sm text-muted leading-[2] mb-6 space-y-1">
        <li><strong className="text-foreground">Named channel registry</strong> — each Discord webhook or Telegram bot gets a name and UUID. Edit or delete from the Notifications tab without touching domain configs.</li>
        <li><strong className="text-foreground">Per-domain assignment</strong> — open a domain and expand the Notifications section. Independently toggle <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">cert_expiry</code> and <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">domain_health</code>, and check which channels receive each event.</li>
        <li><strong className="text-foreground">Global nginx_down</strong> — not tied to any single domain. Fires when nginx stops running. Routes to the union of all channels configured across all domains.</li>
        <li><strong className="text-foreground">Deduplication</strong> — the state machine only fires on transitions: <em>up → down</em> sends an alert; <em>still down</em> is silent; <em>down → up</em> sends a recovery notification.</li>
        <li><strong className="text-foreground">Discord role mentions</strong> — add a message prefix (e.g. <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">&lt;@&amp;RoleId&gt;</code>) to a Discord channel. It is sent as the webhook <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">content</code> field so Discord resolves the mention correctly.</li>
        <li><strong className="text-foreground">Test button</strong> — send a live test notification from the channel list without waiting for a real event.</li>
      </ul>

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
        <li><strong className="text-foreground">Per-domain notification config</strong> — choose which channels receive cert_expiry and domain_health alerts for each domain individually</li>
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
