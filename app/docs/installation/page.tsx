import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import InstallTabs from "@/components/InstallTabs";
import DocPage from "@/components/DocPage";
import SecurityUpdateNotice from "@/components/SecurityUpdateNotice";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Install Easy DevOps on Linux or Windows with npm or a release-pinned bootstrap checkout.",
  keywords: ["Easy DevOps install", "install DevOps CLI", "npm install easy-devops", "DevOps installer Linux", "DevOps installer Windows"],
  alternates: { canonical: "/docs/installation" },
  openGraph: {
    type: "article",
    url: "/docs/installation",
    siteName: "Easy DevOps",
    title: "Installation",
    description:
      "Install on Linux or Windows with npm or a release-pinned bootstrap checkout.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Installation",
    description:
      "Install on Linux or Windows with npm or a release-pinned bootstrap checkout.",
  },
};

export default function InstallationPage() {
  return (
    <DocPage
      section="Getting Started"
      title="Installation"
      description="Use npm when Node.js is ready, or run the reviewed bootstrap from a release-pinned checkout."
    >
      <SecurityUpdateNotice />

      <InstallTabs />

      <div className="mt-10 bg-surface border border-border rounded-xl p-6">
        <h2 id="requirements" className="text-base font-bold mb-4 text-foreground">Requirements</h2>
        <ul className="space-y-2.5 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✅</span>
            <span><strong className="text-foreground">Node.js 18+</strong> (with npm)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✅</span>
            <span><strong className="text-foreground">Linux</strong> (Debian/Ubuntu etc.) or <strong className="text-foreground">Windows</strong>. macOS is not a supported server platform — see <a href="/docs/platform" className="text-primary hover:underline">Platform Support</a>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">⚠️</span>
            <span><strong className="text-foreground">Windows:</strong> no Administrator terminal is needed for normal use. Only <strong className="text-foreground">Server mode</strong> (the real Windows service, the default on a Windows Server edition) needs one UAC consent for the service step; the installer raises it for you. You are never asked for a password.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">➕</span>
            <span>Bootstrap installs require <strong className="text-foreground">git</strong> and do not download mutable helper scripts. If a Node runtime change is needed, nvm or nvm-windows must already be installed from a reviewed release.</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 bg-surface border border-border rounded-xl p-6">
        <h2 id="pm2" className="text-base font-bold mb-4 text-foreground">PM2 (optional)</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          The installer offers PM2 when it is missing — after Easy DevOps is installed and{" "}
          <em>before</em> the background-service question, because PM2 is what runs the apps. Nothing
          is installed silently: the default answer is <strong className="text-foreground">No</strong>,
          and a session with no terminal prints the command instead of asking.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4">
          One model only: the standard PM2, installed globally with the npm that just installed Easy
          DevOps, as the account running the installer, into that account&apos;s prefix and its usual{" "}
          <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">PM2_HOME</code>{" "}
          (for example <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">C:\Users\admin\.pm2</code>).
          No PM2 home of Easy DevOps, no second copy, no daemon started by the installer, and no
          existing app is moved, restarted or touched. A failed PM2 install never fails the Easy
          DevOps install: the reason and the exact command are printed.
        </p>
        <table className="w-full text-sm border-collapse mb-4">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Installer</th>
              <th className="text-left py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Install without asking</th>
              <th className="text-left py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Never install, never ask</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5 px-3 font-mono text-xs text-primary whitespace-nowrap">install.sh</td>
              <td className="py-2.5 px-3 font-mono text-xs text-foreground">--pm2</td>
              <td className="py-2.5 px-3 font-mono text-xs text-foreground">--no-pm2</td>
            </tr>
            <tr className="bg-primary/[0.015]">
              <td className="py-2.5 px-3 font-mono text-xs text-primary whitespace-nowrap">install.ps1</td>
              <td className="py-2.5 px-3 font-mono text-xs text-foreground">-Pm2</td>
              <td className="py-2.5 px-3 font-mono text-xs text-foreground">-NoPm2</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-mono text-xs text-primary whitespace-nowrap">install.bat</td>
              <td className="py-2.5 px-3 font-mono text-xs text-foreground">--pm2</td>
              <td className="py-2.5 px-3 font-mono text-xs text-foreground">--no-pm2</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-muted leading-relaxed">
          <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">install.bat</code>{" "}
          translates the two dashes forms to <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">-Pm2</code>{" "}
          and <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">-NoPm2</code>{" "}
          before running PowerShell; <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">-NoPm2</code>{" "}
          wins if both are given, and <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">-NonInteractive</code>{" "}
          never asks. The dashboard can do the same later with <strong className="text-foreground">Install PM2</strong>{" "}
          on the Deployments page. On a Windows Server the installer says that the PM2 it just installed
          belongs to your account and that the service cannot use another account&apos;s PM2 — see{" "}
          <a href="/docs/pm2-windows-server" className="text-primary hover:underline">PM2 on Windows Server</a>.
        </p>
      </div>

      <div className="mt-6 bg-surface border border-border rounded-xl p-6 text-sm">
        <p className="text-muted">
          Install stopped half way, or a UAC prompt said{" "}
          <strong className="text-foreground">Unknown publisher</strong>?{" "}
          <a href="/docs/troubleshooting" className="text-primary hover:underline font-medium">Troubleshooting</a>{" "}
          lists the known install problems, each with its cause and fix.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Features", href: "/docs/features", section: "Getting Started" }}
        next={{ title: "Quick Start", href: "/docs/quickstart", section: "Getting Started" }}
      />
    </DocPage>
  );
}
