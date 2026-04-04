import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";

const steps = [
  {
    num: 1,
    title: "Install Easy DevOps",
    desc: "Run npm install -g easy-devops or use the bootstrap installer above.",
  },
  {
    num: 2,
    title: "Launch the CLI",
    desc: "Run easy-devops to enter the interactive menu.",
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
    desc: 'Select "Open Dashboard" from the CLI menu, then browse to http://localhost:6443 (or your configured port). Default password: admin.',
    code: { lang: "bash", text: "npx easy-devops" },
  },
];

export default function QuickstartPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Usage</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Quick Start</h1>
      <p className="text-muted text-base leading-relaxed mb-10">From zero to a working reverse proxy with SSL in five steps.</p>

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
        <p className="text-muted"><strong className="text-foreground">Tip:</strong> From the Dashboard menu, select "How to use" for a quick guide on getting started.</p>
      </div>

      <DocsPagination
        prev={{ title: "Installation", href: "/docs/installation", section: "Getting Started" }}
        next={{ title: "Command Reference", href: "/docs/commands", section: "Usage" }}
      />
    </div>
  );
}
