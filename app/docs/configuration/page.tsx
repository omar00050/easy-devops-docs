import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Configuration",
  description:
    "Easy DevOps settings reference: dashboard port, authentication and listen address, nginx and SSL directories, ACME email, certificate renewal, deployment folder, and the Linux permissions setup.",
  keywords: ["Easy DevOps configuration", "DevOps config", "easy-devops settings", "dashboard auth", "listen address", "acmeEmail", "Linux permissions"],
  alternates: { canonical: "/docs/configuration" },
  openGraph: {
    type: "article",
    url: "/docs/configuration",
    siteName: "Easy DevOps",
    title: "Configuration",
    description:
      "Settings reference: dashboard authentication and bind address, directories, ACME email, renewal, deployments and Linux permissions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Configuration",
    description:
      "Settings reference: dashboard authentication and bind address, directories, ACME email, renewal, deployments and Linux permissions.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

export default function ConfigurationPage() {
  return (
    <DocPage
      section="Reference"
      title="Configuration"
      description="All configuration is stored in a single SQLite file in a persistent user directory — never inside the npm package folder, so it survives updates."
    >
      <div className="bg-surface border border-border rounded-xl p-5 text-sm mb-10">
        <p className="font-bold text-foreground mb-2">Database location</p>
        <ul className="space-y-1 text-muted">
          <li><span className="text-foreground font-medium">Linux (and other non-Windows platforms):</span> <code className={C}>~/.config/easy-devops/easy-devops.sqlite</code></li>
          <li><span className="text-foreground font-medium">Windows, personal:</span> <code className={C}>%APPDATA%\easy-devops\easy-devops.sqlite</code></li>
          <li><span className="text-foreground font-medium">Windows, Server mode:</span> <code className={C}>C:\ProgramData\easy-devops\easy-devops.sqlite</code> — the service account and the CLI must share one database, and a virtual service account has no <code className={C}>%APPDATA%</code> of its own.</li>
        </ul>
        <p className="text-muted mt-3 text-xs">If you are upgrading from v1.0.x, the old package-relative database is copied into the persistent directory once on first run.</p>
      </div>

      <h2 id="config-fields" className="text-xl font-bold mt-10 mb-4 text-foreground">Config Fields</h2>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Field</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Default (Linux)</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Default (Windows)</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>dashboardPort</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">6443</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">6443</td>
            <td className="py-3 px-4 text-muted">Dashboard HTTP port. Takes effect on restart.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>dashboardAuth</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">password</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">password</td>
            <td className="py-3 px-4 text-muted"><code className={C}>password</code> or <code className={C}>none</code>. <code className={C}>none</code> is honoured only while the bind address is loopback.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>dashboardBindAddress</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">127.0.0.1</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">127.0.0.1</td>
            <td className="py-3 px-4 text-muted">The dashboard listener is loopback-only. This compatibility field is normalized to <code className={C}>127.0.0.1</code>. Remote access uses a local HTTPS reverse proxy or authenticated tunnel.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>dashboardPasswordHash</code></td>
            <td className="py-3 px-4 text-muted italic">empty</td>
            <td className="py-3 px-4 text-muted italic">empty</td>
            <td className="py-3 px-4 text-muted">The scrypt hash of the dashboard password. There is no default password: it is set on the first-run screen, or later in the dashboard under Settings → Access and authentication (CLI: Settings → Dashboard Auth). The older plain-text <code className={C}>dashboardPassword</code> field is still read, and is migrated to a hash and cleared on the next successful login.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>dashboardUi</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">new</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">new</td>
            <td className="py-3 px-4 text-muted">The React dashboard in <code className={C}>dist/ui</code>, or <code className={C}>classic</code> for the older EJS page. <code className={C}>--classic-ui</code> overrides it for one run.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>nginxDir</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">/etc/nginx</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">C:\nginx</td>
            <td className="py-3 px-4 text-muted">Nginx installation directory</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>sslDir</code></td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">/etc/easy-devops/ssl</td>
            <td className="py-3 px-4 text-foreground font-mono text-xs">C:\easy-devops\ssl</td>
            <td className="py-3 px-4 text-muted">SSL certificate storage root</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>acmeEmail</code></td>
            <td className="py-3 px-4 text-muted italic">empty</td>
            <td className="py-3 px-4 text-muted italic">empty</td>
            <td className="py-3 px-4 text-muted">Email for the Let&apos;s Encrypt account. Issuance is refused until one is set.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>acmeChallengePort</code></td>
            <td className="py-3 px-4 text-muted">8089</td>
            <td className="py-3 px-4 text-muted">8089</td>
            <td className="py-3 px-4 text-muted">Loopback port the HTTP-01 listener binds; nginx proxies the challenge path to it.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>sslChallengeMode</code></td>
            <td className="py-3 px-4 text-muted">auto</td>
            <td className="py-3 px-4 text-muted">auto</td>
            <td className="py-3 px-4 text-muted"><code className={C}>auto</code>, <code className={C}>proxy</code> or <code className={C}>standalone</code>. <code className={C}>auto</code> keeps nginx running whenever nginx is up.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>acmeStaging</code></td>
            <td className="py-3 px-4 text-muted">false</td>
            <td className="py-3 px-4 text-muted">false</td>
            <td className="py-3 px-4 text-muted">Use Let&apos;s Encrypt staging. Always on for a development data directory, so tests never spend production rate limits.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>sslAutoRenew</code></td>
            <td className="py-3 px-4 text-muted">true</td>
            <td className="py-3 px-4 text-muted">true</td>
            <td className="py-3 px-4 text-muted">Renew HTTP-01 certificates in the background</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>sslAutoRenewDays</code></td>
            <td className="py-3 px-4 text-muted">7</td>
            <td className="py-3 px-4 text-muted">7</td>
            <td className="py-3 px-4 text-muted">Days before expiry at which a certificate is renewed (1–30)</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>deployHook</code></td>
            <td className="py-3 px-4 text-muted">off</td>
            <td className="py-3 px-4 text-muted">off</td>
            <td className="py-3 px-4 text-muted">The listener CI calls to trigger a deployment: enabled, port (6445), bind (loopback unless set to <code className={C}>0.0.0.0</code>), domain</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>deployDir</code></td>
            <td className="py-3 px-4 text-muted">&lt;data dir&gt;/ez_deploys</td>
            <td className="py-3 px-4 text-muted">&lt;data dir&gt;{'\\'}ez_deploys</td>
            <td className="py-3 px-4 text-muted">Folder new deployed apps are created in. <code className={C}>null</code> means the default. Changing it never moves an existing app.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="first-run" className="text-xl font-bold mt-10 mb-4 text-foreground">First run: no default password</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A fresh dashboard has <strong className="text-foreground">no password at all</strong> — there is
        no built-in account and no default credential. The first visit shows a setup screen. Setting a
        password requires a <strong className="text-foreground">one-time setup code</strong> that is
        printed only in the server&apos;s terminal or its service log, because{" "}
        <code className={C}>POST /api/setup</code> is public by necessity: there is no session to require
        before the first password exists.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Six digits, accepted with or without the space, valid for 24 hours.</li>
        <li>Issued at dashboard or daemon start while setup is pending. <code className={C}>ezz dashboard setup-code</code> issues a new one from the machine itself.</li>
        <li>Per-IP rate limiting plus a global cap of 20 failed attempts, after which the code is invalidated and only the machine can issue another.</li>
        <li>Only the hash is stored. The code never appears in an API response, a Socket.io event, or anything sent to the Hub.</li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The alternative on the setup screen is <strong className="text-foreground">no password</strong>.
        It is offered only when the dashboard is bound to loopback <em>and</em> the request comes from
        this machine, and it is stored explicitly as{" "}
        <code className={C}>dashboardAuth: &quot;none&quot;</code>. If the two settings ever disagree,{" "}
        <code className={C}>effectiveAuthMode()</code> falls back to requiring a password.
      </p>

      <h2 id="listen-address" className="text-xl font-bold mt-10 mb-4 text-foreground">Listen address</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The dashboard process always listens on <code className={C}>127.0.0.1</code>. A remote
        operator reaches it through an HTTPS reverse proxy or authenticated tunnel running on the
        same machine. The compatibility field <code className={C}>dashboardBindAddress</code> is
        shown in the dashboard under Settings → Access and authentication and in the CLI under{" "}
        <strong className="text-foreground">Settings → Listen On</strong>, but it cannot expose the
        plain-HTTP listener on a network interface.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li>No-password mode is offered only for a direct local request with no forwarding headers. A request through a local HTTPS proxy or tunnel requires a session.</li>
        <li>Installs that previously stored a public bind are migrated to loopback. A legacy passwordless choice on a public bind is changed to require a password.</li>
        <li>A trusted proxy qualifies only when its TCP connection reaches the dashboard from loopback, forwarding declares HTTPS and a single forwarded host, and the request has a same-origin HTTPS <code className={C}>Origin</code>.</li>
        <li>The dashboard checks <code className={C}>Host</code>, <code className={C}>Origin</code>, forwarding headers and <code className={C}>X-EZ-Request</code> in both auth modes — see <a href="/docs/api#transport" className="text-primary hover:underline">the API transport rules</a>.</li>
      </ul>

      <h2 id="database-keys" className="text-xl font-bold mt-10 mb-4 text-foreground">Database Keys</h2>
      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Key</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Contents</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>config</code></td>
            <td className="py-3 px-4 text-muted">Dashboard port, auth mode, bind address, UI choice, password hash, nginxDir, sslDir, ACME email, renewal settings, deploy folder</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>setup-code</code></td>
            <td className="py-3 px-4 text-muted">Hash and counters for the outstanding first-run code. Never the code itself.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>system-detection</code></td>
            <td className="py-3 px-4 text-muted">Cached system info (OS, Node, nginx)</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>domains</code></td>
            <td className="py-3 px-4 text-muted">JSON array of domain configurations</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>hub-link</code> / <code className={C}>hub-permissions</code></td>
            <td className="py-3 px-4 text-muted">The Hub pairing and the per-permission switches. The secret is stored but never returned by an API.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>deployApps</code></td>
            <td className="py-3 px-4 text-muted">Deployed apps, their releases and runs. Environment values are stored on the server only.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="linux-permissions" className="text-xl font-bold mt-10 mb-4 text-foreground">Linux permissions</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">
        On Linux, nginx service control runs as{" "}
        <code className={C}>sudo -n /usr/bin/systemctl … nginx</code>. That works only after a one-time
        sudoers rule exists. The dashboard is a web server and must never receive your sudo password —
        so it <strong className="text-foreground">never asks for one</strong>.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li><strong className="text-foreground">Dashboard:</strong> open <strong>Settings → Linux Permissions</strong>. It shows the exact commands and whether the rule is already installed. You copy them into a terminal and run them yourself; sudo asks <em>you</em> there.</li>
        <li><strong className="text-foreground">CLI:</strong> <strong>Settings → Setup Linux Permissions</strong> prints the same commands and runs them through the real terminal, so sudo prompts there. Easy DevOps never sees the password.</li>
        <li>The rule file is validated with <code className={C}>visudo -cf</code> before it is installed, so a typo cannot lock you out of sudo.</li>
      </ul>
      <p className="text-muted text-sm leading-relaxed mb-4">
        Exactly <strong className="text-foreground">five</strong> commands are granted in{" "}
        <code className={C}>/etc/sudoers.d/easy-devops</code> — no wildcards, no binaries without their
        arguments:
      </p>
      <pre className="text-xs bg-surface border border-border rounded-xl p-4 overflow-x-auto mb-4 leading-relaxed text-muted">{`/usr/bin/systemctl start nginx
/usr/bin/systemctl stop nginx
/usr/bin/systemctl reload nginx
/usr/bin/systemctl restart nginx
/usr/bin/systemctl status nginx`}</pre>
      <p className="text-muted text-sm leading-relaxed mb-10">
        The same setup also creates the certificate directory and nginx&apos;s{" "}
        <code className={C}>conf.d</code> once and hands them to your account, so no standing grant for{" "}
        <code className={C}>mkdir</code>, <code className={C}>chown</code> or <code className={C}>tee</code>{" "}
        is needed. There is no webroot to hand over: HTTP-01 challenges are answered by a loopback
        listener, not written to disk.
      </p>

      <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-5 text-sm mb-10">
        <p className="font-bold text-amber-500 mb-1">nginx -t never needs sudo</p>
        <p className="text-muted">The config test is read-only and Easy DevOps runs it without sudo. On Linux a non-root <code className={C}>nginx -t</code> can print &quot;syntax is ok&quot; and still exit non-zero because it cannot write <code className={C}>/run/nginx.pid</code>; Easy DevOps treats the output text as the verdict, not the exit code alone.</p>
      </div>

      <DocsPagination
        prev={{ title: "Dashboard API", href: "/docs/api", section: "Reference" }}
        next={{ title: "Platform Support", href: "/docs/platform", section: "Reference" }}
      />
    </DocPage>
  );
}
