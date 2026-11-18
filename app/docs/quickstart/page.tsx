import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";
import InstallJourney from "@/components/InstallJourney";

export const metadata: Metadata = {
  title: "Quick Start",
  description:
    "Get from zero to a working reverse proxy with SSL in five steps. Quick start guide for Easy DevOps CLI.",
  keywords: ["Easy DevOps quick start", "DevOps tutorial", "get started DevOps", "Nginx setup guide", "SSL setup guide"],
  alternates: { canonical: "/docs/quickstart" },
  openGraph: {
    type: "article",
    url: "/docs/quickstart",
    siteName: "Easy DevOps",
    title: "Quick Start",
    description: "From zero to a live reverse proxy with SSL in five steps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Start",
    description: "From zero to a live reverse proxy with SSL in five steps.",
  },
};

const steps = [
  {
    num: 1,
    title: "Install Easy DevOps",
    desc: "Run `npm install -g easy-devops`, or use the one-line installer on the Installation page.",
  },
  {
    num: 2,
    title: "Launch the CLI",
    desc: "Run `ezz` (the short alias) or `easy-devops` to enter the interactive menu.",
  },
  {
    num: 3,
    title: "Configure Settings",
    desc: "Go to Settings → set your nginxDir, sslDir, and acmeEmail (required for Let's Encrypt).",
  },
  {
    num: 4,
    title: "Add a Domain",
    desc: 'Select "Domain Manager" → Add Domain. Enter your domain name, select a backend host:port, enable SSL, and configure options like gzip or rate limiting.',
  },
  {
    num: 5,
    title: "Start the Dashboard (optional)",
    desc: 'Select "Open Dashboard" from the CLI menu, then browse to http://127.0.0.1:6443 (the Linux default bind; Windows defaults to every interface). There is no default password: the first visit shows a setup screen, where you either set a password using the one-time setup code printed in the server terminal or service log (`ezz dashboard setup-code` issues a fresh one), or choose no-password mode — offered only when the dashboard listens on this machine only.',
    code: { lang: "bash", text: "easy-devops\n# or the short alias:\nezz" },
  },
];

export default function QuickstartPage() {
  return (
    <DocPage
      section="Getting Started"
      title="Quick Start"
      description="From a fresh server to a live site — the whole path, then the short version."
    >

      <h2 id="the-path" className="text-xl font-bold mt-10 mb-4 text-foreground">The path from install to a running fleet</h2>
      <p className="text-muted text-sm leading-relaxed mb-2">
        Every install follows the same arc: install it, point it at nginx, put a site online, deploy an app,
        then let it keep watch. This is the whole journey; the short version is right below it.
      </p>
      <InstallJourney />

      <h2 id="the-short-version" className="text-xl font-bold mt-10 mb-4 text-foreground">The short version</h2>

      <div className="space-y-4 mb-10">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-5 bg-surface border border-border rounded-xl p-6 hover:border-primary/25 transition-colors duration-200">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              {step.num}
            </div>
            <div>
              <h3 className="text-base font-bold mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.desc.split(/(`[^`]+`)/g).map((part, j) =>
                  part.startsWith("`") && part.endsWith("`") ? (
                    <code key={j} className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded mx-0.5">{part.slice(1, -1)}</code>
                  ) : (
                    part
                  )
                )}
              </p>
              {step.code && (
                <div className="mt-3">
                  <CodeBlock lang={step.code.lang} filename="terminal">{step.code.text}</CodeBlock>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/[0.06] border border-primary/20 rounded-xl p-5 text-sm">
        <p className="text-muted"><strong className="text-foreground">Tip:</strong> From the CLI's Open Dashboard menu, select "How to use" for a quick guide on getting started.</p>
      </div>

      <DocsPagination
        prev={{ title: "Installation", href: "/docs/installation", section: "Getting Started" }}
        next={{ title: "CLI Interface", href: "/docs/cli", section: "Using the CLI" }}
      />
    </DocPage>
  );
}
