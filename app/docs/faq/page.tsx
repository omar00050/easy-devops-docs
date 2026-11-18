import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import Accordion from "@/components/Accordion";

export const metadata: Metadata = {
  title: "FAQ & Troubleshooting",
  description:
    "Frequently asked questions and troubleshooting guide for Easy DevOps CLI — installation issues, password changes, SSL port conflicts, and more.",
  keywords: ["Easy DevOps FAQ", "Easy DevOps troubleshooting", "DevOps CLI common issues", "SSL port 80 in use", "command not found"],
  alternates: { canonical: "/docs/faq" },
  openGraph: {
    type: "article",
    url: "/docs/faq",
    siteName: "Easy DevOps",
    title: "FAQ & Troubleshooting",
    description:
      "Answers and fixes for common Easy DevOps problems — install errors, password resets, SSL port conflicts and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ & Troubleshooting",
    description:
      "Answers and fixes for common Easy DevOps problems — install errors, password resets, SSL port conflicts and more.",
  },
};

const faqSchemaData = [
  {
    question: '"ezz: command not found" or "easy-devops: command not found" after install?',
    answer: "Open a new terminal so the PATH can update. If it still fails, run npm bin -g and add the output directory to your PATH. For Linux users with permission issues, prefix the install command with sudo. Both ezz and easy-devops are registered as bin aliases — either one will launch the CLI.",
  },
  {
    question: "There is no default password. How does the first login work?",
    answer: "A fresh dashboard has no password and no built-in account. The first visit shows a setup screen: set a password, which requires the one-time setup code printed in the server's terminal or service log (six digits, 24 hours; ezz dashboard setup-code issues a new one), or choose no-password mode. No-password mode is offered only when the dashboard listens on 127.0.0.1 and the request comes from this machine.",
  },
  {
    question: "How do I change or reset the dashboard password?",
    answer: "From the dashboard: Settings → Access and authentication, then set a new password. From the CLI: Settings → Dashboard Auth, then Password. The new password is stored as a scrypt hash (the old plain-text field is migrated and cleared). No old password is required from the CLI. If the dashboard is in no-password mode, choosing Password again sets one.",
  },
  {
    question: 'SSL issuance fails with a "port 80 in use" error.',
    answer: "You do not need to stop nginx for HTTP-01. In the default proxy mode nginx keeps running and forwards /.well-known/acme-challenge/ to a loopback listener Easy DevOps starts on acmeChallengePort (8089). If a local preflight fails, the usual cause is outside Easy DevOps: the domain's DNS does not point here, port 80 is blocked by a firewall, an AAAA record points elsewhere, or a CDN intercepts the path. Standalone mode (which stops nginx and always restores it) is only a fallback when nginx is not running, or an explicit setting. DNS-01 avoids port 80 entirely.",
  },
  {
    question: "What is acmeEmail and why is it required?",
    answer: "The acmeEmail setting registers your ACME account with Let's Encrypt. Issuance is refused until one is set — Let's Encrypt uses it for account recovery and expiry notices. Set it in Settings before issuing certificates.",
  },
  {
    question: "Can I use Easy DevOps on macOS?",
    answer: "Not as a supported server platform. src/core/platform.js has exactly two branches, Windows and everything else; there is no darwin branch anywhere in src/. The CLI and dashboard can start and use ~/.config/easy-devops, but ezz service install resolves to a systemd unit on every non-Windows platform, and nginx control is built as sudo -n /usr/bin/systemctl ... nginx with a sudoers rule for /usr/bin/systemctl — neither exists on macOS, which uses launchd. Treat macOS as unsupported for the service and for nginx control.",
  },
  {
    question: "How do I run the dashboard directly without the CLI menu?",
    answer: "Run ezz --dash to start it in the foreground and print its URL. From a source checkout, npm run dashboard starts the Express + Socket.io server directly. Access it at http://127.0.0.1:6443 (Linux default) or your configured port and bind address. Alternatively, run ezz and select Open Dashboard from the main menu.",
  },
  {
    question: "Wildcard domains — why is DNS-01 the only option?",
    answer: "Let's Encrypt does not support HTTP-01 for wildcard certificates. DNS-01 is the only validation method that can prove control of *.domain.com, so HTTP-01 issuance for a wildcard is refused. Wildcard certificates are also never renewed automatically: they need a TXT record a person adds, so they keep the expiry warning instead.",
  },
  {
    question: "Where is the data stored?",
    answer: "The database lives in a persistent directory that survives npm updates — Linux and other non-Windows platforms: ~/.config/easy-devops/easy-devops.sqlite, Windows personal: %APPDATA%\\easy-devops\\easy-devops.sqlite, Windows Server mode: C:\\ProgramData\\easy-devops\\easy-devops.sqlite. SSL certificates are stored under sslDir (default: /etc/easy-devops/ssl/ on Linux, C:\\easy-devops\\ssl\\ on Windows). A v1.0.x package-relative database is copied in once on first run.",
  },
  {
    question: 'Dashboard says the Linux permissions are not configured on nginx start/stop/reload.',
    answer: 'The dashboard runs headless, so sudo cannot prompt there — and it never asks for your password. Open Settings → Linux Permissions in the dashboard to see the exact commands and copy them into a terminal, where sudo asks you. The CLI route is Settings → Setup Linux Permissions. The rule written to /etc/sudoers.d/easy-devops grants exactly five commands: /usr/bin/systemctl start|stop|reload|restart|status nginx. Nothing else, and no wildcards.',
  },
  {
    question: 'Is an "nginx config test failed" message wrong when it also says "syntax is ok"?',
    answer: 'A non-root nginx -t can print "syntax is ok" and still exit non-zero because it cannot write /run/nginx.pid. The config may be valid. Easy DevOps checks the output text as well as the exit code, so it reports that case correctly. It always runs nginx -t without sudo: the test is read-only.',
  },
  {
    question: "Why does the dashboard warn that PM2 is not installed?",
    answer: "PM2 runs your deployed apps, and Easy DevOps does not install it. There is no PM2 install button in the dashboard: install it yourself with npm install -g pm2. The Processes page reports whether PM2 is present and lists its apps; the Deployments page links there and tells you the command when it is missing.",
  },
];

export default function FAQPage() {
  const items = faqSchemaData;

  return (
    <DocPage
      section="Help"
      title="FAQ & Troubleshooting"
      description="Answers to common questions and known issues."
    >
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

      <Accordion items={items} />

      <div className="mt-10 bg-surface border border-border rounded-xl p-6 text-sm">
        <p className="text-muted">Still need help? <a href="https://github.com/omar00050/Easy-DevOps/issues" target="_blank" className="text-primary hover:underline font-medium">Open an issue on GitHub</a> or reach out for support.</p>
      </div>

      <DocsPagination
        prev={{ title: "Platform Support", href: "/docs/platform", section: "Reference" }}
      />
    </DocPage>
  );
}
