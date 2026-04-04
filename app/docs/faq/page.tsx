import DocsPagination from "@/components/DocsPagination";
import Accordion from "@/components/Accordion";

export default function FAQPage() {
  const items = [
    {
      question: '"easy-devops: command not found" after install?',
      answer: <>Open a new terminal so the PATH can update. If it still fails, run <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">npm bin -g</code> and add the output directory to your PATH. For Linux users with permission issues, prefix the install command with <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sudo</code>.</>,
    },
    {
      question: "How do I change the dashboard password?",
      answer: <>From the CLI, select <strong>Settings</strong> from the main menu, then set a new password. This updates <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">dashboardPassword</code> in the SQLite database and takes effect immediately.</>,
    },
    {
      question: 'SSL issuance fails with a "port 80 in use" error.',
      answer: <>HTTP-01 validation requires exclusive access to port 80. Stop nginx before issuing a certificate (<code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">Nginx Manager → Stop</code>), then retry. After issuance, Easy DevOps will restart nginx automatically. Alternatively, use DNS-01 which does not require stopping nginx.</>,
    },
    {
      question: "What is acmeEmail and why is it required?",
      answer: <>The <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">acmeEmail</code> setting registers your ACME account with Let's Encrypt. It is required for certificate issuance — Let's Encrypt uses it to send expiry notifications and account recovery. Set it in <strong>Settings</strong> before issuing certificates.</>,
    },
    {
      question: "Can I use Easy DevOps on macOS?",
      answer: <>Yes — the <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">install.sh</code> script works on macOS. However, the primary tested platforms are Linux and Windows. Community contributions for macOS-specific features are welcome.</>,
    },
    {
      question: "How do I run the dashboard directly without the CLI menu?",
      answer: <>From the project directory, run <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">npm run dashboard</code>. This starts the Express + Socket.io server directly. Access it at <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">http://localhost:6443</code> (or your configured port).</>,
    },
    {
      question: "Wildcard domains — why is DNS-01 the only option?",
      answer: <>Let's Encrypt does not support HTTP-01 for wildcard certificates. DNS-01 is the only validation method that can prove control of <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">*.domain.com</code>. Easy DevOps automatically disables HTTP-01 when you enable the wildcard option on a domain.</>,
    },
    {
      question: "Where is the data stored?",
      answer: <>All configuration lives in <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">data/easy-devops.sqlite</code> at the project root. SSL certificates are stored under <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sslDir</code> (default: <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">/etc/easy-devops/ssl/</code> on Linux, <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">C:\easy-devops\ssl\</code> on Windows). Nginx config files are generated to <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">nginxDir/sites-available/</code> and symlinked to <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">sites-enabled/</code>.</>,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Help</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">FAQ &amp; Troubleshooting</h1>
      <p className="text-muted text-base leading-relaxed mb-10">Answers to common questions and known issues.</p>

      <Accordion items={items} />

      <div className="mt-10 bg-surface border border-border rounded-xl p-6 text-sm">
        <p className="text-muted">Still need help? <a href="https://github.com/omar00050/Easy-DevOps/issues" target="_blank" className="text-primary hover:underline font-medium">Open an issue on GitHub</a> or reach out for support.</p>
      </div>

      <DocsPagination
        prev={{ title: "Platform Support", href: "/docs/platform", section: "Reference" }}
      />
    </div>
  );
}
