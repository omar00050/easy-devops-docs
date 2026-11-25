import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Dashboard API",
  description:
    "How to call the Easy DevOps dashboard API: the published contract, the X-EZ-Request header, the session cookie, and a complete curl walkthrough.",
  keywords: ["Easy DevOps API", "DevOps dashboard API", "API contract", "X-EZ-Request", "session cookie", "curl"],
  alternates: { canonical: "/docs/api" },
  openGraph: {
    type: "article",
    url: "/docs/api",
    siteName: "Easy DevOps",
    title: "Dashboard API",
    description:
      "The contract, the request rules, the session cookie, and a curl walkthrough that works.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard API",
    description:
      "The contract, the request rules, the session cookie, and a curl walkthrough that works.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";
const CONTRACT = "https://github.com/omar00050/Easy-DevOps/blob/main/API-CONTRACT.md";

export default function APIPage() {
  return (
    <DocPage
      section="Reference"
      title="Dashboard API"
      description="The dashboard exposes a REST API under /api. Its single source of truth is API-CONTRACT.md in the easy-devops repository — this page explains how to talk to it, and does not repeat the endpoint list."
    >
      <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-5 text-sm mb-10">
        <p className="font-bold text-foreground mb-1">The contract lives with the code</p>
        <p className="text-muted leading-relaxed">
          Every endpoint, request shape, response shape, auth rule and Socket.io event is
          documented in{" "}
          <a href={CONTRACT} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            API-CONTRACT.md
          </a>
          . That file is enforced by <code className={C}>e2e/run.mjs</code>, which compares the routes
          registered in <code className={C}>src/dashboard/routes/</code> against it, so it cannot drift
          from the code. Read it there; this page only covers the transport rules you have to satisfy
          before any endpoint will answer.
        </p>
      </div>

      <h2 id="transport" className="text-xl font-bold mt-10 mb-4 text-foreground">Transport rules</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Three checks run on <strong className="text-foreground">every</strong>{" "}
        <code className={C}>/api</code> request, before authentication, in both auth modes. They are
        implemented in <code className={C}>src/dashboard/lib/localRequest.js</code>.
      </p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Check</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Rule</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Failure</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-primary">Host</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The port must match the dashboard&apos;s. A direct request must use <code className={C}>localhost</code>, <code className={C}>127.0.0.1</code> or <code className={C}>[::1]</code>. A trusted local HTTPS proxy may supply the public host through exactly one <code className={C}>X-Forwarded-Host</code> header.</td>
            <td className="py-3 px-4 text-muted text-xs">403</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-primary">Origin</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">When present, a direct request must use the direct HTTP protocol, matching port and a loopback hostname. A trusted local HTTPS proxy request must use HTTPS and the effective forwarded host and port.</td>
            <td className="py-3 px-4 text-muted text-xs">403</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-primary">X-EZ-Request: 1</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Required on every <code className={C}>POST</code>, <code className={C}>PUT</code>, <code className={C}>PATCH</code>, <code className={C}>DELETE</code>, and on the Socket.io handshake. Not required on a plain <code className={C}>GET</code>, but sending it everywhere is harmless and keeps one client path.</td>
            <td className="py-3 px-4 text-muted text-xs">403</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-muted leading-relaxed mb-10">
        A 403 from these checks is deliberately not a 401: logging in cannot fix &quot;this request may
        not be made from where it came from&quot;. The body carries{" "}
        <code className={C}>{`{ error, reason, detail }`}</code>.
      </p>

      <h2 id="authentication" className="text-xl font-bold mt-10 mb-4 text-foreground">Authentication and the session cookie</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>dashboardAuth</code> is either <code className={C}>password</code> (the
        default) or <code className={C}>none</code>. In <strong className="text-foreground">password</strong>{" "}
        mode, every endpoint except the auth router needs a logged-in session; without one it answers{" "}
        <code className={C}>401 {`{ "error": "Unauthorized" }`}</code>. Log in once with{" "}
        <code className={C}>POST /api/login</code> and reuse the cookie it sets — its name is{" "}
        <code className={C}>connect.sid</code> and it is <code className={C}>HttpOnly</code>, so a script
        has to keep it in a cookie jar rather than read it.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>There is no default password. First-run setup requires a one-time code printed in the server&apos;s terminal or service log, or the choice of no-password mode when the dashboard listens on loopback only.</li>
        <li>In <strong className="text-foreground">none</strong> mode no session is required for a direct loopback request with no forwarding headers. Requests through a local HTTPS proxy or tunnel require a session.</li>
        <li>The transport checks above are never relaxed in <code className={C}>none</code> mode. They are the only defence left.</li>
        <li>Failed logins are rate limited per IP: 10 attempts per 15 minutes, answered with <code className={C}>429</code> and a <code className={C}>Retry-After</code> header.</li>
      </ul>

      <h2 id="curl" className="text-xl font-bold mt-10 mb-4 text-foreground">A working curl walkthrough</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Two requests are enough to show the whole pattern: log in, storing the cookie in a jar, then
        send a state-changing request with that jar and the <code className={C}>X-EZ-Request: 1</code>{" "}
        header.
      </p>
      <CodeBlock lang="bash" filename="1 — log in and keep the cookie">{`curl -sS -c cookies.txt \\
  -H "Content-Type: application/json" \\
  -H "X-EZ-Request: 1" \\
  -d '{"password":"your-dashboard-password"}' \\
  http://127.0.0.1:6443/api/login

# {"ok":true}
# cookies.txt now holds the session (connect.sid)`}</CodeBlock>
      <CodeBlock lang="bash" filename="2 — reuse the cookie for a change">{`curl -sS -b cookies.txt \\
  -H "Content-Type: application/json" \\
  -H "X-EZ-Request: 1" \\
  -d '{
    "name": "example.com",
    "port": 3000,
    "backendHost": "127.0.0.1",
    "upstreamType": "http",
    "ssl": { "enabled": false },
    "performance": { "gzip": true },
    "security": { "rateLimit": false }
  }' \\
  http://127.0.0.1:6443/api/domains`}</CodeBlock>
      <CodeBlock lang="bash" filename="Read-only requests work the same way">{`curl -sS -b cookies.txt \\
  -H "X-EZ-Request: 1" \\
  http://127.0.0.1:6443/api/ssl`}</CodeBlock>
      <div className="rounded-xl border border-border bg-surface p-5 text-sm mb-10">
        <p className="font-bold text-foreground mb-1">If you get a 403</p>
        <p className="text-muted leading-relaxed">
          Check the <code className={C}>reason</code> in the body. <code className={C}>missing_request_header</code>{" "}
          means <code className={C}>X-EZ-Request: 1</code> is absent;{" "}
          <code className={C}>host_not_local</code> means the <code className={C}>Host</code> header is not
          a loopback name while the dashboard is bound to loopback. Calling{" "}
          <code className={C}>127.0.0.1</code> rather than a hostname avoids the second one. A 401 means
          the cookie is missing or expired — log in again.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
        next={{ title: "Configuration", href: "/docs/configuration", section: "Reference" }}
      />
    </DocPage>
  );
}
