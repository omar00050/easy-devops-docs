import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import Accordion from "@/components/Accordion";

const SITE_URL = "https://easy-devops.devxor.team";

export const metadata: Metadata = {
  title: "FAQ & Troubleshooting",
  description:
    "Frequently asked questions and troubleshooting guide for Easy DevOps CLI — installation issues, password changes, SSL port conflicts, and more.",
  keywords: ["Easy DevOps FAQ", "Easy DevOps troubleshooting", "DevOps CLI common issues", "SSL port 80 in use", "command not found"],
  alternates: { canonical: "/docs/faq" },
};

const faqSchemaData = [
  {
    question: '"ezz: command not found" or "easy-devops: command not found" after install?',
    answer: "Open a new terminal so the PATH can update. If it still fails, run npm bin -g and add the output directory to your PATH. For Linux users with permission issues, prefix the install command with sudo. Both ezz and easy-devops are registered as bin aliases — either one will launch the CLI.",
  },
  {
    question: "How do I change the dashboard password?",
    answer: "From the CLI, select Settings from the main menu, then set a new password. This updates dashboardPassword in the SQLite database and takes effect immediately.",
  },
  {
    question: 'SSL issuance fails with a "port 80 in use" error.',
    answer: "HTTP-01 validation requires exclusive access to port 80. Stop nginx before issuing a certificate (Nginx Manager → Stop), then retry. After issuance, Easy DevOps will restart nginx automatically. Alternatively, use DNS-01 which does not require stopping nginx.",
  },
  {
    question: "What is acmeEmail and why is it required?",
    answer: "The acmeEmail setting registers your ACME account with Let's Encrypt. It is required for certificate issuance — Let's Encrypt uses it to send expiry notifications and account recovery. Set it in Settings before issuing certificates.",
  },
  {
    question: "Can I use Easy DevOps on macOS?",
    answer: "Yes — the install.sh script works on macOS. However, the primary tested platforms are Linux and Windows. Community contributions for macOS-specific features are welcome.",
  },
  {
    question: "How do I run the dashboard directly without the CLI menu?",
    answer: "From the project directory, run npm run dashboard. This starts the Express + Socket.io server directly. Access it at http://localhost:6443 (or your configured port). Alternatively, run ezz and select 'Open Dashboard' from the main menu.",
  },
  {
    question: "Wildcard domains — why is DNS-01 the only option?",
    answer: "Let's Encrypt does not support HTTP-01 for wildcard certificates. DNS-01 is the only validation method that can prove control of *.domain.com. Easy DevOps automatically disables HTTP-01 when you enable the wildcard option on a domain.",
  },
  {
    question: "Where is the data stored?",
    answer: "Since v1.2.1, the database lives in a persistent user directory that survives npm updates — Linux/macOS: ~/.config/easy-devops/easy-devops.sqlite, Windows: %APPDATA%\\easy-devops\\easy-devops.sqlite. SSL certificates are stored under sslDir (default: /etc/easy-devops/ssl/ on Linux, C:\\easy-devops\\ssl\\ on Windows). If upgrading from v1.0.x, the database is migrated automatically on first run.",
  },
  {
    question: 'Dashboard shows "Linux permissions not configured" on nginx start/stop/reload.',
    answer: 'The dashboard runs headless (no terminal), so sudo cannot prompt for a password. You need to configure NOPASSWD sudoers rules once. From the CLI: Settings → Setup Linux Permissions. From the dashboard: Settings → Linux Permissions card → enter your password → Setup Permissions. This writes /etc/sudoers.d/easy-devops with NOPASSWD rules for systemctl and the nginx binary.',
  },
  {
    question: '"nginx config test failed" even though the config looks correct (shows "syntax is ok").',
    answer: 'When nginx -t is run as a non-root user, it prints "syntax is ok" then tries to write /run/nginx.pid — which requires root — causing it to exit with code 1. The config is actually valid. Easy DevOps v1.2.1+ handles this correctly: it checks the output text for "syntax is ok" rather than relying on the exit code alone. If you see this on an older version, upgrade to v1.2.1.',
  },
  {
    question: 'Why does Easy DevOps run nginx -t without sudo?',
    answer: 'nginx -t only reads configuration files, which are world-readable (644 permissions). It never needs root to validate syntax. Running it with sudo was the source of "a terminal is required" errors in the dashboard. Since v1.2.1, sudo has been removed from all nginx -t calls on every platform.',
  },
];

export default function FAQPage() {
  const items = faqSchemaData;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqSchemaData.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
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
