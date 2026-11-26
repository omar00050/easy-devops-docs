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

      <h2 id="hub-teams" className="text-xl font-bold mt-10 mb-4 text-foreground">The Hub&apos;s Teams API</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        This page covers the API served by a server&apos;s own dashboard. The Hub has a second API, at{" "}
        <code className={C}>/api/v1</code> on the Hub itself, where servers and teams live; its reference is{" "}
        <code className={C}>hub_backend/ARCHITECTURE.md</code>. Teams are Hub-only and people join only by
        invitation: the Owner names an existing account by email or username, the Hub emails a single-use link and
        shows the same invitation in the Hub, and the membership exists only when the person accepts. The endpoints
        below add the invitation, lookup, share, shared-with-me and deploy-target calls, the{" "}
        <code className={C}>sections</code> field server responses now carry, and the{" "}
        <code className={C}>me:changed</code> event. The user-facing steps are in{" "}
        <a href="/docs/teams" className="text-primary hover:underline font-medium">Hub Teams</a>.
      </p>

      <h3 id="team-people" className="text-base font-bold mt-8 mb-3 text-foreground">Looking a person up</h3>
      <CodeBlock lang="json" filename="POST /api/v1/people/lookup">{`{ "identifier": "omar@example.com" }

// 200 — never the id, never the email address
{ "user": { "displayName": "Omar", "username": "omar", "avatarUrl": null } }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <code className={C}>identifier</code> is an email address (case-insensitive) or a username, with or without
          a leading <code className={C}>@</code>.
        </li>
        <li>
          Every miss — unknown, suspended, deleted, or the caller themselves — is the same{" "}
          <code className={C}>404 NO_ACCOUNT</code>: &quot;No Hub account matches. The person must create a Hub
          account first.&quot;
        </li>
        <li>
          The caller must own at least one team or one personal server; otherwise{" "}
          <code className={C}>403 CANNOT_INVITE</code>.
        </li>
        <li>
          One per-account <code className={C}>people</code> bucket of 30 per hour covers every lookup, invitation and
          share send, failures included, on top of a per-IP limiter. Over it:{" "}
          <code className={C}>429 RATE_LIMITED</code> with <code className={C}>retryAfterSeconds</code> and a{" "}
          <code className={C}>Retry-After</code> header.
        </li>
      </ul>

      <h3 id="team-invites" className="text-base font-bold mt-8 mb-3 text-foreground">Invitations</h3>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Method</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Path</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Who</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">GET</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites</td>
              <td className="py-3 px-4 text-xs text-muted">Owner</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>InviteView[]</code>, newest first, every status; a pending row past <code className={C}>expiresAt</code> is marked expired when read.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites</td>
              <td className="py-3 px-4 text-xs text-muted">Owner</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ identifier, role, grants?, allServers?, servers? }`}</code> → <code className={C}>201 {`{ invite, emailSent }`}</code>.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites/:inviteId/resend</td>
              <td className="py-3 px-4 text-xs text-muted">Owner</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Pending or expired only: a new token and a new 24-hour expiry; the old link stops working.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">DELETE</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites/:inviteId</td>
              <td className="py-3 px-4 text-xs text-muted">Owner</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Revoke a pending invitation → <code className={C}>204</code>.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">GET</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/invites/mine</td>
              <td className="py-3 px-4 text-xs text-muted">any account</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">The caller&apos;s pending, unexpired invitations → <code className={C}>MyInvite[]</code>.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/invites/preview</td>
              <td className="py-3 px-4 text-xs text-muted">the invited account</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ token }`}</code> or <code className={C}>{`{ inviteId }`}</code> → <code className={C}>MyInvite</code>.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/invites/accept</td>
              <td className="py-3 px-4 text-xs text-muted">the invited account</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ token }`}</code> or <code className={C}>{`{ inviteId }`}</code> → <code className={C}>{`{ team: { id, name }, role, share }`}</code>. Creates the membership.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/invites/decline</td>
              <td className="py-3 px-4 text-xs text-muted">the invited account</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ token }`}</code> or <code className={C}>{`{ inviteId }`}</code> → <code className={C}>200</code>; the invitation cannot be reused.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CodeBlock lang="json" filename="POST /api/v1/teams/:teamId/invites">{`{
  "identifier": "omar@example.com",
  "role": "member",
  "grants": ["deploy.run", "deploy.logs"],
  "allServers": false,
  "servers": [
    { "serverId": "…", "allApps": false,
      "apps": [ { "appId": "site", "actions": ["deploy.run"] } ] }
  ]
}

// 201 — the invitation, not a membership
{ "invite": {
    "id": "…",
    "person": { "displayName": "Omar", "username": "omar", "email": "omar@example.com" },
    "role": "member", "grants": ["deploy.run", "deploy.logs"],
    "scope": { "servers": [ … ] }, "share": null,
    "status": "pending", "expiresAt": "2026-11-27T10:00:00.000Z",
    "sentAt": "2026-11-26T10:00:00.000Z", "respondedAt": null,
    "invitedBy": { "displayName": "Sara" }
  },
  "emailSent": true }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          The raw token is never stored — only its SHA-256 — and it travels in a URL fragment:{" "}
          <code className={C}>/invite#&lt;token&gt;</code>. It expires after 24 hours and works once, bound to the
          invited account, team, role, grants and scope.
        </li>
        <li>
          <code className={C}>role</code> is <code className={C}>admin</code>, <code className={C}>member</code> or{" "}
          <code className={C}>viewer</code>; <code className={C}>owner</code> is{" "}
          <code className={C}>400 USE_TRANSFER</code>. Grants and scope are validated exactly as in{" "}
          <code className={C}>PATCH /teams/:teamId/members/:memberId</code>. A missing account is{" "}
          <code className={C}>404 NO_ACCOUNT</code>, an existing member <code className={C}>409 ALREADY_MEMBER</code>
          , and a pending invitation for the same person without a share{" "}
          <code className={C}>409 INVITE_PENDING</code> with <code className={C}>data.inviteId</code>.
        </li>
        <li>
          Preview, accept and decline refuse with <code className={C}>404 INVITE_NOT_FOUND</code>,{" "}
          <code className={C}>403 WRONG_ACCOUNT</code>, <code className={C}>410 INVITE_EXPIRED</code> /{" "}
          <code className={C}>INVITE_REVOKED</code>, <code className={C}>409 INVITE_USED</code> /{" "}
          <code className={C}>ALREADY_MEMBER</code>, and <code className={C}>409 SHARE_GONE</code> when the shared
          app or its server has left the team. Accepting uses the stored role, grants and scope; the request body
          cannot change them.
        </li>
        <li>
          The body of a send, resend or share never appears in the audit: only{" "}
          <code className={C}>invite.send</code>, <code className={C}>invite.resend</code>,{" "}
          <code className={C}>invite.revoke</code>, <code className={C}>invite.accept</code>,{" "}
          <code className={C}>invite.decline</code> and <code className={C}>invite.expire</code> are recorded, never
          the token.
        </li>
        <li>
          <strong className="text-foreground">Removed:</strong> there is no{" "}
          <code className={C}>POST /api/v1/teams/:teamId/members</code> and no notices endpoints.{" "}
          <code className={C}>GET /api/v1/teams/notices</code> and{" "}
          <code className={C}>POST /api/v1/teams/:teamId/notice/dismiss</code> were removed with the direct add; the
          invitation is the only way in.
        </li>
      </ul>

      <h3 id="team-shares" className="text-base font-bold mt-8 mb-3 text-foreground">Sharing a server or an app</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A share is an invitation whose scope names one server or one app; it uses the same team model and the same{" "}
        <code className={C}>TeamInvite</code> row, not a second sharing concept.
      </p>
      <CodeBlock lang="json" filename="POST /api/v1/servers/:id/apps/:appId/shares">{`{
  "identifier": "omar",
  "actions": ["deploy", "logs"],
  "confirmMove": true,          // required for a personal server
  "teamId": "…"                 // or "newTeamName": "Platform"
}

// 201
{ "invite": { … }, "team": { "id": "…", "name": "Platform" }, "moved": true, "emailSent": true }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <code className={C}>POST /api/v1/servers/:id/share</code> takes{" "}
          <code className={C}>{`{ identifier, role, grants?, confirmMove?, teamId? | newTeamName? }`}</code> and
          scopes the invitation to that server (<code className={C}>allApps: true</code>).
        </li>
        <li>
          An app share takes <code className={C}>actions</code> — one or more of{" "}
          <code className={C}>deploy</code>, <code className={C}>rollback</code>, <code className={C}>logs</code> —
          which become <code className={C}>deploy.run</code>, <code className={C}>deploy.rollback</code> and{" "}
          <code className={C}>deploy.logs</code>. Logs alone makes the person a Viewer; anything else a Member.
        </li>
        <li>
          A team server needs that team&apos;s Owner. A personal server needs{" "}
          <code className={C}>confirmMove: true</code> and either a team the caller owns or a new team name; the
          server moves into the team in the same transaction that writes the invitation, and{" "}
          <code className={C}>moved</code> says whether it did. <code className={C}>Server.userId</code> stays the
          caller.
        </li>
        <li>
          <code className={C}>GET /api/v1/servers/:id/apps/:appId/shares</code> (Owner only) returns pending and
          expired invitations plus members whose app grant applies:{" "}
          <code className={C}>{`{ id, kind: 'invite' | 'member', person, status?, expiresAt?, actions }`}</code>.
        </li>
        <li>
          <code className={C}>DELETE /api/v1/servers/:id/apps/:appId/shares/:shareId?kind=invite|member</code>{" "}
          revokes the invitation or removes that one app grant, deleting the membership when it then reaches
          nothing. Refusals: <code className={C}>409 ALREADY_MEMBER</code> (use the team&apos;s Members tab),{" "}
          <code className={C}>409 INVITE_PENDING</code> and <code className={C}>404 UNKNOWN_APP</code>.
        </li>
      </ul>

      <h3 id="team-shared" className="text-base font-bold mt-8 mb-3 text-foreground">Shared with me</h3>
      <CodeBlock lang="json" filename="GET /api/v1/me/shared">{`{
  "servers": [
    { "serverId": "…", "serverName": "web-1", "online": true,
      "team": { "id": "…", "name": "Platform" },
      "apps": [ { "appId": "site", "name": "Site", "actions": ["deploy.run"] } ] }
  ],
  "appOnlyTeamIds": ["…"]
}`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Only the caller&apos;s <code className={C}>member</code> and <code className={C}>viewer</code> app grants
          are listed; an Owner or Admin is never narrowed this way. Apps are grouped by server and servers are sorted
          by name.
        </li>
        <li>
          <code className={C}>appOnlyTeamIds</code> names the teams where the caller&apos;s only access is app grants.
          Pending invitations do not appear here; they come from <code className={C}>GET /api/v1/invites/mine</code>{" "}
          and the sidebar shows them above this list.
        </li>
      </ul>

      <h3 id="team-deploy-targets" className="text-base font-bold mt-8 mb-3 text-foreground">New deploy targets</h3>
      <CodeBlock lang="json" filename="GET /api/v1/servers/deploy-targets">{`[
  { "id": "…", "name": "web-1", "team": { "id": "…", "name": "Platform" },
    "online": true, "selectable": false,
    "code": "AGENT_DEPLOY_OFF",
    "reason": "This server does not allow Hub deploys. Turn on Deployments in the server's Settings → Hub." }
]`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Every server the caller can see, with the first reason it cannot take a create, in this order: the create
          policy (<code className={C}>ROLE_TOO_LOW</code>, <code className={C}>NOT_GRANTED</code>,{" "}
          <code className={C}>SERVER_WIDE_REFUSED</code>, …), <code className={C}>AGENT_DEPLOY_OFF</code>,{" "}
          <code className={C}>OFFLINE</code>, then <code className={C}>SERVICE_ACCOUNT</code>.
        </li>
        <li>
          <code className={C}>selectable</code> is exactly <code className={C}>code === null</code>;{" "}
          <code className={C}>code</code> and <code className={C}>reason</code> are null for a server that can
          deploy. An older agent that reports no PM2 state is unknown, not a service account, so it stays selectable.
        </li>
        <li>
          The UI opens the existing create form at{" "}
          <code className={C}>/dashboard/servers/&lt;id&gt;?section=deployments&amp;create=1</code>; it never derives
          a reason from the online badge or a role.
        </li>
      </ul>

      <h3 id="team-sections" className="text-base font-bold mt-8 mb-3 text-foreground">The sections field</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>GET /api/v1/servers</code> and <code className={C}>GET /api/v1/servers/:id</code> carry{" "}
        <code className={C}>sections: string[]</code> — the server-page sections this viewer may open, in order:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <code className={C}>overview</code>, <code className={C}>deployments</code> and{" "}
          <code className={C}>settings</code>, always.
        </li>
        <li>
          <code className={C}>domains</code>, <code className={C}>ssl</code>, <code className={C}>nginx</code>,{" "}
          <code className={C}>notifications</code> and <code className={C}>processes</code>, only for full server
          access; an app-scoped viewer never gets them.
        </li>
        <li>
          <code className={C}>logs</code> only when <code className={C}>hub:getLogs.*</code> is allowed, and{" "}
          <code className={C}>actionLog</code> only when <code className={C}>GET /servers/:id/actions</code> would
          answer. The ids are exactly those ten; the Hub computes them once and the UI maps them to its own labels
          and <code className={C}>?section=</code> values.
        </li>
      </ul>

      <h3 id="team-socket" className="text-base font-bold mt-8 mb-3 text-foreground">The me:changed event</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        When a membership, grant, share or invitation changes, the Hub emits <code className={C}>me:changed</code>{" "}
        with an empty payload <code className={C}>{`{}`}</code> on the browser socket to every affected account —
        and, for a team change, to every member of that team, read from the database so a member with no server page
        open is reached too. The client only refetches teams, shared-with-me and invitations; no share detail, server
        id or grant is sent. A change that removes access to an open server page still arrives as{" "}
        <code className={C}>server:&lt;id&gt;:accessRevoked</code>.
      </p>

      <h3 id="team-refusals" className="text-base font-bold mt-8 mb-3 text-foreground">Verdicts and the staff override</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          A permission verdict carries <code className={C}>code</code> as well as <code className={C}>reason</code>,
          including when it is allowed — for example <code className={C}>APP_ID_REQUIRED</code>. Read{" "}
          <code className={C}>code</code> when branching, and show <code className={C}>reason</code> to the person.
        </li>
        <li>
          A staff <code className={C}>DELETE</code> on a server that belongs to a team answers{" "}
          <code className={C}>409 TEAM_SERVER</code> unless the body carries{" "}
          <code className={C}>teamOverride: true</code>. The override is the same explicit choice the management page
          asks for, and the removal is written to the team&apos;s audit log and the staff action log.
        </li>
      </ul>

      <DocsPagination
        prev={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
        next={{ title: "Configuration", href: "/docs/configuration", section: "Reference" }}
      />
    </DocPage>
  );
}
