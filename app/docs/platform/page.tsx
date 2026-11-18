import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Platform Support",
  description:
    "Easy DevOps platform support: full Linux and Windows support, what each Windows service mode needs, and the honest macOS support level.",
  keywords: ["DevOps Linux Windows", "cross-platform DevOps", "Nginx on Windows", "SSL on Linux", "macOS support", "DevOps compatibility"],
  alternates: { canonical: "/docs/platform" },
  openGraph: {
    type: "article",
    url: "/docs/platform",
    siteName: "Easy DevOps",
    title: "Platform Support",
    description:
      "Linux and Windows support, the two Windows service modes, and what macOS can and cannot do.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Support",
    description:
      "Linux and Windows support, the two Windows service modes, and what macOS can and cannot do.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

const rows = [
  { feature: "CLI Interface", linux: "Yes", windows: "Yes", mac: "Partially — see note" },
  { feature: "Web Dashboard", linux: "Yes", windows: "Yes", mac: "Partially — no service integration" },
  { feature: "Nginx Management", linux: "Yes", windows: "Yes", mac: "No — control assumes systemctl" },
  { feature: "SSL — HTTP-01 (acme-client)", linux: "Yes", windows: "Yes", mac: "Unverified" },
  { feature: "SSL — DNS-01 (acme-client)", linux: "Yes", windows: "Yes", mac: "Unverified" },
  { feature: "Wildcard Certificates", linux: "Yes", windows: "Yes", mac: "Unverified" },
  { feature: "Node.js Management", linux: "nvm", windows: "nvm-windows", mac: "nvm (CLI path only)" },
  { feature: "Background service", linux: "systemd unit", windows: "WinSW service or Startup launcher", mac: "Not supported" },
  { feature: "Nginx service control", linux: "sudo -n systemctl", windows: "nginx.exe direct", mac: "Not supported" },
];

export default function PlatformPage() {
  return (
    <DocPage
      section="Reference"
      title="Platform Support"
      description="Linux and Windows are the supported platforms. macOS is not a supported server platform for the service or nginx control."
    >
      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Capability</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Linux</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Windows</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">macOS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} className={i % 2 === 1 ? "bg-primary/[0.015]" : ""}>
              <td className="py-3 px-4 text-foreground font-medium text-xs">{row.feature}</td>
              <td className="py-3 px-4 text-muted text-xs">{row.linux}</td>
              <td className="py-3 px-4 text-muted text-xs">{row.windows}</td>
              <td className="py-3 px-4 text-muted text-xs">{row.mac}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-surface border border-border rounded-xl p-6 text-sm mb-6">
        <h3 className="font-bold text-foreground mb-3">Service control difference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-primary/[0.04] rounded-lg">
            <code className="font-mono text-xs text-primary font-semibold">Linux</code>
            <p className="text-muted mt-1">Uses <code className={C}>sudo -n /usr/bin/systemctl start|stop|restart|reload|status nginx</code>. Those five commands are the whole of the one-time sudoers rule; see <a href="/docs/configuration#linux-permissions" className="text-primary hover:underline">Linux permissions</a>.</p>
          </div>
          <div className="p-4 bg-primary/[0.04] rounded-lg">
            <code className="font-mono text-xs text-primary font-semibold">Windows</code>
            <p className="text-muted mt-1">Runs <code className={C}>nginx.exe</code> directly, with process management through PowerShell / <code className={C}>tasklist</code> and <code className={C}>taskkill</code>. No elevation is required.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 text-sm mb-6">
        <h3 className="font-bold text-foreground mb-3">Windows: two service modes, only one needs Administrator</h3>
        <ul className="space-y-2 text-muted list-disc list-inside">
          <li><strong className="text-foreground">Personal</strong> — a launcher in the Startup folder. Starts at logon and needs <strong className="text-foreground">no administrator rights at all</strong>. This is the default on Windows client editions.</li>
          <li><strong className="text-foreground">Server</strong> — a real Windows Service (WinSW) running as <code className={C}>NT SERVICE\EasyDevOps</code>, starting at boot. It needs <strong className="text-foreground">one Administrator/UAC consent</strong>, because it writes under <code className={C}>C:\ProgramData</code>, registers a service and sets ACLs. No password is ever asked for: Windows manages the virtual account. The installer re-launches only the service step elevated.</li>
        </ul>
        <p className="text-muted mt-3 text-xs">Server mode is the default on a Windows Server edition. It is also the only reason Administrator rights are needed anywhere in Easy DevOps.</p>
      </div>

      <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-6 text-sm mb-6">
        <h3 className="font-bold text-amber-500 mb-2">macOS is not a supported server platform</h3>
        <p className="text-muted mb-2">
          <code className={C}>src/core/platform.js</code> has exactly two branches: Windows and
          everything else. There is no <code className={C}>darwin</code> branch anywhere in
          <code className={C}>src/</code>. In practice that means:
        </p>
        <ul className="space-y-1 text-muted list-disc list-inside">
          <li>The non-Windows data directory (<code className={C}>~/.config/easy-devops</code>) and the CLI work the same way as on Linux.</li>
          <li><code className={C}>ezz service install</code> resolves to a <strong className="text-foreground">systemd unit</strong> on any non-Windows platform, so it cannot install a service on macOS.</li>
          <li>Nginx start/stop/reload is built as <code className={C}>sudo -n /usr/bin/systemctl … nginx</code>, and the sudoers setup targets <code className={C}>/usr/bin/systemctl</code> — neither exists on macOS (launchd is the service manager).</li>
          <li><code className={C}>install.sh</code> is named &quot;Linux / macOS&quot;, but its only platform-specific code is Linux. Treat macOS as a best-effort CLI/dashboard environment, not a deployment target.</li>
        </ul>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 text-sm">
        <h3 className="font-bold text-foreground mb-2">Linux: the one-time permissions setup</h3>
        <p className="text-muted mb-2">The dashboard runs headless, so <code className={C}>sudo</code> cannot prompt there. It does not ask for your password either. Open <strong>Settings → Linux Permissions</strong> in the dashboard to see the exact commands, or run <strong>Settings → Setup Linux Permissions</strong> in the CLI to have them run on your terminal where sudo can prompt.</p>
        <ul className="space-y-1 text-muted list-disc list-inside">
          <li>The rule file is <code className={C}>/etc/sudoers.d/easy-devops</code>, validated with <code className={C}>visudo -cf</code> before installation.</li>
          <li>It grants exactly five commands: <code className={C}>systemctl start|stop|reload|restart|status nginx</code>. Nothing else.</li>
          <li>The certificate directory and nginx&apos;s <code className={C}>conf.d</code> are handed to your account once by the same setup, so no runtime <code className={C}>sudo mkdir</code> or <code className={C}>sudo chown</code> is needed.</li>
          <li><code className={C}>nginx -t</code> is always run without sudo: it is read-only.</li>
        </ul>
      </div>

      <DocsPagination
        prev={{ title: "Configuration", href: "/docs/configuration", section: "Reference" }}
        next={{ title: "FAQ & Troubleshooting", href: "/docs/faq", section: "Help" }}
      />
    </DocPage>
  );
}
