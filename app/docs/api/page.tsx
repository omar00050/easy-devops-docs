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
        invitation: the caller names an existing account by email or username, the Hub emails a single-use link and
        shows the same invitation in the Hub, and the membership exists only when the person accepts. The endpoints
        below add roles, member roles, member permissions, server and app overrides, view-as, invitations with{" "}
        <code className={C}>roleIds</code>, lookup, share, direct app share, shared-with-me and deploy-target calls, the{" "}
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

      <h3 id="team-roles" className="text-base font-bold mt-8 mb-3 text-foreground">Roles</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Roles are team-scoped and replace the fixed role table. Every team has <code className={C}>@everyone</code>{" "}
        (position 0, implicit for every member) plus the built-in Admin, Member and Viewer, and any number of custom
        roles. A member holds any number of roles; the Owner sits above every role.
      </p>
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
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/roles</td>
              <td className="py-3 px-4 text-xs text-muted">team member</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ id, name, color, position, permissions, isEveryone, builtin, memberCount }[]`}</code>, top first. <code className={C}>builtin</code> is <code className={C}>admin</code>, <code className={C}>member</code>, <code className={C}>viewer</code> or null.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/roles</td>
              <td className="py-3 px-4 text-xs text-muted">roles.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ name, color?, permissions? }`}</code> → <code className={C}>201</code>. The name is unique in the team; the role is placed one step below the caller&apos;s highest role.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">PATCH</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/roles/:roleId</td>
              <td className="py-3 px-4 text-xs text-muted">roles.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ name?, color?, permissions? }`}</code>. Only roles below the caller&apos;s highest role; only keys the caller holds; never <code className={C}>administrator</code> unless Owner.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">DELETE</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/roles/:roleId</td>
              <td className="py-3 px-4 text-xs text-muted">roles.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Below the caller&apos;s highest role only; @everyone cannot be deleted. The role&apos;s overrides cascade away. → <code className={C}>204</code>.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">PUT</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/roles/order</td>
              <td className="py-3 px-4 text-xs text-muted">roles.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ roleIds: [top, …, bottom] }`}</code>, excluding @everyone. Only the slice below the caller&apos;s highest role may change; moving a role to or above it is refused.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">GET</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/permissions/catalog</td>
              <td className="py-3 px-4 text-xs text-muted">team member</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">The catalog: every key with its level, group, one-line description and dangerous flag. The Owner-only actions are not in it.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CodeBlock lang="json" filename="POST /api/v1/teams/:teamId/roles">{`{
  "name": "Frontend",
  "color": "#3b82f6",
  "permissions": []
}

// 201
{ "role": {
    "id": "…", "name": "Frontend", "color": "#3b82f6",
    "position": 2, "permissions": [],
    "isEveryone": false, "builtin": null, "memberCount": 0
  }
}`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Keys above the caller&apos;s own set, an override-worthy name outside the catalog, or a role at or above the
          caller&apos;s highest answer <code className={C}>403 HIERARCHY</code> or{" "}
          <code className={C}>403 MISSING_PERMISSION</code>, naming the role or the key.
        </li>
        <li>
          <code className={C}>administrator</code> is Owner-only to grant or remove. The Owner-only actions (delete the
          team, transfer ownership, <code className={C}>server.delete</code>,{" "}
          <code className={C}>server.transferOut</code>, <code className={C}>server.cliLink</code> and rotating a server
          secret) are not keys at all: a body carrying one is{" "}
          <code className={C}>400 UNKNOWN_PERMISSION</code>.
        </li>
        <li>
          A write is audited as <code className={C}>role.create</code>, <code className={C}>role.update</code>,{" "}
          <code className={C}>role.delete</code> or <code className={C}>role.reorder</code>, then{" "}
          <code className={C}>notifyAccessChanged({`{ teamId }`})</code> re-authorises open sockets at once.
        </li>
      </ul>

      <h3 id="team-member-roles" className="text-base font-bold mt-8 mb-3 text-foreground">
        Member roles and effective permissions
      </h3>
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
              <td className="py-3 px-4 font-mono text-xs text-primary">PUT</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/members/:memberId/roles</td>
              <td className="py-3 px-4 text-xs text-muted">members.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ roleIds }`}</code> — the full set, not a patch. Hierarchy-checked as a diff: only roles below the caller&apos;s highest, only for members below them, never the Owner. @everyone cannot be assigned or removed.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">GET</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/members/:memberId/permissions</td>
              <td className="py-3 px-4 text-xs text-muted">members.manage or roles.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Effective keys per team server and per app, after roles and both override levels — what &quot;View permissions&quot; shows. The Owner&apos;s own answer is everything.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          A member&apos;s keys are <code className={C}>@everyone</code> plus every assigned role, added together.{" "}
          <code className={C}>administrator</code> short-circuits to every key and ignores overrides.
        </li>
        <li>
          The write is audited as <code className={C}>member.roles</code> and re-authorises open sockets through{" "}
          <code className={C}>notifyAccessChanged({`{ teamId }`})</code>.
        </li>
        <li>
          <strong className="text-foreground">Removed:</strong> <code className={C}>PATCH
          /teams/:teamId/members/:memberId</code> with grants, scope or role editing. A role change is this endpoint;
          a per-person key change is an override.
        </li>
      </ul>

      <h3 id="team-overrides" className="text-base font-bold mt-8 mb-3 text-foreground">Overrides</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        An override allows or denies keys for one role or one member on one server, or on one app of that server. A key
        is never in both lists; absent means inherit. Server overrides accept server- and app-level keys, app
        overrides app-level keys only, and team keys never appear in an override.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Method</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Path</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">GET</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/servers/:id/overrides?appId=</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ id, target: { type, id, name, color? }, allow, deny }[]`}</code> for the server, or for one app when <code className={C}>appId</code> is given.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">PUT</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/servers/:id/overrides</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ appId?, target: { type: 'role'|'member', id }, allow, deny }`}</code> — an upsert on the target. Both lists empty deletes the override.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">DELETE</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/servers/:id/overrides/:overrideId</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Removes that override → <code className={C}>204</code>. Deleting the server, app, role or member removes its overrides too, by cascade and by the app-deletion hook.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CodeBlock lang="json" filename="PUT /api/v1/servers/:id/overrides — Frontend may deploy app A">{`{
  "appId": "site",
  "target": { "type": "role", "id": "…" },
  "allow": ["deploy.run", "deploy.logs"],
  "deny": []
}

// 200
{ "override": {
    "id": "…",
    "target": { "type": "role", "id": "…", "name": "Frontend", "color": "#3b82f6" },
    "allow": ["deploy.run", "deploy.logs"], "deny": []
  } }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Callers need <code className={C}>roles.manage</code> on that team server; the hierarchy check refuses an
          override on a role at or above the caller, on a member whose highest role is at or above theirs, or on the
          Owner, and refuses a key the caller does not hold there.
        </li>
        <li>
          <strong className="text-foreground">Private server or app:</strong> a PUT on <code className={C}>@everyone</code>{" "}
          with <code className={C}>server.view</code> or <code className={C}>app.view</code> in{" "}
          <code className={C}>deny</code>, then an allow for the roles or members who keep it.
        </li>
        <li>
          Audited as <code className={C}>override.set</code> or <code className={C}>override.delete</code>, then{" "}
          <code className={C}>notifyAccessChanged({`{ teamId }`})</code>.
        </li>
      </ul>

      <h3 id="team-view-as" className="text-base font-bold mt-8 mb-3 text-foreground">View as</h3>
      <CodeBlock lang="json" filename="GET /api/v1/servers/:id/view-as/:memberId?appId=">{`// 200
{
  "visible": true,
  "permissions": ["server.view", "app.view", "deploy.run", "deploy.logs"],
  "allowed": { "hub:manageDeploy.deploy": false, "hub:nginxAction.reload": false },
  "sections": ["overview", "deployments", "settings"]
}`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Runs the same resolver the API uses: roles, then the server&apos;s overrides, then the app&apos;s when{" "}
          <code className={C}>appId</code> is given. <code className={C}>allowed</code> carries a verdict per
          command and action.
        </li>
        <li>
          The caller needs <code className={C}>roles.manage</code> or <code className={C}>members.manage</code>, or
          must be the Owner. It never shows the Owner&apos;s own view as anything but everything.
        </li>
        <li>
          A member whose <code className={C}>server.view</code> is denied comes back{" "}
          <code className={C}>{`{ "visible": false }`}</code>, which is the same thing the rest of the API answers as
          404.
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
              <td className="py-3 px-4 text-xs text-muted">members.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>InviteView[]</code>, newest first, every status; a pending row past <code className={C}>expiresAt</code> is marked expired when read.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites</td>
              <td className="py-3 px-4 text-xs text-muted">members.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed"><code className={C}>{`{ identifier, roleIds }`}</code> → <code className={C}>201 {`{ invite, emailSent }`}</code>. <code className={C}>roleIds</code> is the full set of roles to assign on accept.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">POST</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites/:inviteId/resend</td>
              <td className="py-3 px-4 text-xs text-muted">members.manage</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Pending or expired only: a new token and a new 24-hour expiry; the old link stops working.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary">DELETE</td>
              <td className="py-3 px-4 font-mono text-xs text-foreground">/api/v1/teams/:teamId/invites/:inviteId</td>
              <td className="py-3 px-4 text-xs text-muted">members.manage</td>
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
  "roleIds": ["…", "…"]
}

// 201 — the invitation, not a membership
{ "invite": {
    "id": "…",
    "person": { "displayName": "Omar", "username": "omar", "email": "omar@example.com" },
    "roles": [ { "id": "…", "name": "Frontend", "color": "#3b82f6" } ],
    "share": null,
    "status": "pending", "expiresAt": "2026-11-27T10:00:00.000Z",
    "sentAt": "2026-11-26T10:00:00.000Z", "respondedAt": null,
    "invitedBy": { "displayName": "Sara" }
  },
  "emailSent": true }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          The raw token is never stored — only its SHA-256 — and it travels in a URL fragment:{" "}
          <code className={C}>/invite#&lt;token&gt;</code>. It expires after 24 hours and works once, bound to the
          invited account, team and <code className={C}>roleIds</code>.
        </li>
        <li>
          <code className={C}>roleIds</code> is validated when the invitation is sent <em>and</em> re-checked against
          the sender&apos;s power when it is accepted; roles that no longer exist are skipped. Ownership is never a
          role: <code className={C}>owner</code> is <code className={C}>400 USE_TRANSFER</code>. A missing account is{" "}
          <code className={C}>404 NO_ACCOUNT</code>, an existing member <code className={C}>409 ALREADY_MEMBER</code>,
          and a pending invitation for the same person without a share{" "}
          <code className={C}>409 INVITE_PENDING</code> with <code className={C}>data.inviteId</code>.
        </li>
        <li>
          <strong className="text-foreground">Two kinds, one invitation.</strong>{" "}
          <code className={C}>GET /invites/mine</code> items carry <code className={C}>kind: &apos;team&apos; |
          &apos;app&apos;</code>. A team invitation carries the team; an app invitation (<code className={C}>Share
          only this app</code>) has <code className={C}>team: null</code> and a{" "}
          <code className={C}>share</code> naming{" "}
          <code className={C}>{`{ serverId, serverName, appId, appName, actions }`}</code>.{" "}
          <code className={C}>preview</code>, <code className={C}>accept</code> and{" "}
          <code className={C}>decline</code> take a token or an id of either kind, with the same refusal codes;
          accepting an app invitation creates the direct share, after re-checking that the app still exists (else{" "}
          <code className={C}>SHARE_GONE</code>) and that the person is not already the owner or a member of the
          server&apos;s team (else <code className={C}>ALREADY_MEMBER</code>).
        </li>
        <li>
          Preview, accept and decline refuse with <code className={C}>404 INVITE_NOT_FOUND</code>,{" "}
          <code className={C}>403 WRONG_ACCOUNT</code>, <code className={C}>410 INVITE_EXPIRED</code> /{" "}
          <code className={C}>INVITE_REVOKED</code>, <code className={C}>409 INVITE_USED</code> /{" "}
          <code className={C}>ALREADY_MEMBER</code>, and <code className={C}>409 SHARE_GONE</code> when the shared
          app or its server has left the team. Accepting uses the stored roleIds; the request body cannot change them.
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
          <code className={C}>POST /api/v1/teams/:teamId/members</code>, no notices endpoints and no{" "}
          <code className={C}>PATCH /api/v1/teams/:teamId/members/:memberId</code> with grants, scope or role editing.
          A role change is <code className={C}>PUT …/members/:memberId/roles</code>; a per-person key change is an
          override. <code className={C}>GET /api/v1/teams/notices</code> and{" "}
          <code className={C}>POST /api/v1/teams/:teamId/notice/dismiss</code> were removed with the direct add; the
          invitation is the only way in.
        </li>
      </ul>

      <h3 id="team-shares" className="text-base font-bold mt-8 mb-3 text-foreground">Sharing a server or an app</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A share is an invitation whose scope names one server or one app. Without a mode it is the team route: a{" "}
        <code className={C}>TeamInvite</code> row, and on a personal server the move into a team. The next section
        covers the other route, <code className={C}>mode: &apos;app&apos;</code>, which shares one app directly.
      </p>
      <CodeBlock lang="json" filename="POST /api/v1/servers/:id/apps/:appId/shares">{`{
  "identifier": "omar",
  "actions": ["deploy", "logs"],
  "mode": "team",               // optional; "app" is the default
  "confirmMove": true,          // team mode, personal server
  "teamId": "…"                 // or "newTeamName": "Platform"
}

// 201
{ "invite": { … }, "team": { "id": "…", "name": "Platform" }, "moved": true, "emailSent": true }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <code className={C}>POST /api/v1/servers/:id/share</code> takes{" "}
          <code className={C}>{`{ identifier, roleIds, confirmMove?, teamId? | newTeamName? }`}</code> and invites
          them to the server&apos;s team.
        </li>
        <li>
          An app share takes <code className={C}>actions</code> — one or more of{" "}
          <code className={C}>deploy</code>, <code className={C}>rollback</code>, <code className={C}>logs</code> —
          which become <code className={C}>deploy.run</code>, <code className={C}>deploy.rollback</code> and{" "}
          <code className={C}>deploy.logs</code>. In a team those actions are written as an allow override on that
          app; a direct share keeps them as the share&apos;s own grant.
        </li>
        <li>
          A team server needs that team&apos;s Owner. A personal server in team mode needs{" "}
          <code className={C}>confirmMove: true</code> and either a team the caller owns or a new team name; the
          server moves into the team in the same transaction that writes the invitation, and{" "}
          <code className={C}>moved</code> says whether it did. <code className={C}>Server.userId</code> stays the
          caller.
        </li>
        <li>
          <code className={C}>GET /api/v1/servers/:id/apps/:appId/shares</code> (Owner only) returns pending and
          expired invitations, members whose app grant applies, and direct shares:{" "}
          <code className={C}>{`{ id, kind: 'invite' | 'member' | 'direct', person, status?, expiresAt?, actions }`}</code>
          . Direct shares appear on personal and team servers alike.
        </li>
        <li>
          <code className={C}>DELETE /api/v1/servers/:id/apps/:appId/shares/:shareId?kind=invite|member|direct</code>{" "}
          revokes the invitation, revokes one direct share, or removes that one app grant, deleting the membership
          when it then reaches nothing. Refusals: <code className={C}>409 ALREADY_MEMBER</code> (use the team&apos;s
          Members tab), <code className={C}>409 INVITE_PENDING</code> and <code className={C}>404 UNKNOWN_APP</code>.
        </li>
      </ul>

      <h3 id="team-direct-shares" className="text-base font-bold mt-8 mb-3 text-foreground">
        Direct app shares
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>mode: &apos;app&apos;</code> is <strong className="text-foreground">Share only this
        app</strong> and the default. It creates an <code className={C}>AppShare</code> row — no team, nothing moved —
        and sends the same 24-hour invitation email and in-Hub invitation.
      </p>
      <CodeBlock lang="json" filename="POST /api/v1/servers/:id/apps/:appId/shares — mode app">{`{
  "identifier": "omar",
  "actions": ["deploy", "logs"],
  "mode": "app"
}

// 201
{ "share": {
    "id": "…", "kind": "direct",
    "person": { "displayName": "Omar", "username": "omar" },
    "actions": ["deploy", "logs"], "status": "pending",
    "expiresAt": "2026-11-27T10:00:00.000Z",
    "sentAt": "2026-11-26T10:00:00.000Z", "respondedAt": null
  },
  "emailSent": true }`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          The caller is the personal server&apos;s owner, or the team Owner of a team server. The app must be in the
          server&apos;s <code className={C}>ServerApp</code> list (<code className={C}>404 UNKNOWN_APP</code>); the
          person is found by the ordinary lookup (<code className={C}>404 NO_ACCOUNT</code>).{" "}
          <code className={C}>409 ALREADY_MEMBER</code> when they are in the server&apos;s team,{" "}
          <code className={C}>409 ALREADY_SHARED</code> for an accepted direct share of the app,{" "}
          <code className={C}>409 INVITE_PENDING</code> for a pending one.
        </li>
        <li>
          <code className={C}>DirectShareView</code> is{" "}
          <code className={C}>{`{ id, kind: 'direct', person, actions, status, expiresAt, sentAt, respondedAt }`}</code>
          ; <code className={C}>actions</code> here is the human list (<code className={C}>deploy</code>,{" "}
          <code className={C}>rollback</code>, <code className={C}>logs</code>) while the stored column holds the
          grant keys.
        </li>
        <li>
          <code className={C}>POST /api/v1/servers/:id/apps/:appId/shares/:shareId/resend?kind=direct</code> mints a
          new token and a new 24-hour expiry for a pending or expired share →{" "}
          <code className={C}>{`{ share, emailSent }`}</code>.{" "}
          <code className={C}>DELETE …/:shareId?kind=direct</code> revokes a pending or accepted one. Both are
          Owner-only and live: open pages and Shared with me update through <code className={C}>me:changed</code>.
        </li>
        <li>
          An accepted share resolves as a synthetic member with no team, scope <code className={C}>apps</code> and
          exactly the stored actions per app; every existing grant, scope and agent check then applies unchanged.
          The server is <strong className="text-foreground">not</strong> in{" "}
          <code className={C}>GET /servers</code> lists or <code className={C}>deploy-targets</code>; the person
          reaches it through <code className={C}>GET /me/shared</code> and <code className={C}>GET /servers/:id</code>.
        </li>
        <li>
          Deleting the app — a successful <code className={C}>{`hub:manageDeploy { action: 'delete' }`}</code> or the
          app dropping out of a non-empty <code className={C}>deploy:apps</code> list — deletes its{" "}
          <code className={C}>AppShare</code> rows, writes <code className={C}>appshare.delete</code> and tells the
          grantees live.
        </li>
      </ul>

      <h3 id="team-share-decisions" className="text-base font-bold mt-8 mb-3 text-foreground">
        Moving a server that has direct shares
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A server with pending or accepted direct shares cannot move without an explicit choice. A move that omits it
        is <code className={C}>409 SHARES_DECISION_REQUIRED</code> with{" "}
        <code className={C}>data.shares: DirectShareView[]</code> and the server unmoved.
      </p>
      <CodeBlock lang="json" filename="POST /api/v1/servers/:id/transfer">{`{
  "to": { "teamId": "…" },
  "confirmName": "web-1",
  "appShares": "keep"            // or "convert" into a team; "keep" | "revoke" to a person
}`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Into a team (<code className={C}>POST /servers/:id/transfer</code> to a team, or{" "}
          <code className={C}>mode: &apos;team&apos;</code> on a personal server):{" "}
          <code className={C}>keep</code> leaves the shares untouched, still working for people outside the team;{" "}
          <code className={C}>convert</code> turns each accepted share of a non-member into a membership with{" "}
          <code className={C}>roleIds: []</code> plus member and app allow overrides on that app with the same actions
          (no <code className={C}>TeamMemberApp</code> rows any more), and marks the row{" "}
          <code className={C}>converted</code> — never more than the share gave. Pending shares and shares of people
          already in the team are revoked and listed in the answer.
        </li>
        <li>
          To another person: <code className={C}>revoke</code> (the UI default) revokes them;{" "}
          <code className={C}>keep</code> leaves them for the new owner, who sees and can revoke them on the
          app&apos;s page.
        </li>
        <li>
          Convert and revoke happen inside the same transaction as the move, and are audited as{" "}
          <code className={C}>appshare.convert</code> and <code className={C}>appshare.revoke</code>. Any other or
          missing value with shares present is the 409 above.
        </li>
      </ul>

      <h3 id="team-shared" className="text-base font-bold mt-8 mb-3 text-foreground">Shared with me</h3>
      <CodeBlock lang="json" filename="GET /api/v1/me/shared">{`{
  "servers": [
    { "serverId": "…", "serverName": "web-1", "online": true,
      "kind": "team", "team": { "id": "…", "name": "Platform" }, "owner": null,
      "apps": [ { "appId": "site", "name": "Site", "actions": ["deploy.run"] } ] },
    { "serverId": "…", "serverName": "web-2", "online": true,
      "kind": "direct", "team": null, "owner": { "displayName": "Sara" },
      "apps": [ { "appId": "shop", "name": "Shop", "actions": ["deploy.run", "deploy.logs"] } ] }
  ],
  "appOnlyTeamIds": ["…"]
}`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Only the caller&apos;s own app access — from roles and both override levels, plus accepted direct shares — is
          listed; the Owner and a holder of <code className={C}>administrator</code> are never narrowed this way. Apps
          are grouped by server and servers are sorted by name.
        </li>
        <li>
          <code className={C}>kind</code> is <code className={C}>team</code> or <code className={C}>direct</code>. A
          direct group has <code className={C}>team: null</code> and{" "}
          <code className={C}>owner: {`{ displayName }`}</code> naming the person who shared it.
        </li>
        <li>
          <code className={C}>appOnlyTeamIds</code> names the teams the caller can reach only through an app override.
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
          policy (<code className={C}>MISSING_PERMISSION</code>, …), <code className={C}>AGENT_DEPLOY_OFF</code>,{" "}
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
          <code className={C}>notifications</code> and <code className={C}>processes</code>, only with{" "}
          <code className={C}>server.view</code>; a member who does not hold it gets none of them.
        </li>
        <li>
          <code className={C}>logs</code> only when <code className={C}>hub:getLogs.*</code> is allowed,{" "}
          <code className={C}>actionLog</code> only when <code className={C}>GET /servers/:id/actions</code> would
          answer, and <code className={C}>permissions</code> (after <code className={C}>settings</code>) only for the
          Owner and holders of <code className={C}>roles.manage</code> on a team server — never on a personal server
          or for a direct share. The ids are those eleven; the Hub computes them once and the UI maps them to its own
          labels and <code className={C}>?section=</code> values.
        </li>
      </ul>

      <h3 id="team-socket" className="text-base font-bold mt-8 mb-3 text-foreground">The me:changed event</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        When a role, an override, a member&apos;s roles, a share or an invitation changes, the Hub emits{" "}
        <code className={C}>me:changed</code> with an empty payload <code className={C}>{`{}`}</code> on the browser
        socket to every affected account — and, for a team change, to every member of that team, read from the database
        so a member with no server page open is reached too. The client only refetches teams, shared-with-me and
        invitations; no share detail, server id or key is sent. A change that removes access to an open server page
        still arrives as <code className={C}>server:&lt;id&gt;:accessRevoked</code>.
      </p>

      <h3 id="team-refusals" className="text-base font-bold mt-8 mb-3 text-foreground">Verdicts and the staff override</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          A permission verdict carries <code className={C}>code</code> as well as <code className={C}>reason</code>,
          including when it is allowed — for example <code className={C}>APP_ID_REQUIRED</code>. Read{" "}
          <code className={C}>code</code> when branching, and show <code className={C}>reason</code> to the person.
        </li>
        <li>
          The model&apos;s own refusals are <code className={C}>403 MISSING_PERMISSION</code> (the key is not in the
          resolved set; the key is named), <code className={C}>403 HIERARCHY</code> (the role or member is at or above
          yours; the role or member is named) and{" "}
          <code className={C}>400 UNKNOWN_PERMISSION</code> (a name outside the catalog, including an Owner-only
          action).
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
