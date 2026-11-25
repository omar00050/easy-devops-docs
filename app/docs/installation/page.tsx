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
