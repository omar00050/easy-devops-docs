import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import { ArrowRight, Cloud, Server, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Hub Teams",
  description:
    "Share servers through the Easy DevOps Hub: invitations people accept, role presets and per-permission grants, per-app access, the permission ceiling the server still enforces, sharing an app, Shared with me, New deploy and the sidebar tree.",
  keywords: ["Easy DevOps Hub teams", "team invitations", "invite a person", "share an app", "shared with me", "team roles", "per-app access", "team audit log", "transfer server to team"],
  alternates: { canonical: "/docs/teams" },
  openGraph: {
    type: "article",
    url: "/docs/teams",
    siteName: "Easy DevOps",
    title: "Hub Teams",
    description:
      "Give other people access to your servers: role presets, permissions one by one, per-app limits, transfer and the audit log.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hub Teams",
    description:
      "Give other people access to your servers: role presets, permissions one by one, per-app limits, transfer and the audit log.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

/** A visible placeholder where the real screenshot belongs. */
function Screenshot({ caption }: { caption: string }) {
  return (
    <figure className="my-6 rounded-xl border border-dashed border-border bg-surface/40 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Screenshot</div>
      <figcaption className="mt-1 text-xs leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}

/** The agreed ROADMAP capability table: what each role can reach at most. */
const roles: Array<{ capability: string; viewer: string; member: string; admin: string; owner: string }> = [
  { capability: "See servers, apps, status", viewer: "✓", member: "✓", admin: "✓", owner: "✓" },
  { capability: "Deploy, roll back, start/stop", viewer: "—", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Read deployment logs", viewer: "if granted", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Create / edit apps", viewer: "—", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Environment variables, deploy tokens", viewer: "—", member: "—", admin: "✓", owner: "✓" },
  { capability: "Delete an app, a domain, a certificate", viewer: "—", member: "—", admin: "✓", owner: "✓" },
  { capability: "Add and remove people, set their permissions", viewer: "—", member: "—", admin: "—", owner: "✓" },
  { capability: "Remove a server, rotate its secret", viewer: "—", member: "—", admin: "—", owner: "✓" },
];

/** The starting set each role pre-fills, and how far the role can be widened. */
const presets: Array<{ role: string; preset: string; widest: string }> = [
  {
    role: "Viewer",
    preset: "None.",
    widest: "The three read permissions only: deploy logs, nginx configuration view, nginx logs view.",
  },
  {
    role: "Member",
    preset: "Deploy, roll back, read deployment logs, start, stop and restart processes.",
    widest:
      "Every permission whose minimum is Member: apps (create, edit, domain link, deploy key), domains create/edit/toggle, nginx start/stop/restart/reload/test, configs and logs view, SSL issue/renew. Never environment variables, never a delete, never config editing.",
  },
  {
    role: "Admin",
    preset: "Every admin-level permission.",
    widest:
      "The same admin-level list — you may untick some of it, but there is nothing above it to add. Still no people management, no server removal and no secret rotation.",
  },
  {
    role: "Owner",
    preset: "Everything.",
    widest: "Everything, implicitly. The Owner has no permission list and cannot be narrowed.",
  },
];

/** The permission list the Owner ticks, grouped like the server's own tree. */
const grantGroups: Array<{ group: string; grants: string[]; note: string }> = [
  {
    group: "Deployments",
    grants: ["deploy.manage", "deploy.env", "deploy.run", "deploy.rollback", "deploy.logs"],
    note: "Edit an app and its deploy key, view/change environment variables, deploy, roll back, read logs.",
  },
  {
    group: "Hub",
    grants: ["deploy.create"],
    note: "Create an app through the Hub (connect a repository and deploy it). The agent has no equivalent.",
  },
  {
    group: "Nginx",
    grants: [
      "nginx.start",
      "nginx.stop",
      "nginx.restart",
      "nginx.reload",
      "nginx.test",
      "nginx.config.view",
      "nginx.config.edit",
      "nginx.logs.view",
    ],
    note: "Control nginx, read or edit its configuration files, read its logs.",
  },
  {
    group: "Domains",
    grants: ["domains.create", "domains.edit", "domains.toggle", "domains.delete"],
    note: "Create, edit, enable/disable and delete domains.",
  },
  {
    group: "SSL",
    grants: ["ssl.issue", "ssl.renew", "ssl.renewAll", "ssl.delete"],
    note: "Issue, renew and delete certificates.",
  },
  {
    group: "Processes",
    grants: ["process.start", "process.stop", "process.restart"],
    note: "Start, stop and restart a process by name.",
  },
];

type PolicyRow = {
  command: string;
  action: string;
  minRole: "owner" | "admin" | "member" | "viewer";
  grant: string | null;
  scope: "app" | "server" | "app-list";
  agent: string | null;
};

/**
 * COMMAND_POLICY from hub_backend/src/lib/teamPolicy.ts, in the order
 * COMMAND_POLICY_DOC emits it (command A–Z, then action A–Z), with the agent
 * permission from permissionForCommand() in src/lib/permissions.ts. Copy it
 * from teamPolicy.ts and permissions.ts; do not edit it here by hand.
 */
const policy: PolicyRow[] = [
  { command: "hub:deployHook", action: "*", minRole: "owner", grant: "deploy.ci", scope: "server", agent: "deploy.ci" },
  { command: "hub:getConfigs", action: "*", minRole: "viewer", grant: "nginx.config.view", scope: "server", agent: "nginx.config.view" },
  { command: "hub:getLogs", action: "*", minRole: "viewer", grant: "nginx.logs.view", scope: "server", agent: "nginx.logs.view" },
  { command: "hub:manageDeploy", action: "addKeyToGithub", minRole: "admin", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "create", minRole: "member", grant: "deploy.create", scope: "server", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "delete", minRole: "admin", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "deleteRelease", minRole: "admin", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "deploy", minRole: "member", grant: "deploy.run", scope: "app", agent: "deploy.run" },
  { command: "hub:manageDeploy", action: "detail", minRole: "viewer", grant: null, scope: "app", agent: null },
  { command: "hub:manageDeploy", action: "getEnv", minRole: "admin", grant: "deploy.env", scope: "app", agent: "deploy.env" },
  { command: "hub:manageDeploy", action: "github", minRole: "member", grant: "deploy.manage", scope: "app", agent: null },
  { command: "hub:manageDeploy", action: "issueToken", minRole: "admin", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "linkDomain", minRole: "member", grant: "deploy.manage", scope: "app", agent: "deploy.manage + domains.create + domains.edit + nginx.reload (+ ssl.issue when a certificate is issued)" },
  { command: "hub:manageDeploy", action: "list", minRole: "viewer", grant: null, scope: "app-list", agent: null },
  { command: "hub:manageDeploy", action: "move", minRole: "member", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "regenerateKey", minRole: "admin", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "rollback", minRole: "member", grant: "deploy.rollback", scope: "app", agent: "deploy.rollback" },
  { command: "hub:manageDeploy", action: "run", minRole: "viewer", grant: "deploy.logs", scope: "app", agent: "deploy.logs" },
  { command: "hub:manageDeploy", action: "setEnv", minRole: "admin", grant: "deploy.env", scope: "app", agent: "deploy.env" },
  { command: "hub:manageDeploy", action: "testKey", minRole: "member", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "unlinkDomain", minRole: "member", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "update", minRole: "member", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDomain", action: "create", minRole: "member", grant: "domains.create", scope: "server", agent: "domains.create" },
  { command: "hub:manageDomain", action: "delete", minRole: "admin", grant: "domains.delete", scope: "server", agent: "domains.delete + nginx.reload (+ ssl.delete when the certificate goes too)" },
  { command: "hub:manageDomain", action: "reload", minRole: "member", grant: "nginx.reload", scope: "server", agent: "nginx.reload" },
  { command: "hub:manageDomain", action: "toggle", minRole: "member", grant: "domains.toggle", scope: "server", agent: "domains.toggle + nginx.reload" },
  { command: "hub:manageDomain", action: "update", minRole: "member", grant: "domains.edit", scope: "server", agent: "domains.edit" },
  { command: "hub:manageProcess", action: "restart", minRole: "member", grant: "process.restart", scope: "server", agent: "process.restart" },
  { command: "hub:manageProcess", action: "start", minRole: "member", grant: "process.start", scope: "server", agent: "process.start" },
  { command: "hub:manageProcess", action: "stop", minRole: "member", grant: "process.stop", scope: "server", agent: "process.stop" },
  { command: "hub:manageSSL", action: "delete", minRole: "admin", grant: "ssl.delete", scope: "server", agent: "ssl.delete" },
  { command: "hub:manageSSL", action: "issue", minRole: "member", grant: "ssl.issue", scope: "server", agent: "ssl.issue" },
  { command: "hub:manageSSL", action: "renew", minRole: "member", grant: "ssl.renew", scope: "server", agent: "ssl.renew" },
  { command: "hub:manageSSL", action: "renewAll", minRole: "member", grant: "ssl.renewAll", scope: "server", agent: "ssl.renewAll" },
  { command: "hub:manageSSL", action: "suggest", minRole: "viewer", grant: "nginx.config.view", scope: "server", agent: "nginx.config.view" },
  { command: "hub:nginxAction", action: "reload", minRole: "member", grant: "nginx.reload", scope: "server", agent: "nginx.reload" },
  { command: "hub:nginxAction", action: "restart", minRole: "member", grant: "nginx.restart", scope: "server", agent: "nginx.restart" },
  { command: "hub:nginxAction", action: "start", minRole: "member", grant: "nginx.start", scope: "server", agent: "nginx.start" },
  { command: "hub:nginxAction", action: "stop", minRole: "member", grant: "nginx.stop", scope: "server", agent: "nginx.stop" },
  { command: "hub:nginxAction", action: "test", minRole: "member", grant: "nginx.test", scope: "server", agent: "nginx.test" },
  { command: "hub:reloadNginx", action: "*", minRole: "member", grant: "nginx.reload", scope: "server", agent: "nginx.reload" },
  { command: "hub:saveConfig", action: "*", minRole: "admin", grant: "nginx.config.edit", scope: "server", agent: "nginx.config.edit" },
];

const ROLE_LABEL: Record<PolicyRow["minRole"], string> = {
  viewer: "Viewer",
  member: "Member",
  admin: "Admin",
  owner: "Owner",
};

const SCOPE_LABEL: Record<PolicyRow["scope"], string> = {
  app: "One app",
  server: "Server-wide",
  "app-list": "App list",
};

const serverActions: Array<{ action: string; minRole: string; scope: string }> = [
  { action: "server.view", minRole: "Viewer", scope: "App-scoped viewers allowed" },
  { action: "server.metrics", minRole: "Viewer", scope: "Server-wide" },
  { action: "server.rename", minRole: "Admin", scope: "Server-wide" },
  { action: "server.delete", minRole: "Owner", scope: "Server-wide" },
  { action: "server.rotateSecret", minRole: "Owner", scope: "Server-wide" },
  { action: "server.cliLink", minRole: "Owner", scope: "Server-wide" },
  { action: "server.transferOut", minRole: "Owner", scope: "Server-wide" },
  { action: "server.transferIn", minRole: "Admin", scope: "Server-wide" },
];

const teamActions: Array<{ action: string; minRole: string }> = [
  { action: "team.view", minRole: "Viewer" },
  { action: "team.rename", minRole: "Owner" },
  { action: "team.delete", minRole: "Owner" },
  { action: "members.manage", minRole: "Owner" },
  { action: "ownership.transfer", minRole: "Owner" },
  { action: "audit.view", minRole: "Admin" },
];

const errors: Array<{ code: string; status: string; meaning: string; next: string }> = [
  {
    code: "ROLE_TOO_LOW",
    status: "403",
    meaning: "Your team role cannot do this action.",
    next: "The message names the role you need (Member, Admin or Owner). Ask the Owner to raise your role, or ask an Admin or Owner to run it.",
  },
  {
    code: "NOT_GRANTED",
    status: "403",
    meaning: "Your role is high enough, but this permission is not in your list — or the app's narrowed permissions removed it for that one app.",
    next: "Ask the Owner to tick that permission for you (Members → your role's permissions), or to widen that app's permission list.",
  },
  {
    code: "APP_NOT_GRANTED",
    status: "403",
    meaning: "You can see this app but the Owner has not granted it to you for actions.",
    next: "Ask the Owner to tick “May act on this app” for you, or create the app yourself through the Hub — the Hub then grants it to its creator automatically.",
  },
  {
    code: "SERVER_WIDE_REFUSED",
    status: "403",
    meaning: "You may use selected apps on this server, and the action affects the whole server (nginx, domains, SSL, processes, creating an app).",
    next: "Use an app-scoped action, or ask the Owner to give you the whole server instead of selected apps.",
  },
  {
    code: "OUT_OF_SCOPE",
    status: "403",
    meaning: "The app id in the command is not in your access list.",
    next: "Reload the server so the app list reflects your scope. If the app should be yours, ask the Owner to add it under Access → Selected apps.",
  },
  {
    code: "UNKNOWN_APP",
    status: "400",
    meaning: "The Hub has not learned that app id from the server yet, so it cannot be granted.",
    next: "Open the server once in the Hub (or wait for its next report) so the app list is stored, then pick the app again.",
  },
  {
    code: "SCOPE_CONFLICT",
    status: "400",
    meaning: "A member update asked for all servers and a list of servers at the same time.",
    next: "Choose one: all servers, or selected servers. Saving a server list on its own already means \"only these servers\".",
  },
  {
    code: "NO_ACCOUNT",
    status: "404",
    meaning: "No Hub account matches that email address or username.",
    next: "The person must register first, with that exact address or username. Nothing is emailed and no invitation is created; invite them again once the account exists.",
  },
  {
    code: "ALREADY_MEMBER",
    status: "409",
    meaning: "That account is already in this team.",
    next: "Nothing to do — find them in Members and edit their role or permissions instead.",
  },
  {
    code: "USE_TRANSFER",
    status: "400",
    meaning: "Owner was chosen as a role in the invite or edit form. Ownership is never assigned like a role.",
    next: "Team settings → Ownership → Transfer ownership. The chosen member becomes the only Owner and you become Admin.",
  },
  {
    code: "OWNER_CANNOT_BE_REMOVED",
    status: "409",
    meaning: "The Owner tried to leave, or someone tried to remove the Owner. A team always keeps exactly one Owner.",
    next: "Transfer ownership to another member first, then leave or remove.",
  },
  {
    code: "OWNERSHIP_CONFLICT",
    status: "409",
    meaning: "Ownership changed while it was being transferred — the team did not end with exactly one Owner, so the transfer was rolled back.",
    next: "Reload the team, check who is Owner now and repeat the transfer.",
  },
  {
    code: "TEAM_TRANSFER_OWNERSHIP",
    status: "400",
    meaning: "A team server was offered to a person. A team server belongs to the team's Owner, so it cannot be handed to an individual.",
    next: "Move it to your personal space first (Settings → Transfer server → My personal space), then hand it to the person. Or transfer team ownership.",
  },
  {
    code: "TEAM_HAS_SERVERS",
    status: "409",
    meaning: "The team still holds servers, so it cannot be deleted.",
    next: "Move each server out (Settings → Transfer server) or delete it, then delete the team.",
  },
  {
    code: "TRANSFER_CONFLICT",
    status: "409",
    meaning: "The server changed while it was being moved — someone else transferred it, or it was deleted.",
    next: "Reload the Hub and check where the server is now, then repeat the move.",
  },
  {
    code: "ACCOUNT_HAS_SERVERS",
    status: "409",
    meaning: "You still own personal servers, so the account cannot be deleted.",
    next: "Hand each one to an existing member (Settings → Transfer server → A person) or delete it, then delete the account.",
  },
  {
    code: "OWNS_TEAM_SERVERS",
    status: "409",
    meaning: "You own one or more teams that still have servers. Every team server belongs to its Owner, and deleting your account would leave them without one.",
    next: "Transfer ownership of each named team, or move its servers out or delete them, then delete the account.",
  },
  {
    code: "AGENT_PERMISSION_OFF",
    status: "403",
    meaning:
      "The server itself has that permission switched off. This refusal carries no code: the message is \"This server has '<permission>' disabled. Enable it in the server's own dashboard: Settings → Hub.\"",
    next: "The Hub cannot override it. Someone with access to the server turns the permission on in Settings → Hub, or the command stays unavailable.",
  },
];

export default function TeamsPage() {
  return (
    <DocPage
      section="Operations"
      title="Hub Teams"
      description="A team lets several Hub accounts share the same servers. The Owner invites a person by the email or username of an existing account — nothing is granted until that person accepts in the Hub — and then sets each person's permissions one by one from the server's own list. Roles are presets and ceilings, and the server's permissions still apply on top: the Hub can only narrow them."
    >
      <div className="my-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-xl border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            <Server className="h-3.5 w-3.5 text-primary" />
            the server
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Its own permission tree in Settings → Hub. It never hears about teams.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1 text-muted sm:w-24">
          <span className="font-mono text-[9px] uppercase tracking-wider">narrows</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            <Users className="h-3.5 w-3.5" />
            the hub
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Role, permissions, app scope and per-app limits — decided per request.
          </p>
        </div>
      </div>

      <h2 id="what-is-a-team" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What a team is
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">A personal server belongs to one account.</strong> It is listed only for
          the account that added it, and that account is its Owner with everything allowed as far as the Hub is
          concerned. This is what every server is until you move it.
        </li>
        <li>
          <strong className="text-foreground">A team server belongs to the team.</strong> Access comes from your
          membership: your role, the permissions the Owner ticked for you, and the servers and apps you were given.
          Exactly one person is the team&apos;s Owner, and every server in the team belongs to that account
          (<code className={C}>Server.userId</code>). The account that added a server keeps no special rights once it
          is in a team.
        </li>
        <li>
          <strong className="text-foreground">A person joins only by accepting.</strong> The Owner invites an
          existing Hub account by email address or username. The Hub emails a single-use link that expires after
          24 hours and shows the same invitation in the person&apos;s sidebar; the membership is created only when
          they accept. The Owner can resend or revoke a pending invitation at any time.
        </li>
        <li>
          <strong className="text-foreground">Nothing moves into a team by itself.</strong> Creating a team moves no
          server. A server joins a team only when someone transfers it there, one server at a time.
        </li>
        <li>
          <strong className="text-foreground">The server-side agent never learns about teams.</strong> There is no new
          agent event, no protocol change and nothing to install or upgrade. The agent knows one Hub connection and
          its own permission tree, and it re-checks every command locally. Teams exist only inside the Hub.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        Staff roles in the Hub&apos;s <code className={C}>/management</code> area are a different thing: they are
        Hub-wide and do not grant access to anyone&apos;s team or servers.
      </p>

      <h2 id="joining-a-team" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Being invited
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        You become a member only by accepting an invitation. The Owner invites an existing Hub account by email
        address or username; the Hub sends an email and shows the same invitation in your sidebar under{" "}
        <strong className="text-foreground">Shared with me → Invitations</strong>. Until you accept, you are not in
        the team and none of its servers exist for you:
      </p>
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Invitation</div>
        <p className="mt-1 font-mono text-xs text-foreground">
          &lt;Owner&gt; invited you to &lt;team&gt; as &lt;role&gt;
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          <strong className="text-foreground">Accept</strong> joins the team, makes its servers appear and switches
          the Hub to it. <strong className="text-foreground">Decline</strong> answers the invitation for good; the
          Owner has to invite you again.
        </p>
      </div>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">The email link is single-use and lasts 24 hours.</strong> It opens the
          Hub at <code className={C}>/invite#&lt;token&gt;</code>; the token is in the URL fragment, so it never
          reaches a server log or a <code className={C}>Referer</code>. An expired, revoked or already used link says
          which it is and what to do next.
        </li>
        <li>
          <strong className="text-foreground">The email and the in-Hub invitation are the same invitation.</strong>{" "}
          Accept or decline either one; the other disappears. A mail failure never invalidates the in-Hub invitation.
        </li>
        <li>
          <strong className="text-foreground">An invitation belongs to one account.</strong> Opening the link signed
          in as someone else is refused with <code className={C}>WRONG_ACCOUNT</code>; sign in as the invited
          account. Accepting after you became a member meanwhile answers{" "}
          <code className={C}>ALREADY_MEMBER</code>.
        </li>
        <li>
          <strong className="text-foreground">You can leave at any time yourself.</strong> Open the team and use{" "}
          <strong className="text-foreground">Settings → Leave team</strong>. Your access to its servers goes at
          once.
        </li>
        <li>
          <strong className="text-foreground">Only the Owner can invite you again.</strong> Ask the Owner to send a
          new invitation; a revoked or declined one cannot be reused.
        </li>
        <li>
          <strong className="text-foreground">The Owner cannot leave.</strong> A team always keeps exactly one Owner,
          so the Hub refuses with <code className={C}>OWNER_CANNOT_BE_REMOVED</code>. Transfer ownership first, then
          leave as an Admin.
        </li>
      </ul>
      {/* SCREENSHOT: the invitation under Shared with me, and the /invite page the email link opens */}
      <Screenshot caption="An invitation under Shared with me, and the /invite page the email link opens, with Accept invitation and Decline." />

      <h2 id="ceiling" className="text-xl font-bold mt-10 mb-4 text-foreground">
        The permission ceiling
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        One rule decides every action: the <strong className="text-foreground">team role</strong>, the{" "}
        <strong className="text-foreground">permissions the Owner ticked for that person</strong>, their{" "}
        <strong className="text-foreground">server and app scope</strong>, and the{" "}
        <strong className="text-foreground">server&apos;s own Hub permissions</strong> (Settings → Hub on the server)
        must all allow it. Anything the server has switched off stays off, whatever a team says.
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Layer</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Where it is set</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Can it widen the server?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Team role</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Members list, by the Owner.</td>
              <td className="py-3 px-4 text-xs text-muted">No — it is a preset and a ceiling for the permissions below.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Permissions and scope</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">The member&apos;s Access area: the permission boxes, servers, apps, per-app action grants.</td>
              <td className="py-3 px-4 text-xs text-muted">No — they can only take away.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Server permissions</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">On the server, in its own dashboard: Settings → Hub.</td>
              <td className="py-3 px-4 text-xs text-muted">It is the ceiling. The Hub cannot change it.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-10 rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          narrowing only
        </div>
        <p className="text-muted leading-relaxed">
          A team Owner cannot give anyone more than the server allows, and cannot read the server&apos;s secrets. The
          agent re-checks each command against its own tree and remains the authority. A Hub that asks for a
          permission the server has switched off gets nothing done.
        </p>
      </div>

      <h2 id="roles" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Roles, presets and permissions
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Four roles, lowest to highest: <strong className="text-foreground">Viewer</strong>,{" "}
        <strong className="text-foreground">Member</strong>, <strong className="text-foreground">Admin</strong>,{" "}
        <strong className="text-foreground">Owner</strong>. A role is a <em>preset</em> — it fills the permission
        boxes when you choose it — and a <em>ceiling</em>: you may narrow it person by person, but never add a
        permission above the role. Only the Owner holds everything implicitly. Admins, Members and Viewers hold
        exactly the permissions ticked for them, so an Admin&apos;s list is explicit too.
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Role</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Preset (what a new person starts with)</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Widest the role can be</th>
            </tr>
          </thead>
          <tbody>
            {presets.map((row, index) => (
              <tr key={row.role} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap align-top">{row.role}</td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.preset}</td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.widest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The rule behind the ceiling: a permission belongs to the lowest role whose command needs it. A Viewer can
        hold only the three read permissions; a Member can hold anything whose minimum is Member (but never
        environment variables, config editing or a delete); an Admin can hold every admin-level permission. The Owner
        needs no list.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Group</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Permissions</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What they allow</th>
            </tr>
          </thead>
          <tbody>
            {grantGroups.map((row, index) => (
              <tr key={row.group} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap align-top">{row.group}</td>
                <td className="py-3 px-4 align-top">
                  <span className="space-x-1">
                    {row.grants.map((grant) => (
                      <code key={grant} className={C}>{grant}</code>
                    ))}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        This is the same list the server shows in its own Settings → Hub, plus{" "}
        <code className={C}>deploy.create</code> for &quot;may create an app&quot;, which exists only in the Hub.
        Ticking a permission here never switches anything on at the server; it only decides which of the
        server&apos;s allowed actions this person may ask the Hub for.
      </p>

      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Capability</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Viewer</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Member</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Admin</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Owner</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((row, index) => (
              <tr key={row.capability} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 text-xs font-semibold text-foreground">{row.capability}</td>
                <td className="py-3 px-4 text-xs text-muted">{row.viewer}</td>
                <td className="py-3 px-4 text-xs text-muted">{row.member}</td>
                <td className="py-3 px-4 text-xs text-muted">{row.admin}</td>
                <td className="py-3 px-4 text-xs text-muted">{row.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Only the Owner adds and removes people, sets their permissions, transfers ownership and deletes the team. An
        Admin may read the audit log and run everything the server allows, but cannot change who is in the team.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        A Viewer can be narrower than the table suggests: seeing the server is always allowed, but reading its
        configuration or logs needs the permission ticked. The next two tables are the exact rules the API applies.
      </p>

      <h2 id="command-policy" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What each command needs
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Every command the Hub can send, with the minimum team role, the permission the person must hold, the scope,
        and the permission the server must have switched on. The Owner holds every permission implicitly; everyone
        else needs the grant from their own list. &quot;Agent permission&quot; is the server-side check that comes
        after this one.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Command</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Min role</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Permission required</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Scope</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Agent permission</th>
            </tr>
          </thead>
          <tbody>
            {policy.map((row, index) => {
              const first = index === 0 || policy[index - 1].command !== row.command;
              const span = policy.filter((entry) => entry.command === row.command).length;
              return (
                <tr key={`${row.command}.${row.action}`} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                  {first && (
                    <td
                      rowSpan={span}
                      className="py-3 px-4 align-top font-mono text-xs text-primary whitespace-nowrap border-t border-border/60"
                    >
                      {row.command}
                    </td>
                  )}
                  <td className="py-3 px-4 font-mono text-xs text-foreground">{row.action}</td>
                  <td className="py-3 px-4 text-xs text-muted whitespace-nowrap">{ROLE_LABEL[row.minRole]}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted">{row.grant ?? "—"}</td>
                  <td className="py-3 px-4 text-xs text-muted whitespace-nowrap">{SCOPE_LABEL[row.scope]}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted">{row.agent ?? "none"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-10">
        <li>
          <code className={C}>hub:deployHook</code> is never sent by a person: only the CI endpoint uses it, with the
          app&apos;s own deploy token. It is listed so the table is complete, and a signed-in account cannot send it.
        </li>
        <li>
          <strong className="text-foreground">&quot;App list&quot;</strong> supplies no app id: the Hub returns only
          the apps you may see, with deployment output removed where you lack <code className={C}>deploy.logs</code>.
        </li>
        <li>
          <strong className="text-foreground">linkDomain</strong> also needs <code className={C}>ssl.issue</code> when
          the link issues a certificate; <strong className="text-foreground">manageDomain delete</strong> also needs{" "}
          <code className={C}>ssl.delete</code> when it is asked to delete the certificate with the domain.
        </li>
        <li>
          <strong className="text-foreground">Creating an app is server-wide</strong> on purpose (the app does not
          exist yet), so an app-scoped person cannot create one. A Member who creates an app through the Hub is
          granted that app automatically.
        </li>
      </ul>

      <h3 id="server-actions" className="text-base font-bold mt-8 mb-3 text-foreground">Actions on the server itself</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        These are not commands: they are the server&apos;s own endpoints. <code className={C}>server.view</code> is the
        one exception that lets an app-scoped person see that the server exists. Reading the server&apos;s action log
        follows <code className={C}>team audit.view</code> — Admin and Owner.
      </p>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Min role</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Scope</th>
            </tr>
          </thead>
          <tbody>
            {serverActions.map((row, index) => (
              <tr key={row.action} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 font-mono text-xs text-primary">{row.action}</td>
                <td className="py-3 px-4 text-xs text-muted whitespace-nowrap">{row.minRole}</td>
                <td className="py-3 px-4 text-xs text-muted">{row.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="team-actions" className="text-base font-bold mt-8 mb-3 text-foreground">Actions on the team</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A team has no app subset, so these have no scope of their own.
      </p>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Min role</th>
            </tr>
          </thead>
          <tbody>
            {teamActions.map((row, index) => (
              <tr key={row.action} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 font-mono text-xs text-primary">{row.action}</td>
                <td className="py-3 px-4 text-xs text-muted whitespace-nowrap">{row.minRole}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="access-scope" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What a limited person sees
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A Member or Viewer has three narrowing layers, all optional in the sense that the default is everything
        visible in the team:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">All servers, or selected servers.</strong> With selected servers the
          person sees only those, and every other server in the team does not exist for them — the API answers{" "}
          <code className={C}>404</code>, never <code className={C}>403</code>.
        </li>
        <li>
          <strong className="text-foreground">Per server: all apps, or selected apps.</strong> &quot;All apps&quot; is
          the default for a server you were given. With selected apps, the person sees the server but only those apps
          — the rest are not merely read-only, they are absent.
        </li>
        <li>
          <strong className="text-foreground">Per app: may act, and an optional permission list.</strong> An app the
          person may see but not act on is <em>see only</em>: it is listed, and every action on it is refused. Ticking{" "}
          <strong className="text-foreground">May act on this app</strong> grants actions there;{" "}
          <strong className="text-foreground">Narrow this app&apos;s permissions</strong> then limits which of the
          person&apos;s permissions apply to that one app. Narrowing never adds anything.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Because apps are listed server by server, giving someone one app means choosing that server first: the access
        form works down from servers to apps.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        What this changes in practice, for an app-scoped person:
      </p>
      <table className="w-full text-sm border-collapse mb-4">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">They see</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">They do not see</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">The server, its name and whether it is online; their own app list, filtered.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Servers or apps outside their scope — not as an empty list, as a missing server.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Status and deployment progress for those apps; log lines only with <code className={C}>deploy.logs</code> on that app.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Server-wide telemetry: nginx, domains, service, processes, channels, resources, metrics, nginx configs and nginx logs.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Their own command results, and the progress of a command they started.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Another person&apos;s command result or progress — even on the same server and app.</td>
          </tr>
        </tbody>
      </table>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Deployment output is stripped, not hidden by the interface: an app they can see without{" "}
          <code className={C}>deploy.logs</code> arrives without the last run&apos;s error, reason, warnings and log
          tail, and a progress frame arrives with no lines.
        </li>
        <li>
          <strong className="text-foreground">A new app belongs to its creator, the Admins and the Owner.</strong> A
          Member who creates an app through the Hub is granted it automatically. For every other Member it stays
          &quot;see only&quot; until the Owner grants it; Admins and the Owner are never narrowed. An app the Hub has
          not learned yet cannot be selected at all — save and you get <code className={C}>UNKNOWN_APP</code>. The
          list is learned whenever the server reports it, so open the server once after adding an app.
        </li>
        <li>
          <strong className="text-foreground">A change applies at once.</strong> Nothing is cached: the next request
          is authorised from the database, and a browser already watching the server is re-checked and told. A person
          whose access was removed loses the subscription and sees{" "}
          <code className={C}>accessRevoked</code>.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        Admins and Owners are never narrowed by app: they always hold the whole server within their permission list.
        If someone needs one app only, Member or Viewer is the role to use.
      </p>

      <h2 id="invite-a-person" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Invite a person
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Only the team Owner manages people (<code className={C}>members.manage</code>). An invitation names one
        existing Hub account, a role, its permissions and a scope; the person joins only when they accept it.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open the team&apos;s <strong className="text-foreground">Members</strong> area and choose{" "}
          <strong className="text-foreground">Invite a person</strong>.
        </li>
        <li>
          Type the person&apos;s <strong className="text-foreground">email address</strong> or{" "}
          <strong className="text-foreground">username</strong> (with or without a leading{" "}
          <code className={C}>@</code>). The form looks the account up and shows the display name and username before
          it will send — never an id and never an email address back. A miss answers{" "}
          <code className={C}>NO_ACCOUNT</code> with the same sentence for every reason: &quot;No Hub account
          matches. The person must create a Hub account first.&quot;
        </li>
        <li>
          Pick a <strong className="text-foreground">role</strong> — Admin, Member or Viewer, never Owner — and
          adjust the permission boxes. They start from the role&apos;s preset and can only be narrowed, exactly as
          in the Access editor.
        </li>
        <li>
          For a Member or Viewer, choose <strong className="text-foreground">All servers</strong> or{" "}
          <strong className="text-foreground">Selected servers</strong>, and per server All apps or Selected apps.
          Admins always hold the whole team.
        </li>
        <li>
          Choose <strong className="text-foreground">Send invitation</strong>. Nothing is granted yet: the Hub emails
          a single-use link valid for 24 hours and shows the same invitation in the person&apos;s sidebar. The
          response says whether the email left (<code className={C}>emailSent</code>); a mail failure keeps the
          in-Hub invitation usable.
        </li>
        <li>
          Follow it in <strong className="text-foreground">Pending invitations</strong>, above the member table:
          person, role, status, expiry, <strong className="text-foreground">Resend</strong> and{" "}
          <strong className="text-foreground">Revoke</strong>.
        </li>
      </ol>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Resend</strong> mints a new token and a new 24-hour expiry; the
          previous link stops working. <strong className="text-foreground">Revoke</strong> kills a pending
          invitation, and its link stops working too. Both are Owner-only and both are audited.
        </li>
        <li>
          <strong className="text-foreground">Refusals:</strong> <code className={C}>NO_ACCOUNT</code>,{" "}
          <code className={C}>ALREADY_MEMBER</code>, <code className={C}>INVITE_PENDING</code> (a second invitation
          for the same person; resend the existing one), <code className={C}>USE_TRANSFER</code> for Owner, and{" "}
          <code className={C}>CANNOT_INVITE</code> when the caller may not add people at all.
        </li>
        <li>
          <strong className="text-foreground">Looking a person up needs a right to invite.</strong> The caller must
          own a team or a personal server; otherwise <code className={C}>CANNOT_INVITE</code>. The lookup never
          reveals whether an address exists beyond the one generic answer.
        </li>
        <li>
          <strong className="text-foreground">One shared budget.</strong> Lookups, invitations and shares share 30
          requests per account per hour — every attempt counts, misses included — plus a per-IP limit; the answer is{" "}
          <code className={C}>429</code> with a <code className={C}>Retry-After</code>.
        </li>
      </ul>
      {/* SCREENSHOT: the Invite a person form with the lookup result, role preset, permissions and server scope */}
      <Screenshot caption="Invite a person: the email or username lookup result, the role preset, its permission boxes and the server scope." />

      <h2 id="share-an-app" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Share an app
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Sharing an app is an invitation scoped to one app and the actions you tick. It uses the same team model as
        everything else: an app share is a <code className={C}>TeamInvite</code> whose scope names that one app, and
        only the team Owner may create one.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open <strong className="text-foreground">Deployments</strong>, open the app and choose its{" "}
          <strong className="text-foreground">Sharing</strong> tab. The tab exists only for the team Owner; anyone
          else does not see it.
        </li>
        <li>
          Type the person&apos;s email address or username and confirm the account, as in Invite a person.
        </li>
        <li>
          Tick at least one action: <strong className="text-foreground">Deploy</strong>,{" "}
          <strong className="text-foreground">Roll back</strong> or <strong className="text-foreground">Logs</strong>
          . Logs alone makes the person a Viewer; anything else makes them a Member holding exactly those deploy
          grants.
        </li>
        <li>
          On a <strong className="text-foreground">personal server</strong>, choose the team the server moves into —
          one you own — or type a new team name. Sharing moves the server there in the same step. Read the notice
          first: you stay its owner, nothing on the server changes, and people see only what you grant.
        </li>
        <li>
          One confirmation names the move and the invitation; then send. The app appears for them under{" "}
          <strong className="text-foreground">Shared with me</strong> after they accept.
        </li>
      </ol>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Refusals:</strong>{" "}
          <code className={C}>ALREADY_MEMBER</code> (give them the app from the team&apos;s Members tab instead),{" "}
          <code className={C}>INVITE_PENDING</code> (the same app is already pending for that person),{" "}
          <code className={C}>UNKNOWN_APP</code> (open the server once so the Hub learns its apps),{" "}
          <code className={C}>NO_ACCOUNT</code> and <code className={C}>CANNOT_INVITE</code>.
        </li>
        <li>
          <strong className="text-foreground">Shared with</strong> lists pending and accepted people with their
          actions and expiry. <strong className="text-foreground">Revoke</strong> cancels a pending invitation, or
          removes a member&apos;s grant for this one app; when that membership then reaches nothing it is removed
          too. Open pages and Shared with me update at once.
        </li>
      </ul>
      {/* SCREENSHOT: the app's Sharing tab with the person, Deploy / Roll back / Logs and the Shared with list */}
      <Screenshot caption="The app's Sharing tab: the person, the three actions, and the people the app is already shared with." />

      <h2 id="shared-with-me" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Shared with me
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Everything another team gives you personally is collected under <strong className="text-foreground">Shared
        with me</strong> in the sidebar, so a one-app grant never means hunting through teams for the server.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open <code className={C}>/dashboard</code> and find <strong className="text-foreground">Shared with
          me</strong> under Personal and the teams (on a server page it sits under SERVERS).
        </li>
        <li>
          <strong className="text-foreground">Invitations come first</strong>: team, who invited you, your role, the
          app and server for a share, and the expiry. <strong className="text-foreground">Accept</strong> or{" "}
          <strong className="text-foreground">Decline</strong> there — the same answer as the email link.
        </li>
        <li>
          Accepted app shares follow, grouped by server name, one row per app. Choosing one opens that server&apos;s
          Deployments section at the app.
        </li>
        <li>
          With nothing shared the block is hidden on a server page and the dashboard tree says &quot;Nothing shared
          with you yet&quot;.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The list is live. When an Owner changes your access, revokes a share or invites you, the Hub sends{" "}
        <code className={C}>me:changed</code> and the sidebar, Shared with me and the invitations refetch without a
        reload. A server page you already have open is re-checked too; if that access was removed the page says so
        and the server leaves your tree.
      </p>
      {/* SCREENSHOT: Shared with me in the sidebar with pending invitations first, then apps grouped by server */}
      <Screenshot caption="Shared with me: pending invitations first, then the apps grouped by server name." />

      <h2 id="the-sidebar" className="text-xl font-bold mt-10 mb-4 text-foreground">
        The sidebar
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        On the fleet page the sidebar is a tree: <strong className="text-foreground">Personal</strong>, every team you
        belong to, then <strong className="text-foreground">Shared with me</strong>. Expanding a node lists its
        servers, and expanding a server shows only the sections you may open — overview, deployments and settings
        always; domains, ssl, nginx, notifications and processes for the whole server; logs and the action log only
        when your grants allow them. The list is the server&apos;s own <code className={C}>sections</code> field, so
        the tree never guesses a rule from a role.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Keyboard and search.</strong> Arrows move and open or close, Home and
          End jump, Enter opens, Space toggles; search appears above eight servers and filters by name.
        </li>
        <li>
          <strong className="text-foreground">Switching stays smooth.</strong> The tree, the switcher and the open
          server page stay in step, a direct link to a server outside the chosen context still opens, and the open
          nodes are remembered per account.
        </li>
        <li>
          <strong className="text-foreground">Motion is optional.</strong> Expands, fades and the server-switch fade
          use the Hub&apos;s short transitions; with <code className={C}>prefers-reduced-motion: reduce</code> they
          are instant.
        </li>
      </ul>
      {/* SCREENSHOT: the dashboard sidebar tree, a team expanded to servers and one server expanded to its sections */}
      <Screenshot caption="The dashboard sidebar tree: Personal and teams expanded to servers, and one server showing only the sections this account may open." />

      <h2 id="new-deploy" className="text-xl font-bold mt-10 mb-4 text-foreground">
        New deploy
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <strong className="text-foreground">New deploy</strong> starts from the fleet header, beside Add server, and
        asks for the server first. Every server you can see is listed with its team; one that cannot take a deploy
        stays visible, disabled, with the Hub&apos;s reason under its name.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Choose <strong className="text-foreground">New deploy</strong>.</li>
        <li>
          Choose a server. A server that cannot take the deploy carries the first matching reason: the Hub policy
          refuses the create for your role, grant or scope (the same sentence the create command would answer, for
          example <code className={C}>ROLE_TOO_LOW</code> or <code className={C}>NOT_GRANTED</code>); the server
          itself has Deployments switched off in its Settings → Hub; it is offline; or it runs as a Windows service
          and refuses Hub deploys.
        </li>
        <li>
          Continue opens the existing create form at{" "}
          <code className={C}>/dashboard/servers/&lt;id&gt;?section=deployments&amp;create=1</code>. When only one
          server can take the deploy, the Hub goes straight there.
        </li>
      </ol>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Server-side reasons come from the server:</strong> &quot;This server
          does not allow Hub deploys. Turn on Deployments in the server&apos;s Settings → Hub.&quot; and &quot;The
          server is offline.&quot; The service-account case says Easy DevOps runs as a Windows service there, that
          since 1.4.9 it refuses Hub deploys, and to deploy from the server itself. An older agent that does not
          report the state is treated as unknown, not refused.
        </li>
        <li>
          <strong className="text-foreground">The dialog never decides.</strong> The selectable flag and the reason
          come from <code className={C}>GET /servers/deploy-targets</code>; the UI does not derive either from the
          online badge or from a role.
        </li>
      </ul>
      {/* SCREENSHOT: New deploy → Choose a server, one server disabled with its reason shown under the name */}
      <Screenshot caption="New deploy: Choose a server, with a server that cannot take one disabled and its reason under the name." />

      <h2 id="steps" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Setting it up, step by step
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-6">
        Eight steps from an empty Hub to a team with a person limited to one app. Every one is reversible; the
        troubleshooting table at the end names the next step for each refusal.
      </p>

      <h3 id="step-1-create-a-team" className="text-base font-bold mt-8 mb-3 text-foreground">
        1. Create a team
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Open the team switcher at the top of the Hub and choose <strong className="text-foreground">Create team</strong>,
        then type a name (60 characters at most). You become the team&apos;s only{" "}
        <strong className="text-foreground">Owner</strong>; ownership moves later only through Transfer ownership.
        Creating teams is limited to 10 per account per hour; the limit answers <code className={C}>429</code> with a
        wait.
      </p>
      {/* SCREENSHOT: the team switcher open, with "Create team" at the bottom of the list */}
      <Screenshot caption="The team switcher, with Create team at the bottom of the list." />

      <h3 id="step-2-add-a-person" className="text-base font-bold mt-8 mb-3 text-foreground">
        2. Invite a person
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        In the team&apos;s <strong className="text-foreground">Members</strong> area, open{" "}
        <strong className="text-foreground">Invite a person</strong> and type the email address or username of
        someone who already has a Hub account. The form confirms the account before it will send. Pick a role and the
        permission boxes fill from its preset, then choose <strong className="text-foreground">Send invitation</strong>{" "}
        — the person joins only when they accept.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">It is an invitation, not an add.</strong> The Hub emails a single-use
          link that expires after 24 hours and shows the same invitation in the person&apos;s sidebar under Shared
          with me. Nothing is granted until they accept; you can resend or revoke it from Pending invitations.
        </li>
        <li>
          <strong className="text-foreground">The account must already exist.</strong> An address or username with no
          Hub account is refused with <code className={C}>NO_ACCOUNT</code>; ask the person to register first, then
          invite them again.
        </li>
        <li>
          <strong className="text-foreground">Owner is not in the role list.</strong> A team has exactly one Owner, so
          ownership is never handed out here: choosing Owner or editing the Owner gets{" "}
          <code className={C}>USE_TRANSFER</code>. Use Transfer ownership instead.
        </li>
        <li>
          <strong className="text-foreground">Already in the team, or already invited.</strong>{" "}
          <code className={C}>ALREADY_MEMBER</code> means the person is a member;{" "}
          <code className={C}>INVITE_PENDING</code> names the invitation already waiting, so resend that one instead
          of sending a second.
        </li>
        <li>
          <strong className="text-foreground">They start visible but not acting.</strong> Once they accept, a new
          Member or Viewer sees all of the team&apos;s servers and apps, but can act on no app until you grant it in
          step 4. Their preset permissions only take effect on the apps you grant.
        </li>
        <li>Lookups, invitations and shares share a budget of 30 per account per hour, every attempt counted, plus a per-IP limit.</li>
      </ul>
      {/* SCREENSHOT: the Invite a person form with the lookup result, Role, and the preset permission groups */}
      <Screenshot caption="The Invite a person form: the confirmed account, role, and the preset permissions the Owner may adjust." />

      <h3 id="step-3-choose-permissions" className="text-base font-bold mt-8 mb-3 text-foreground">
        3. Choose a role preset and adjust permissions one by one
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Open <strong className="text-foreground">Members</strong>, pick the person and open their{" "}
        <strong className="text-foreground">Access</strong> area. The role still decides the ceiling; the boxes decide
        what this person actually holds within it:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Changing the role applies its preset — <strong className="text-foreground">Viewer</strong> none,{" "}
          <strong className="text-foreground">Member</strong> deploy, rollback, deployment logs and process
          start/stop/restart, <strong className="text-foreground">Admin</strong> every admin-level permission. The two
          tables in <a href="#roles" className="text-primary hover:underline font-medium">Roles, presets and
          permissions</a> are the whole rule.
        </li>
        <li>
          Then tick or untick the permissions one by one. Only the keys the role can hold are offered; anything above
          it, and any key the Hub does not know, is dropped when you save.
        </li>
        <li>
          Promoting someone to Admin widens the server/app limits automatically (Admins always hold
          the whole team). Demoting also applies the new role&apos;s preset, so look over the boxes
          again afterwards.
        </li>
        <li>Choose <strong className="text-foreground">Save</strong>.</li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-6">
        A role never adds a permission the server has switched off. If the server has{" "}
        <code className={C}>domains.delete</code> disabled, an Admin&apos;s tick for it still gets nothing done — the
        agent refuses.
      </p>
      {/* SCREENSHOT: the member Access editor with the permission groups and the role's ceiling */}
      <Screenshot caption="The Access editor: the permission groups, with only the keys the chosen role can hold." />

      <h3 id="step-4-give-one-app" className="text-base font-bold mt-8 mb-3 text-foreground">
        4. Give a Member one app
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        In the same Access area, choose the server (see step 5 for selected servers), keep{" "}
        <strong className="text-foreground">All apps</strong> or choose <strong className="text-foreground">Selected
        apps</strong>, then grant the app for actions:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Tick <strong className="text-foreground">May act on this app</strong>. Without it the app is <em>see only</em>: it is listed and every action is refused with <code className={C}>APP_NOT_GRANTED</code>.</li>
        <li>Optionally tick <strong className="text-foreground">Narrow this app&apos;s permissions</strong> and choose a subset — for example deploy and logs but not rollback. Widen nothing here: the subset is taken from the permissions the person already holds.</li>
        <li>Choose <strong className="text-foreground">Save</strong>.</li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <strong className="text-foreground">A new app is different.</strong> Only its creator, the Admins and the
        Owner can act on an app created later. A Member who creates it through the Hub is granted it automatically; for
        every other Member it stays see-only until you grant it here.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-6">
        The Hub can only grant an app it has learned from the server. If the app is missing from the list, open the
        server once so its app list is stored, then come back; an unknown id answers{" "}
        <code className={C}>UNKNOWN_APP</code>.
      </p>
      {/* SCREENSHOT: Selected apps with one app's "May act on this app" ticked and its narrow list open */}
      <Screenshot caption="One app granted for actions, with its optional narrowed permission list." />

      <h3 id="step-5-limit-what-they-see" className="text-base font-bold mt-8 mb-3 text-foreground">
        5. Limit what a person sees
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The Access area works top-down: servers first, then apps.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Servers: All servers or Selected servers.</strong> With selected
          servers, the other servers of the team are a 404 for that person, not a 403 — they do not exist as far as
          their Hub is concerned.
        </li>
        <li>
          <strong className="text-foreground">On each chosen server: All apps or Selected apps.</strong> &quot;All
          apps&quot; shows every app the person may see, including new ones; &quot;Selected apps&quot; shows only the
          ticked apps, and the rest disappear.
        </li>
        <li>
          <strong className="text-foreground">On each chosen app: May act, then optionally a narrowed permission
          list.</strong> Leave May act off and the app is see-only.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Two things the form refuses: choosing all servers and a list of servers at the same time (
        <code className={C}>SCOPE_CONFLICT</code>), and an app the Hub has not learned from the server yet (
        <code className={C}>UNKNOWN_APP</code>). Choosing apps means choosing servers: the form cannot grant an app
        while leaving the person on all servers.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-6">
        Saving takes effect on the next request and re-checks any browser already watching that server. The person
        keeps their role; only what it reaches has changed.
      </p>
      {/* SCREENSHOT: Access showing Selected servers, one server expanded, Selected apps */}
      <Screenshot caption="Selected servers, one server expanded, and Selected apps beneath it." />

      <h3 id="step-6-move-a-server" className="text-base font-bold mt-8 mb-3 text-foreground">
        6. Move a server into the team — or hand one to a member
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        On the server page, open <strong className="text-foreground">Settings → Transfer server</strong>, choose where
        it should go and type the server&apos;s name to confirm. The name is required, deliberately: a server does not
        change hands on a single click.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">A team.</strong> A personal server joins the team and its ownership
          passes to that team&apos;s Owner. Moving between teams works the same way. The destination team needs an
          Admin or Owner among your roles; moving a server out of a team needs that team&apos;s Owner.
        </li>
        <li>
          <strong className="text-foreground">A person.</strong> A personal server can be handed to another person: it
          stays personal, now owned by them. The recipient must be a member of a team you own, which keeps the hand-over
          inside people you already know.
        </li>
        <li>
          <strong className="text-foreground">My personal space.</strong> An Owner can take a team server out of the
          team; only the Owner keeps it, now outside the team. A team server cannot be handed straight to a person — the
          Hub answers <code className={C}>TEAM_TRANSFER_OWNERSHIP</code>.
        </li>
        <li>
          <strong className="text-foreground">Nothing about the connection changes.</strong> The agent stays connected,
          the secret is not rotated, no pairing string is reissued and the server&apos;s local permissions are
          untouched. Only <code className={C}>teamId</code> and the owning account move.
        </li>
        <li>
          <strong className="text-foreground">The old team&apos;s scope rows are cleared.</strong> Access rules that
          named that server are removed rather than following it, so nobody keeps a key to a server that left.
        </li>
      </ul>
      {/* SCREENSHOT: Transfer server with the three destinations and the typed server-name confirmation */}
      <Screenshot caption="Transfer server: A team, A person, My personal space, and the typed server-name confirmation." />

      <h3 id="step-7-transfer-ownership" className="text-base font-bold mt-8 mb-3 text-foreground">
        7. Transfer team ownership
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A team has exactly one Owner. To hand it over, open <strong className="text-foreground">Settings →
        Ownership</strong>, choose the new Owner and confirm. The chosen member becomes Owner; you become Admin with
        the admin preset.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Every server follows the Owner.</strong> The team&apos;s servers change
          their owning account in the same transaction, because a team server is owned by the team&apos;s Owner.
        </li>
        <li>
          <strong className="text-foreground">The new Owner holds everything immediately</strong> and their old
          per-server/app limits are dropped. You keep the admin-level permissions.
        </li>
        <li>
          <strong className="text-foreground">It is one transaction.</strong> If the team would end with two Owners or
          none, the whole transfer is rolled back and the Hub answers{" "}
          <code className={C}>OWNERSHIP_CONFLICT</code>; reload and try again.
        </li>
        <li>
          <strong className="text-foreground">The Owner cannot leave or be removed</strong> (
          <code className={C}>OWNER_CANNOT_BE_REMOVED</code>). Transfer ownership first.
        </li>
      </ul>
      {/* SCREENSHOT: Settings → Ownership with the new-Owner picker and the transfer confirmation */}
      <Screenshot caption="Settings → Ownership: choose the member who becomes the only Owner." />

      <h3 id="step-8-audit" className="text-base font-bold mt-8 mb-3 text-foreground">
        8. Read the team audit log and a server&apos;s action log
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The team has an <strong className="text-foreground">Audit</strong> view for Admins and Owners: newest first, 50
        entries at a time, up to 200 per request, with an older-page cursor.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Recorded: team create, rename and delete; invitations sent, resent, revoked, accepted, declined and expired; a person updated, removed or leaving; ownership transfers; server transfers in and out; every command dispatched and every refusal; and the automatic grant of an app to its creator.</li>
        <li>
          <strong className="text-foreground">Commands are recorded by name</strong> — command, action, app id, request
          id, whether it was dispatched or refused, and the refusal code. Never the payload, never an environment
          value, never a secret or a token.
        </li>
        <li>Fields whose name looks sensitive (secret, token, password, env, key, content, payload) are dropped before the entry is written, and a long value is cut at 200 characters.</li>
        <li>Each entry carries who did it and the client address the Hub saw.</li>
        <li>Entries belong to the team, so they survive the account leaving. Deleting the team detaches them rather than erasing what was done.</li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Each server also has its own <strong className="text-foreground">Action log</strong> on its page — personal
        servers included. It shows the same kind of entries for that one server: commands, refusals and transfers,
        newest first, without a payload. The personal owner, a team Admin and the team Owner can read it; a Member or
        Viewer gets a role refusal.
      </p>
      {/* SCREENSHOT: the team audit list and a server's Action log side by side */}
      <Screenshot caption="The team audit list, and the server's own Action log with command, outcome and client address." />

      <h2 id="leaving" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Leaving, removing and deleting
      </h2>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Who</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What happens</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Leave the team</td>
            <td className="py-3 px-4 text-xs text-muted">Any member except the Owner</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Your membership goes and the team&apos;s servers leave your list at once. The Owner cannot leave: the Hub answers <code className={C}>OWNER_CANNOT_BE_REMOVED</code>.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Remove someone</td>
            <td className="py-3 px-4 text-xs text-muted">Owner</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Their membership and scope rows are deleted and their open sockets are told. The Owner cannot be removed — transfer ownership first.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Transfer ownership</td>
            <td className="py-3 px-4 text-xs text-muted">Owner</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">The chosen member becomes the only Owner and you become Admin. Every team server follows the new Owner. The team still has exactly one Owner.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Delete the team</td>
            <td className="py-3 px-4 text-xs text-muted">Owner, typing the team name</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Refused while the team holds servers (<code className={C}>TEAM_HAS_SERVERS</code>). Move them out or delete them first. Deleting removes the memberships.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Delete your account</td>
            <td className="py-3 px-4 text-xs text-muted">Any member, from account settings</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">
              Refused while you own personal servers (<code className={C}>ACCOUNT_HAS_SERVERS</code>) or an owned team
              still has servers (<code className={C}>OWNS_TEAM_SERVERS</code>, naming the teams). Servers are never
              deleted or handed on by a deletion; empty teams you own are dissolved, and teams you merely belong to
              just lose your membership.
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-muted leading-relaxed mb-2">
        <strong className="text-foreground">What to do before deleting an account:</strong>
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>
          For each personal server: <strong className="text-foreground">Settings → Transfer server → A person</strong>{" "}
          (a member of a team you own) or delete the server.
        </li>
        <li>
          For each team you own with servers: <strong className="text-foreground">Settings → Ownership → Transfer
          ownership</strong>, or move its servers out and delete them. Then delete the account.
        </li>
        <li>
          As a plain member: nothing to move. Your membership is removed and no server is touched. The deleted account
          also needs the emailed confirmation code, so SMTP must be configured on the Hub.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        A server that is deleted is removed from the team like any other server; its scope rows go with it. Moving the
        last server out of a team does not delete the team — do that yourself when you no longer need it.
      </p>

      <h3 id="staff-removing-a-server" className="text-base font-bold mt-8 mb-3 text-foreground">
        Removing a team server as Hub staff
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A server that belongs to a team is not removed from the staff <code className={C}>/management</code> page by a
        single click. The confirmation needs the explicit{" "}
        <strong className="text-foreground">&quot;remove it from the team anyway&quot;</strong> choice; without it
        nothing is removed and the page says why. The same rule is behind{" "}
        <code className={C}>409 TEAM_SERVER</code> in the API, which answers it unless the request body carries{" "}
        <code className={C}>teamOverride: true</code>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        The removal is recorded twice: once in the team&apos;s audit log, with who did it and the client address the
        Hub saw, and once in the staff action log. It is never a silent side effect of tidying the management list.
      </p>

      <h2 id="troubleshooting" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Troubleshooting by error code
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The Hub answers a refusal with the code below in the response body. A server you cannot see is answered{" "}
        <code className={C}>404</code>, not one of these — that is deliberate, so a server id cannot be probed.
      </p>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Code</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Status</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it means</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What to do</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((row, index) => (
              <tr key={row.code} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 font-mono text-xs text-primary align-top whitespace-nowrap">{row.code}</td>
                <td className="py-3 px-4 font-mono text-xs text-muted align-top">{row.status}</td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.meaning}</td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-10 flex flex-col items-start gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] p-5 sm:flex-row sm:items-center">
        <Cloud className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted leading-relaxed">
          Teams are a Hub feature only. Nothing on the server changes, nothing is installed, and an unpaired server is
          unaffected. See <a href="/docs/hub" className="text-primary hover:underline font-medium">Easy DevOps Hub</a>{" "}
          for pairing, the connection string and the server&apos;s own permission tree.
        </p>
      </div>

      <DocsPagination
        prev={{ title: "Easy DevOps Hub", href: "/docs/hub", section: "Operations" }}
        next={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
      />
    </DocPage>
  );
}
