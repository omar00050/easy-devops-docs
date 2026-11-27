import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import DocPage from "@/components/DocPage";
import { ArrowRight, Cloud, Server, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Hub Teams",
  description:
    "Share servers through the Easy DevOps Hub: invitations people accept, Discord-style roles with colours and positions, the permission catalog, per-server and per-app role and member overrides, private servers and apps, View as, the hierarchy limits, the permission ceiling the server still enforces, direct app shares and sharing through a team, Shared with me, New deploy and the sidebar tree.",
  keywords: ["Easy DevOps Hub teams", "team invitations", "invite a person", "share an app", "direct app share", "shared with me", "team roles", "role overrides", "per-app access", "view as", "team audit log", "transfer server to team"],
  alternates: { canonical: "/docs/teams" },
  openGraph: {
    type: "article",
    url: "/docs/teams",
    siteName: "Easy DevOps",
    title: "Hub Teams",
    description:
      "Give other people access to your servers: roles, allow and deny overrides, private servers and apps, View as, transfer and the audit log.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hub Teams",
    description:
      "Give other people access to your servers: roles, allow and deny overrides, private servers and apps, View as, transfer and the audit log.",
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

/** The built-in roles every new team is created with: what each one carries. */
const builtinRoles: Array<{ role: string; keys: string; note: string }> = [
  {
    role: "Admin",
    keys: "administrator",
    note: "administrator means every key at once — all server and app keys plus the team keys, except the Owner-only actions. Someone holding it ignores overrides, so it cannot be narrowed per person.",
  },
  {
    role: "Member",
    keys: "deploy.run, deploy.rollback, deploy.logs, process.start, process.stop, process.restart",
    note: "The deploy actions and process control on every app it can see, nothing else. Edit the role, or use overrides, to change that.",
  },
  {
    role: "Viewer",
    keys: "No keys of its own",
    note: "View only, from @everyone: the view keys below. Assign it alone and the person can look and do nothing.",
  },
  {
    role: "@everyone",
    keys: "server.view, app.view, stats.view, domains.view, ssl.view, nginx.view, processes.view, notifications.view",
    note: "Every member holds it implicitly; it sits at position 0 and cannot be renamed, moved or deleted. Its keys can be edited, and it is the usual target for a private server or app. logs.view is not in the default: the Logs section stays closed until a role or an override grants it.",
  },
];

/** The starting capability table: what the built-in role defaults reach at most. */
const roles: Array<{ capability: string; viewer: string; member: string; admin: string; owner: string }> = [
  { capability: "See servers, apps and their deployments", viewer: "✓", member: "✓", admin: "✓", owner: "✓" },
  { capability: "See a section's data (domains, SSL, nginx, processes, notifications)", viewer: "✓", member: "✓", admin: "✓", owner: "✓" },
  { capability: "Open Logs and the Action log", viewer: "if granted", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Deploy, roll back, start/stop", viewer: "—", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Read deployment logs", viewer: "if granted", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Create / edit apps", viewer: "—", member: "if granted", admin: "✓", owner: "✓" },
  { capability: "Environment variables, deploy tokens", viewer: "—", member: "—", admin: "✓", owner: "✓" },
  { capability: "Delete an app, a domain, a certificate", viewer: "—", member: "—", admin: "✓", owner: "✓" },
  { capability: "Add and remove people, set their permissions", viewer: "—", member: "—", admin: "—", owner: "✓" },
  { capability: "Remove a server, rotate its secret", viewer: "—", member: "—", admin: "—", owner: "✓" },
];

/** The catalog, grouped the way the editor shows it; the group's view key comes first. */
const grantGroups: Array<{ group: string; view: string | null; viewLabel: string; grants: string[]; note: string }> = [
  {
    group: "General",
    view: "server.view",
    viewLabel: "See the server and its overview.",
    grants: ["stats.view", "server.manage"],
    note: "See a team server and open its overview; See server stats (stats.view) adds its live service state, CPU and memory (resources), metrics and the agent's permission state; server.manage renames a server or moves a personal server into the team. Someone limited to chosen apps gets the live stats only if stats.view is granted to them.",
  },
  {
    group: "Deployments",
    view: "app.view",
    viewLabel: "See apps and deployments.",
    grants: ["deploy.create", "deploy.ci", "deploy.run", "deploy.rollback", "deploy.logs", "deploy.manage", "deploy.admin", "deploy.env"],
    note: "Create an app through the Hub, accept a CI deploy, deploy, roll back, read logs, edit or delete an app and its deploy key, read or change environment variables. deploy.ci, deploy.admin and deploy.env are dangerous.",
  },
  {
    group: "Domains",
    view: "domains.view",
    viewLabel: "See domains.",
    grants: ["domains.create", "domains.edit", "domains.toggle", "domains.delete"],
    note: "Create, edit, enable/disable and delete domains. domains.delete is dangerous.",
  },
  {
    group: "SSL",
    view: "ssl.view",
    viewLabel: "See SSL certificates.",
    grants: ["ssl.issue", "ssl.renew", "ssl.renewAll", "ssl.delete"],
    note: "Issue, renew and delete certificates. ssl.delete is dangerous.",
  },
  {
    group: "Nginx",
    view: "nginx.view",
    viewLabel: "See nginx.",
    grants: [
      "nginx.start",
      "nginx.stop",
      "nginx.restart",
      "nginx.reload",
      "nginx.test",
      "nginx.config.view",
      "nginx.config.edit",
    ],
    note: "Control nginx, read or edit its configuration files. nginx.config.edit is dangerous.",
  },
  {
    group: "Processes",
    view: "processes.view",
    viewLabel: "See processes.",
    grants: ["process.start", "process.stop", "process.restart"],
    note: "Start, stop and restart a process by name.",
  },
  {
    group: "Logs",
    view: "logs.view",
    viewLabel: "See logs.",
    grants: ["nginx.logs.view"],
    note: "Open the Logs section and read the nginx error log. logs.view is the one view key @everyone does not start with.",
  },
  {
    group: "Notifications",
    view: "notifications.view",
    viewLabel: "See notifications.",
    grants: [],
    note: "See the server's notification channels. The view switch is the only key in the group.",
  },
  {
    group: "Action log",
    view: "audit.view",
    viewLabel: "See the action log — a team key, so roles only.",
    grants: [],
    note: "Read the team audit log and each server's Action log. It never appears in a server or app override.",
  },
  {
    group: "Team",
    view: null,
    viewLabel: "",
    grants: ["administrator", "members.manage", "roles.manage"],
    note: "Everything at once, manage people, and manage roles. All three are dangerous and team-level: they never appear in a server or app override.",
  },
];

type PolicyRow = {
  command: string;
  action: string;
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
  { command: "hub:deployHook", action: "*", grant: "deploy.ci", scope: "server", agent: "deploy.ci" },
  { command: "hub:getConfigs", action: "*", grant: "nginx.config.view", scope: "server", agent: "nginx.config.view" },
  { command: "hub:getLogs", action: "*", grant: "nginx.logs.view", scope: "server", agent: "nginx.logs.view" },
  { command: "hub:manageDeploy", action: "addKeyToGithub", grant: "deploy.admin", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "create", grant: "deploy.create", scope: "server", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "delete", grant: "deploy.admin", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "deleteRelease", grant: "deploy.admin", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "deploy", grant: "deploy.run", scope: "app", agent: "deploy.run" },
  { command: "hub:manageDeploy", action: "detail", grant: null, scope: "app", agent: null },
  { command: "hub:manageDeploy", action: "getEnv", grant: "deploy.env", scope: "app", agent: "deploy.env" },
  { command: "hub:manageDeploy", action: "github", grant: "deploy.manage", scope: "app", agent: null },
  { command: "hub:manageDeploy", action: "issueToken", grant: "deploy.admin", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "linkDomain", grant: "deploy.manage", scope: "app", agent: "deploy.manage + domains.create + domains.edit + nginx.reload (+ ssl.issue when a certificate is issued)" },
  { command: "hub:manageDeploy", action: "list", grant: null, scope: "app-list", agent: null },
  { command: "hub:manageDeploy", action: "move", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "regenerateKey", grant: "deploy.admin", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "rollback", grant: "deploy.rollback", scope: "app", agent: "deploy.rollback" },
  { command: "hub:manageDeploy", action: "run", grant: "deploy.logs", scope: "app", agent: "deploy.logs" },
  { command: "hub:manageDeploy", action: "setEnv", grant: "deploy.env", scope: "app", agent: "deploy.env" },
  { command: "hub:manageDeploy", action: "testKey", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "unlinkDomain", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDeploy", action: "update", grant: "deploy.manage", scope: "app", agent: "deploy.manage" },
  { command: "hub:manageDomain", action: "create", grant: "domains.create", scope: "server", agent: "domains.create" },
  { command: "hub:manageDomain", action: "delete", grant: "domains.delete", scope: "server", agent: "domains.delete + nginx.reload (+ ssl.delete when the certificate goes too)" },
  { command: "hub:manageDomain", action: "reload", grant: "nginx.reload", scope: "server", agent: "nginx.reload" },
  { command: "hub:manageDomain", action: "toggle", grant: "domains.toggle", scope: "server", agent: "domains.toggle + nginx.reload" },
  { command: "hub:manageDomain", action: "update", grant: "domains.edit", scope: "server", agent: "domains.edit" },
  { command: "hub:manageProcess", action: "restart", grant: "process.restart", scope: "server", agent: "process.restart" },
  { command: "hub:manageProcess", action: "start", grant: "process.start", scope: "server", agent: "process.start" },
  { command: "hub:manageProcess", action: "stop", grant: "process.stop", scope: "server", agent: "process.stop" },
  { command: "hub:manageSSL", action: "delete", grant: "ssl.delete", scope: "server", agent: "ssl.delete" },
  { command: "hub:manageSSL", action: "issue", grant: "ssl.issue", scope: "server", agent: "ssl.issue" },
  { command: "hub:manageSSL", action: "renew", grant: "ssl.renew", scope: "server", agent: "ssl.renew" },
  { command: "hub:manageSSL", action: "renewAll", grant: "ssl.renewAll", scope: "server", agent: "ssl.renewAll" },
  { command: "hub:manageSSL", action: "suggest", grant: "nginx.config.view", scope: "server", agent: "nginx.config.view" },
  { command: "hub:nginxAction", action: "reload", grant: "nginx.reload", scope: "server", agent: "nginx.reload" },
  { command: "hub:nginxAction", action: "restart", grant: "nginx.restart", scope: "server", agent: "nginx.restart" },
  { command: "hub:nginxAction", action: "start", grant: "nginx.start", scope: "server", agent: "nginx.start" },
  { command: "hub:nginxAction", action: "stop", grant: "nginx.stop", scope: "server", agent: "nginx.stop" },
  { command: "hub:nginxAction", action: "test", grant: "nginx.test", scope: "server", agent: "nginx.test" },
  { command: "hub:reloadNginx", action: "*", grant: "nginx.reload", scope: "server", agent: "nginx.reload" },
  { command: "hub:saveConfig", action: "*", grant: "nginx.config.edit", scope: "server", agent: "nginx.config.edit" },
];

const SCOPE_LABEL: Record<PolicyRow["scope"], string> = {
  app: "One app",
  server: "Server-wide",
  "app-list": "App list",
};

const serverActions: Array<{ action: string; key: string; scope: string }> = [
  { action: "server.view", key: "server.view", scope: "What makes the server visible at all" },
  { action: "server.metrics", key: "server.view", scope: "Server-wide" },
  { action: "server.rename", key: "server.manage", scope: "Server-wide" },
  { action: "server.transferIn", key: "server.manage", scope: "Moving a personal server into the team" },
  { action: "server.delete", key: "Owner only", scope: "Never grantable" },
  { action: "server.rotateSecret", key: "Owner only", scope: "Never grantable" },
  { action: "server.cliLink", key: "Owner only", scope: "Never grantable" },
  { action: "server.transferOut", key: "Owner only", scope: "Never grantable" },
];

const teamActions: Array<{ action: string; key: string }> = [
  { action: "audit.view", key: "audit.view (team key)" },
  { action: "members.manage", key: "members.manage (team key)" },
  { action: "roles.manage", key: "roles.manage (team key)" },
  { action: "administrator", key: "administrator (team key: every key except the Owner-only actions)" },
  { action: "team.rename", key: "Owner only" },
  { action: "team.delete", key: "Owner only" },
  { action: "ownership.transfer", key: "Owner only" },
];

const errors: Array<{ code: string; status: string; meaning: string; next: string }> = [
  {
    code: "MISSING_PERMISSION",
    status: "403",
    meaning:
      "The key this action needs is not in your resolved set for that server — or, for an app action, for that one app. The answer names the key.",
    next: "Ask the Owner or a manager to add the key to one of your roles, or to write an allow override for you (or your role) on that server or app. View as shows exactly which key is missing.",
  },
  {
    code: "HIERARCHY",
    status: "403",
    meaning:
      "You tried to change a role or a member at or above your own highest role, or to grant or remove a key you do not hold yourself. The answer names the role, member or key.",
    next: "Work only below your highest role. The Owner can do everything; ask them if the change has to happen higher up.",
  },
  {
    code: "UNKNOWN_PERMISSION",
    status: "400",
    meaning:
      "A request named a permission the Hub does not know — including one of the Owner-only actions, which are not permissions at all.",
    next: "Send a key from the catalog only. Delete the team, transfer ownership, remove a server, rotate its secret and create a CLI pairing link are the Owner's alone and can never be granted.",
  },
  {
    code: "UNKNOWN_APP",
    status: "400",
    meaning: "The Hub has not learned that app id from the server yet, so it cannot be named in an override or a share.",
    next: "Open the server once in the Hub (or wait for its next report) so the app list is stored, then pick the app again.",
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
    next: "Nothing to do — find them in Members and change their roles, or write an override instead.",
  },
  {
    code: "ALREADY_SHARED",
    status: "409",
    meaning: "That account already holds an accepted direct share of this app.",
    next: "They can use the app now. Revoke the existing share on the app's Sharing tab first if you want to send a new one with different actions.",
  },
  {
    code: "SHARES_DECISION_REQUIRED",
    status: "409",
    meaning:
      "The server has pending or accepted direct app shares, so it cannot move until you decide what happens to them.",
    next: "Choose Keep or Turn into team app grants when moving it into a team, or Revoke these shares (the default) or Keep them for the new owner when handing it to a person. The Hub lists the people involved and then repeats the move.",
  },
  {
    code: "USE_TRANSFER",
    status: "400",
    meaning: "Owner was chosen as a role in the invite or edit form. Ownership is never assigned like a role.",
    next: "Team settings → Ownership → Transfer ownership. The chosen member becomes the only Owner and sits above every role.",
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
      description="A team lets several Hub accounts share the same servers. The Owner invites a person by the email or username of an existing account — nothing is granted until that person accepts in the Hub — and then grants access with roles, not with a fixed ladder: every member holds @everyone plus any roles assigned, and allow or deny overrides on one server or one app change what those roles reach. The server's own permissions still apply on top: the Hub can only ask for what the server allows."
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
            Roles, overrides and the resolution order — decided per request.
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
          membership: <strong className="text-foreground">@everyone</strong> always, plus every role assigned to you,
          plus the allow and deny overrides written for one of those roles or for you on one server or one app. Exactly
          one person is the team&apos;s Owner, and every server in the team belongs to that account
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
          &lt;Owner&gt; invited you to &lt;team&gt; with the roles &lt;roles&gt;
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
          leave with whatever roles you hold.
        </li>
      </ul>
      {/* SCREENSHOT: the invitation under Shared with me, and the /invite page the email link opens */}
      <Screenshot caption="An invitation under Shared with me, and the /invite page the email link opens, with Accept invitation and Decline." />

      <h2 id="ceiling" className="text-xl font-bold mt-10 mb-4 text-foreground">
        The permission ceiling
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        One rule decides every action: the <strong className="text-foreground">keys your roles carry</strong>, the{" "}
        <strong className="text-foreground">allow and deny overrides</strong> written for those roles or for you on
        that server or app, and the <strong className="text-foreground">server&apos;s own Hub permissions</strong>{" "}
        (Settings → Hub on the server) must all allow it. Anything the server has switched off stays off, whatever a
        team says.
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Layer</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Where it is set</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it decides</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">The catalog</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Nothing to set: it ships with the Hub.</td>
              <td className="py-3 px-4 text-xs text-muted">Which names are permissions at all, their level (team, server or app) and whether they are dangerous. The Owner-only actions are not in it.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Roles</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">Members → Roles: @everyone, the built-in Admin, Member and Viewer, and any custom role.</td>
              <td className="py-3 px-4 text-xs text-muted">Which keys a person holds everywhere in the team. A member holds @everyone plus every role assigned to them; the keys add up.</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Overrides</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">A server&apos;s Permissions section, and an app&apos;s Permissions tab.</td>
              <td className="py-3 px-4 text-xs text-muted">What changes for one role or one member there: allow a key, deny a key, or inherit (not mentioned). Nothing else is affected.</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">The resolution order</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed">One order, applied per request — described under Permissions and overrides.</td>
              <td className="py-3 px-4 text-xs text-muted">The final set for that person on that server or app, and whether the server or app is visible at all.</td>
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
        Roles
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Access is built from roles, not from a fixed ladder. Every team starts with four and you can add any number:
        the keys of every role a person holds are added together, and <code className={C}>@everyone</code> is always
        one of them.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open the team → <strong className="text-foreground">Members</strong> →{" "}
          <strong className="text-foreground">Roles</strong>. The list is top first: the highest role in the hierarchy
          at the top, <code className={C}>@everyone</code> always at the bottom.
        </li>
        <li>
          Open a role to edit its <strong className="text-foreground">name</strong>, its{" "}
          <strong className="text-foreground">colour</strong> and its <strong className="text-foreground">keys</strong>.
          Keys are ticked from the catalog, grouped General, Deployments, Domains, SSL, Nginx, Processes, Logs,
          Notifications, Action log and Team; the first switch of a group is that section&apos;s view permission, and a
          dangerous key carries a warning.
        </li>
        <li>
          <strong className="text-foreground">New role</strong> adds your own: a name unique in the team, an optional
          colour and any keys. It is placed just below your own highest role, so nobody can invent a role above
          themselves.
        </li>
        <li>
          Drag to reorder, or use the arrows. The order is the <a href="#hierarchy" className="text-primary hover:underline font-medium">hierarchy</a>;
          <code className={C}>@everyone</code> stays at position 0 and cannot be moved.
        </li>
        <li>
          <strong className="text-foreground">Assign roles</strong> on the Members tab: pick a person, tick every role
          they should hold, save. A person may hold any number of roles and their keys add up;{" "}
          <code className={C}>@everyone</code> is included and cannot be removed.
        </li>
        <li>
          <strong className="text-foreground">Delete</strong> a role. Everyone who held it loses those keys at once,
          and the overrides written for that role go with it. A member with no roles left is back to @everyone.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Every section has its own view permission, and it is the{" "}
        <strong className="text-foreground">first switch of its group</strong>:{" "}
        <code className={C}>server.view</code> for the server and its overview, <code className={C}>app.view</code> for
        apps and deployments, then <code className={C}>domains.view</code>, <code className={C}>ssl.view</code>,{" "}
        <code className={C}>nginx.view</code>, <code className={C}>processes.view</code>,{" "}
        <code className={C}>logs.view</code>, <code className={C}>notifications.view</code> and{" "}
        <code className={C}>audit.view</code> for the action log. The rest of a group only works while its view
        permission is on: the editor greys those switches out, and turning one of them on turns its view switch on with
        it.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Each group also has a master switch that reads{" "}
        <strong className="text-foreground">All</strong>, <strong className="text-foreground">None</strong> or{" "}
        <strong className="text-foreground">Mixed</strong> and sets every key in the group at once.{" "}
        <code className={C}>app.view</code> decides only which apps and deployments someone sees; the server-wide
        sections follow their own view keys, not it. A saved role reaches everyone who holds it at once, on the pages
        they already have open.
      </p>
      <Screenshot caption="The Roles tab: name, colour, position and key count per role, @everyone pinned at the bottom, and New role." />
      <p className="text-sm text-muted leading-relaxed mb-4">
        The four roles created with every team are ordinary roles — rename, recolour, edit, reorder or delete any of
        them; only @everyone is fixed in place. These are the keys they start with:
      </p>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Role</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Keys it starts with</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What that means</th>
            </tr>
          </thead>
          <tbody>
            {builtinRoles.map((row, index) => (
              <tr key={row.role} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap align-top">{row.role}</td>
                <td className="py-3 px-4 font-mono text-xs text-muted leading-relaxed align-top">{row.keys}</td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The Owner is not a role. The Owner sits above every role, holds every key and every Owner-only action, and
        can be neither granted nor narrowed; ownership moves only through{" "}
        <strong className="text-foreground">Transfer ownership</strong>.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        What the built-in defaults reach, before anyone adds a custom role or an override:
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
        Read it as the defaults, not as a ceiling. A custom role may hold any key directly, and an override may add or
        remove one on a single server or app. What never changes: nothing can rise above the server&apos;s own
        permissions, and the Owner-only actions cannot be granted at all.
      </p>
      <h3 id="legacy-roles" className="text-base font-bold mt-8 mb-3 text-foreground">
        Roles from before roles
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A team that already existed when roles replaced the old fixed model may still hold{" "}
        <strong className="text-foreground">Admin (before roles)</strong> roles. The backfill translated each old admin
        grant set into a real role so that every resolved decision stayed identical, so one role can exist per distinct
        grant set — <strong className="text-foreground">Admin (before roles)</strong>,{" "}
        <strong className="text-foreground">Admin (before roles) 2</strong>, and so on. They are ordinary roles carrying
        the keys those admins actually held, and they carry no <code className={C}>administrator</code>: old admins never
        had it. The Roles tab marks each one &quot;Legacy role from before roles — review it&quot;.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-10">
        <strong className="text-foreground">Move its members to Admin</strong> gives the built-in Admin role to everyone
        holding the legacy role and takes the legacy role away from them, in one transaction: each of them gains{" "}
        <code className={C}>administrator</code>, and the legacy role stays in the list, now empty. Only the Owner sees
        the button; a confirmation names how many people gain <code className={C}>administrator</code> before anything
        is written, and the move is audited as <code className={C}>role.move-to-admin</code> with that count. Reviewing
        or editing the role, or deleting it, works as for any other role.
      </p>

      <h2 id="permissions-and-overrides" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Permissions and overrides
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A role says what a person holds across the whole team. An <strong className="text-foreground">override</strong>{" "}
        says what changes for one role or one member on one server, or on one app of that server. Each key is
        tri-state: <strong className="text-foreground">inherit</strong> (not mentioned),{" "}
        <strong className="text-foreground">allow</strong> (add it) or <strong className="text-foreground">deny</strong>{" "}
        (take it away). A key is never in both lists; an override with both empty is deleted.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open the server and choose <strong className="text-foreground">Permissions</strong>, after Settings in the
          server&apos;s sections. Only the Owner and holders of <code className={C}>roles.manage</code> see it, and it
          never appears on a personal server or for a direct share.
        </li>
        <li>
          Pick the <strong className="text-foreground">target</strong>: a role, one member, or{" "}
          <code className={C}>@everyone</code>. @everyone is a target like any other — it is how a server or an app is
          made private.
        </li>
        <li>
          For each key choose <strong className="text-foreground">allow</strong>,{" "}
          <strong className="text-foreground">deny</strong>, or leave it at inherit. Server overrides accept server-
          and app-level keys; app overrides accept app-level keys only. Team keys (administrator, members.manage,
          roles.manage, audit.view) never appear in an override.
        </li>
        <li>
          Choose <strong className="text-foreground">Save</strong>. Clearing both lists deletes the override, so the
          target follows its roles again.
        </li>
        <li>
          For one app, open the app and its <strong className="text-foreground">Permissions</strong> tab and repeat.
          App overrides sit on top of the server ones, which stay in force.
        </li>
        <li>
          Every write is audited (<code className={C}>override.set</code>,{" "}
          <code className={C}>override.delete</code>) and reaches every open page of the team at once — nobody has to
          refresh.
        </li>
      </ol>
      <Screenshot caption="The Permissions editor on a team server: the target picker, the grouped keys, and allow / inherit / deny on one row." />

      <h3 id="section-views" className="text-base font-bold mt-8 mb-3 text-foreground">
        Section views and group switches
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Every section has its own view permission, and it is the first switch of its group:
      </p>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Overview</strong> — <code className={C}>server.view</code> (See the server
          and its overview)
        </li>
        <li>
          <strong className="text-foreground">Deployments</strong> — <code className={C}>app.view</code> (See apps and
          deployments)
        </li>
        <li>
          <strong className="text-foreground">Domains</strong> — <code className={C}>domains.view</code> (See domains)
        </li>
        <li>
          <strong className="text-foreground">SSL</strong> — <code className={C}>ssl.view</code> (See SSL certificates)
        </li>
        <li>
          <strong className="text-foreground">Nginx</strong> — <code className={C}>nginx.view</code> (See nginx)
        </li>
        <li>
          <strong className="text-foreground">Processes</strong> — <code className={C}>processes.view</code> (See
          processes)
        </li>
        <li>
          <strong className="text-foreground">Logs</strong> — <code className={C}>logs.view</code> (See logs)
        </li>
        <li>
          <strong className="text-foreground">Notifications</strong> — <code className={C}>notifications.view</code>{" "}
          (See notifications)
        </li>
        <li>
          <strong className="text-foreground">Action log</strong> — <code className={C}>audit.view</code> (See the action
          log; a team key, so roles only)
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A group&apos;s other keys only work while its view key is on. The editor greys them out while the view switch is
        off, and turning an action on turns the view switch on with it; when the view key itself is not held at server
        level, the rest of its group has no effect. While a group&apos;s view is off, the editor shows a single hint under
        that group&apos;s header — &quot;Turning on any permission here also turns on &lt;view label&gt;&quot; — and each
        row&apos;s own explanation only on hover or focus, still announced to screen readers through{" "}
        <code className={C}>aria-describedby</code>. The group master switch sets a whole group at once and reads{" "}
        <strong className="text-foreground">All</strong> / <strong className="text-foreground">None</strong> /{" "}
        <strong className="text-foreground">Mixed</strong> in a role and <strong className="text-foreground">Allow
        all</strong> / <strong className="text-foreground">Deny all</strong> /{" "}
        <strong className="text-foreground">Inherit all</strong> in an override.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <code className={C}>app.view</code> decides only <em>which apps</em> someone sees: an app appears in lists, in
        deployment progress and in process entries only with it, and deploy log lines still need{" "}
        <code className={C}>deploy.logs</code>. It does not hide the server&apos;s other sections — each follows its own
        view key above. Someone limited to chosen apps holds <code className={C}>server.view</code> but no server-level{" "}
        <code className={C}>app.view</code>. The automatic limit is the Processes frame: it lists only their apps&apos;
        entries (other processes need <code className={C}>processes.view</code> without the app limit). The
        Overview&apos;s live service state, CPU and memory (resources), metrics and the agent permission state follow
        their own key, <code className={C}>stats.view</code> (See server stats): someone limited to chosen apps gets them
        only when it is granted, and it is granted or denied like any other key. Where data is withheld this way the page
        says{" "}
        <strong className="text-foreground">&quot;Not available with your permissions&quot;</strong>, never
        &quot;Unknown&quot; or &quot;Degraded&quot;.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Changes to roles, overrides and member roles reach everyone&apos;s open pages at once: the Hub pushes the change
        and each page re-authorises and refetches without a reload. A page whose access was removed says so and the
        server leaves the sidebar tree.
      </p>

      <h3 id="resolution" className="text-base font-bold mt-8 mb-3 text-foreground">
        How a decision is made
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        One order, the same for every request. It is what View as shows and what authorises a command:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">The Owner gets everything</strong> — every key, and the Owner-only
          actions. Nothing else is consulted.
        </li>
        <li>
          <strong className="text-foreground">Start from the roles.</strong> The person&apos;s keys are @everyone plus
          the keys of every role assigned to them, added together.
        </li>
        <li>
          <strong className="text-foreground">administrator ends it.</strong> If <code className={C}>administrator</code>{" "}
          is among those keys, the person holds every key and every override is ignored.
        </li>
        <li>
          <strong className="text-foreground">Apply the server&apos;s overrides, in this order:</strong> @everyone&apos;s,
          then each role the person holds, then the one written for the person. An allow adds the key, a deny takes it
          away; anything not mentioned keeps the value it had.
        </li>
        <li>
          <strong className="text-foreground">Then the app&apos;s overrides</strong>, in the same order, on top of that
          result — but only when the question is about one app.
        </li>
        <li>
          <strong className="text-foreground">Visibility is a key too.</strong> Without{" "}
          <code className={C}>server.view</code> the server is invisible and nothing on it works (the API answers 404);
          with it, each section still needs its own view key. For an app, without{" "}
          <code className={C}>app.view</code> on that app the app is invisible and nothing on it works.
        </li>
        <li>
          <strong className="text-foreground">Then the server decides.</strong> A command runs only if the key it needs
          is in the result <em>and</em> the server itself allows that action. The agent re-checks it.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Team keys (members.manage, roles.manage, audit.view) come from the roles only — an override cannot add them.
        Visibility follows the same result: the server is listed and subscribable only with{" "}
        <code className={C}>server.view</code>; Domains, SSL, Nginx, Processes, Logs, Notifications and the Action log
        each need their own view key, and nginx configs and logs separately need{" "}
        <code className={C}>nginx.config.view</code> / <code className={C}>nginx.logs.view</code>; Deployments needs at
        least one visible app or <code className={C}>deploy.create</code>; an app appears in lists and receives its
        progress only with <code className={C}>app.view</code>, and deploy log lines need{" "}
        <code className={C}>deploy.logs</code>; Settings is always there and{" "}
        <a href="#section-views" className="text-primary hover:underline font-medium">section views</a> decide the
        rest.
      </p>

      <h3 id="permission-keys" className="text-base font-bold mt-8 mb-3 text-foreground">
        The keys
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Every key has a level, and the level decides where it may appear:
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Level</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">May appear in</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Keys</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap align-top">Team</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">Roles only — never in an override.</td>
              <td className="py-3 px-4 font-mono text-xs text-muted leading-relaxed align-top">administrator ★, members.manage ★, roles.manage ★, audit.view</td>
            </tr>
            <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap align-top">Server</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">Roles and server overrides.</td>
              <td className="py-3 px-4 font-mono text-xs text-muted leading-relaxed align-top">server.view, stats.view, server.manage, deploy.create, deploy.ci ★, domains.view, domains.create / edit / toggle / delete ★, ssl.view, ssl.issue / renew / renewAll / delete ★, nginx.view, nginx.config.view, nginx.config.edit ★, nginx.logs.view, nginx.reload / restart / start / stop / test, processes.view, process.start / stop / restart, logs.view, notifications.view</td>
            </tr>
            <tr className="hover:bg-primary/[0.03] transition-colors">
              <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap align-top">App</td>
              <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">Roles, server overrides and app overrides.</td>
              <td className="py-3 px-4 font-mono text-xs text-muted leading-relaxed align-top">app.view, deploy.run, deploy.rollback, deploy.logs, deploy.manage, deploy.admin ★, deploy.env ★</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        ★ marks a dangerous key: the editor warns before it is allowed, because it can delete something, read a secret
        or re-pair a machine. The same keys, grouped the way the editor shows them:
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
                    {row.view && (
                      <code className={`${C} ring-1 ring-primary/25`}>{row.view}</code>
                    )}
                    {row.grants.map((grant) => (
                      <code key={grant} className={C}>{grant}</code>
                    ))}
                  </span>
                  {row.view && (
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">{row.viewLabel}</p>
                  )}
                </td>
                <td className="py-3 px-4 text-xs text-muted leading-relaxed align-top">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The boxed key first in each group above is that section&apos;s view switch; the rest of the group does nothing
        without it. A group with no view key (Team) is team-level and appears in roles only. This is the same list the
        server shows in its own Settings → Hub, plus <code className={C}>deploy.create</code> for &quot;may create an
        app&quot; and the view keys, which exist only in the Hub. Allowing a key here never switches anything on at the
        server; it only decides which of the server&apos;s allowed actions this person may ask the Hub for. A key the
        catalog does not contain is refused with <code className={C}>400 UNKNOWN_PERMISSION</code>, and the Owner-only
        actions are not keys at all.
      </p>

      <h2 id="private-servers-and-apps" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Private servers and apps
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        There is no separate &quot;private&quot; switch. A private server or app is an{" "}
        <strong className="text-foreground">@everyone override that denies its view key</strong>; opening it for
        someone is an allow override. A single section can be hidden the same way, with its own view key. All of it is
        written in the same editor as any other override, so there is nothing extra to learn.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Make a server private.</strong> Open the server, choose its{" "}
          <strong className="text-foreground">Permissions</strong> section, pick <code className={C}>@everyone</code>{" "}
          as the target and deny <code className={C}>server.view</code> (Deny all in the General group). Save. From the
          next request the server answers <code className={C}>404</code> for every member who does not get it another
          way.
        </li>
        <li>
          <strong className="text-foreground">Hide one section instead.</strong> Deny that section&apos;s view key —{" "}
          <code className={C}>domains.view</code>, <code className={C}>ssl.view</code>,{" "}
          <code className={C}>nginx.view</code>, <code className={C}>processes.view</code>,{" "}
          <code className={C}>logs.view</code> or <code className={C}>notifications.view</code> — and only that section
          closes; the server and the other sections stay as their own view keys say. The rest of that group goes with
          it: the editor greys those switches out, and they have no effect.
        </li>
        <li>
          <strong className="text-foreground">Open a server or a section for chosen people.</strong> On the same server
          write an allow override of <code className={C}>server.view</code> for one role or one member, or of the
          section&apos;s view key for one section. Everyone else stays at 404 for the server, or without that section.
        </li>
        <li>
          <strong className="text-foreground">Make an app private.</strong> Open the app and its{" "}
          <strong className="text-foreground">Permissions</strong> tab, deny <code className={C}>app.view</code> on{" "}
          <code className={C}>@everyone</code> (Deny all in Deployments), then allow it for the roles or members who
          should see that one app. This hides apps only: the server&apos;s Domains, SSL, Nginx, Processes, Logs and
          Notifications sections still follow their own view keys.
        </li>
        <li>
          <strong className="text-foreground">An app created through the Hub starts private for actions.</strong> The
          Hub writes an app override on <code className={C}>@everyone</code> denying{" "}
          <code className={C}>deploy.run</code>, <code className={C}>deploy.rollback</code>,{" "}
          <code className={C}>deploy.logs</code>, <code className={C}>deploy.manage</code>,{" "}
          <code className={C}>deploy.admin</code> and <code className={C}>deploy.env</code>, plus an allow override for
          its creator with the same keys. <code className={C}>app.view</code> stays, so the app is listed; Admins act
          through <code className={C}>administrator</code> and the Owner holds everything.
        </li>
        <li>
          <strong className="text-foreground">Back to what the roles say.</strong> An override whose allow and deny
          lists are both empty is deleted; remove the @everyone override (Inherit all) and the server, the section or
          the app follows the roles again.
        </li>
        <li>
          <strong className="text-foreground">&quot;Chosen servers only&quot; members.</strong> A member can be
          limited to the servers chosen for them. When a server enters the team later, a member override denying{" "}
          <code className={C}>server.view</code> is written for them in the same transaction, so nothing widens by
          accident; the Members tab badges them <strong className="text-foreground">Chosen servers only</strong>, and
          opening one server for them is a member allow of <code className={C}>server.view</code> there.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <strong className="text-foreground">A direct app share is not an override.</strong>{" "}
        <code className={C}>Share only this app</code> on a personal server keeps working as a share of its own: no
        team, no role, exactly the actions you ticked, and no server telemetry. In a team the same form writes an
        allow override on that app instead.
      </p>
      <Screenshot caption="A team server's Permissions section: @everyone selected, server.view denied, and one role allowed beside it." />

      <h2 id="view-as" className="text-xl font-bold mt-10 mb-4 text-foreground">
        View as
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        <strong className="text-foreground">View as</strong> answers &quot;what does this person actually get?&quot;
        without signing in as them. It runs the same resolution the Hub uses to authorise their requests, so the
        answer is the answer.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open the server&apos;s <strong className="text-foreground">Permissions</strong> section, or the team&apos;s{" "}
          <strong className="text-foreground">Members</strong> tab, and choose{" "}
          <strong className="text-foreground">View as</strong> beside a member.
        </li>
        <li>
          Leave the app empty for the server-level answer, or pick one app to see that app&apos;s resolved set.
        </li>
        <li>
          Read the panel: whether the server (or that app) is visible at all, the effective key list, a verdict for
          every command and server action, and the sections that person would be offered.
        </li>
        <li>
          Change a role, an override or a member&apos;s roles and look again. Nothing is cached, so the panel and the
          person&apos;s open page change together.
        </li>
        <li>
          Close it. View as never writes anything — it is a read-only check, and it needs the same two keys as the
          editor.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        It needs <code className={C}>roles.manage</code> or <code className={C}>members.manage</code>, or the Owner,
        and it never shows the Owner&apos;s own view as anything but everything. A member whose view key is denied
        shows as invisible, exactly as the API answers <code className={C}>404</code>.
      </p>
      <Screenshot caption="View as: one member picked, the app selector, the visible flag, the effective keys and the command verdicts." />

      <h2 id="hierarchy" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Hierarchy
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Being allowed to manage roles or people is not the same as being allowed to touch everyone. The order in the
        Roles tab is the hierarchy, and a manager works only <em>below</em> their own highest role, so a role can never
        be used to climb.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Creating roles.</strong> A non-Owner with{" "}
          <code className={C}>roles.manage</code> creates a role only below their highest role: the new role is placed
          one step lower and the roles under it shift down.
        </li>
        <li>
          <strong className="text-foreground">Editing, deleting, reordering.</strong> Only roles below their highest
          role. They can never move a role to their own level or above, and never move @everyone, which stays at
          position 0.
        </li>
        <li>
          <strong className="text-foreground">Writing keys.</strong> In a role or an override they may add or remove
          only keys they hold themselves — resolved at team level for a role, at that server or app for an override.
        </li>
        <li>
          <strong className="text-foreground">administrator is the Owner&apos;s.</strong> A non-Owner can neither grant
          nor remove it, whatever their other keys.
        </li>
        <li>
          <strong className="text-foreground">Overrides are hierarchy-checked too.</strong> No override on a role at or
          above them, on a member whose highest role is at or above theirs, or on the Owner.
        </li>
        <li>
          <strong className="text-foreground">People.</strong> A non-Owner with <code className={C}>members.manage</code>{" "}
          invites with, assigns and removes only roles below their highest role, and only for members below them; they
          remove only such members, and never the Owner.
        </li>
        <li>
          <strong className="text-foreground">Refusals name the target.</strong>{" "}
          <code className={C}>403 HIERARCHY</code> names the role or the member;{" "}
          <code className={C}>403 MISSING_PERMISSION</code> names the key. By default only the Owner holds these two
          managing keys, so nothing changes until the Owner grants them.
        </li>
      </ol>
      <h3 id="owner-only-actions" className="text-base font-bold mt-8 mb-3 text-foreground">
        Owner-only actions
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A few actions are not permissions at all. No role, no override and no API body can grant them; only the
        Owner can do them, on every server of the team:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Delete the team.</li>
        <li>Transfer ownership to another member.</li>
        <li>
          Remove a server from the team (<code className={C}>server.delete</code>,{" "}
          <code className={C}>server.transferOut</code>).
        </li>
        <li>Rotate a server&apos;s secret.</li>
        <li>
          Create a CLI pairing link (<code className={C}>server.cliLink</code>) — it can re-pair the machine, so it is
          the same power as the secret.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A request that carries one of those names as a permission is refused{" "}
        <code className={C}>400 UNKNOWN_PERMISSION</code>: the Hub does not pretend they are grantable, not even to an
        Admin. Ownership itself is not a role either — it sits above every role, cannot be assigned by an invite, and
        cannot be narrowed by an override.
      </p>
      <Screenshot caption="The Roles tab: the role list top first with colours and positions, @everyone pinned at the bottom, and the hierarchy arrows." />

      <h2 id="worked-example" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Worked example: Frontend devs, deploy on two apps only
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The goal: a small frontend group deploys app A and app B, reads their logs, sees only those two apps, and can do
        nothing else in the team. One role with no keys, one server override for that role and two app overrides. The
        server override denies the views Frontend should not have; the app overrides turn the app view and the two
        deploy keys on, for A and B only.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Create the role.</strong> <strong>Members → Roles → New role</strong>:
          name <strong className="text-foreground">Frontend</strong>, a colour, and{" "}
          <strong className="text-foreground">no keys</strong>. View-only comes free from @everyone, so the role on its
          own grants nothing and can break nothing.
        </li>
        <li>
          <strong className="text-foreground">Assign it.</strong> On the <strong>Members</strong> tab pick each
          frontend developer, tick <strong className="text-foreground">Frontend</strong> and save. They are now
          view-only: every app is listed, every action is refused.
        </li>
        <li>
          <strong className="text-foreground">One server override, for Role: Frontend.</strong> Open the server&apos;s{" "}
          <strong>Permissions</strong> section, target <strong className="text-foreground">Role: Frontend</strong>, and
          deny <code className={C}>app.view</code> in Deployments. Server-level <code className={C}>app.view</code> is
          now off for them, so an app appears only where an app override allows it. If they should also stay out of the
          server&apos;s other sections, deny <code className={C}>domains.view</code>, <code className={C}>ssl.view</code>,{" "}
          <code className={C}>nginx.view</code>, <code className={C}>logs.view</code> and{" "}
          <code className={C}>notifications.view</code> too — each is that section&apos;s view switch, and leaving one on
          leaves that section visible, read-only. Keep <code className={C}>processes.view</code>: the Processes frame
          then shows only their apps, which is the other half of being limited to chosen apps (deny it as well to close
          the section). Keep <code className={C}>server.view</code>, so the server is listed and its Overview opens;
          deny <code className={C}>stats.view</code> as well if they should not see its live service state, CPU, memory
          and metrics. Do not touch <code className={C}>@everyone</code>: this override applies to Frontend
          only.
        </li>
        <li>
          <strong className="text-foreground">App A.</strong> Open app A → <strong>Permissions</strong> tab → target{" "}
          <strong className="text-foreground">Role: Frontend</strong> → allow <code className={C}>app.view</code>,{" "}
          <code className={C}>deploy.run</code> and <code className={C}>deploy.logs</code>; leave every other key at
          inherit. Save.
        </li>
        <li>
          <strong className="text-foreground">App B.</strong> The same three allows for Frontend on app B.
        </li>
        <li>
          <strong className="text-foreground">Everything else stays closed.</strong> App C has no allow for Frontend and
          the server-level app view is denied, so it is not in their lists at all — no progress, no process entry. If
          instead they should see every app and act on two only, leave server-level{" "}
          <code className={C}>app.view</code> on and use the two app allows alone; View as shows every app listed with
          actions on A and B.
        </li>
        <li>
          <strong className="text-foreground">Check it with View as.</strong> Permissions →{" "}
          <strong>View as</strong> → one frontend developer: server visible, the sections exactly as the override left
          them, the Processes frame holding only their apps and the Overview live stats absent unless{" "}
          <code className={C}>stats.view</code> is granted. Then app A: visible,{" "}
          <code className={C}>deploy.run</code> and <code className={C}>deploy.logs</code> present, rollback and env
          absent. App C: invisible. That is exactly what their account gets on the next request, and any change saved
          here reaches their open pages at once.
        </li>
      </ol>
      <Screenshot caption="The worked example: role Frontend with no keys, its server override denying app.view, and allow overrides adding app.view, deploy.run and deploy.logs on app A and app B." />

      <h2 id="command-policy" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What each command needs
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Every command the Hub can send, with the key the person must hold, the scope, and the permission the server
        must have switched on. The key may come from a role, from @everyone or from an allow override; the Owner holds
        every key. &quot;Agent permission&quot; is the server-side check that comes after this one.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Command</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
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
          exist yet), so <code className={C}>deploy.create</code> can only come from a role or a server override, never
          from a per-app allow. A person who creates an app through the Hub gets a member allow override on it
          automatically.
        </li>
      </ul>

      <h3 id="server-actions" className="text-base font-bold mt-8 mb-3 text-foreground">Actions on the server itself</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        These are not commands: they are the server&apos;s own endpoints. <code className={C}>server.view</code> is
        what makes the server exist for someone at all. Reading a server&apos;s action log follows{" "}
        <code className={C}>audit.view</code>, a team key. The last four are the Owner-only actions: they are not
        permissions and no role or override can carry them.
      </p>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Key</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Scope</th>
            </tr>
          </thead>
          <tbody>
            {serverActions.map((row, index) => (
              <tr key={row.action} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 font-mono text-xs text-primary">{row.action}</td>
                <td className="py-3 px-4 font-mono text-xs text-muted whitespace-nowrap">{row.key}</td>
                <td className="py-3 px-4 text-xs text-muted">{row.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="team-actions" className="text-base font-bold mt-8 mb-3 text-foreground">Actions on the team</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A team has no app subset, so these have no scope of their own. The team keys can only come from a role; the
        first four rows show which key each action needs, the rest are the Owner&apos;s alone.
      </p>
      <div className="mb-10 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Action or key</th>
              <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Key required</th>
            </tr>
          </thead>
          <tbody>
            {teamActions.map((row, index) => (
              <tr key={row.action} className={index % 2 === 1 ? "bg-primary/[0.015]" : ""}>
                <td className="py-3 px-4 font-mono text-xs text-primary">{row.action}</td>
                <td className="py-3 px-4 text-xs text-muted whitespace-nowrap">{row.key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="access-scope" className="text-xl font-bold mt-10 mb-4 text-foreground">
        What a limited person sees
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Nothing here is a separate switch: what a member sees is the resolved set from{" "}
        <a href="#resolution" className="text-primary hover:underline font-medium">How a decision is made</a>. Three
        questions cover it:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Do they hold server.view?</strong> Without it the server is in no list,
          cannot be subscribed to, and every request answers <code className={C}>404</code> — never{" "}
          <code className={C}>403</code>.
        </li>
        <li>
          <strong className="text-foreground">Do they hold app.view on that app?</strong> Without it the app is absent
          from lists, from deployment progress and from process entries. It comes from @everyone by default, so a plain
          Viewer sees every app of a readable server and can act on none. It decides apps only: the server-wide
          sections have their own view keys, so hiding an app never hides the server&apos;s overview, domains, nginx or
          processes.
        </li>
        <li>
          <strong className="text-foreground">Which action keys do they hold?</strong> A key can come from a role or
          from an allow override. Without it the action is refused with{" "}
          <code className={C}>403 MISSING_PERMISSION</code> naming the key.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-4">
        To give someone one app only, deny <code className={C}>app.view</code> at server level for their role, then
        allow <code className={C}>app.view</code> and the actions on that one app. They are then limited to chosen apps:
        the server is listed, the section views they hold still apply, the Processes frame shows only their apps, and
        the Overview&apos;s live stats appear only if <code className={C}>stats.view</code> is granted (deny it to keep
        them closed too). That is the worked example above, with a role that carries no keys.
      </p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        What this changes in practice, for a member whose extra keys are app overrides:
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
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">The server, its name and, with <code className={C}>stats.view</code>, whether it is online; the sections whose view keys they hold; the apps they hold <code className={C}>app.view</code> on.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Servers without <code className={C}>server.view</code>, sections without their view key, apps without <code className={C}>app.view</code> — not an empty list, a missing server or app (404). Where data is withheld, the page says &quot;Not available with your permissions&quot;.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Status and deployment progress for those apps; log lines only with <code className={C}>deploy.logs</code> on that app; nginx configs and logs only with <code className={C}>nginx.config.view</code> / <code className={C}>nginx.logs.view</code>.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Server-wide sections without their own view keys; for someone limited to chosen apps, the other apps and their process entries, and — without <code className={C}>stats.view</code> — the Overview&apos;s live data (service, resources, permissions, metrics).</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Their own command results, and the progress of a command they started.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Another person&apos;s command result or progress — even on the same server and app.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">A server&apos;s Action log and the team&apos;s Audit only with <code className={C}>audit.view</code>; the Permissions editor only with <code className={C}>roles.manage</code> or <code className={C}>members.manage</code>.</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">The Action log, the Audit and the Permissions editor without those keys; Settings is always there.</td>
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
          <strong className="text-foreground">A new app belongs to its creator and the Admins.</strong> A person who
          creates an app through the Hub gets a member allow override on it automatically; for everyone else the app
          is listed but its actions are denied by the @everyone app override the Hub writes. Admins and the Owner act
          through <code className={C}>administrator</code> and ownership. An app the Hub has not learned yet cannot be
          named in an override or a share — you get <code className={C}>UNKNOWN_APP</code>; the list is learned
          whenever the server reports it, so open the server once after adding an app.
        </li>
        <li>
          <strong className="text-foreground">A direct share shows one app and no telemetry.</strong> Its holder sees
          that app and exactly the actions on the share, never the server&apos;s overview, domains, nginx or
          processes.
        </li>
        <li>
          <strong className="text-foreground">A change reaches open pages at once.</strong> Nothing is cached: the next
          request is authorised from the database. A role, an override or a member&apos;s roles saved anywhere in the
          team is pushed to every open page, which re-authorises and refetches without a reload. A person whose access
          was removed loses the subscription and sees <code className={C}>accessRevoked</code>.
        </li>
      </ul>
      <p className="text-sm text-muted leading-relaxed mb-10">
        An Admin holds <code className={C}>administrator</code>, so it gets every key and its app overrides are ignored;
        the Owner holds everything. Neither is narrowed, which is why a role that carries no keys plus a server override
        denying <code className={C}>app.view</code> and one allow override per app is the way to give someone chosen
        apps only.
      </p>

      <h2 id="invite-a-person" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Invite a person
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Only a holder of <code className={C}>members.manage</code> manages people — by default the Owner. An
        invitation names one existing Hub account and the roles they should hold; the person joins only when they
        accept it, and the roles are re-checked against the sender&apos;s power at that moment.
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
          Pick the <strong className="text-foreground">roles</strong> the person should hold — any of the team&apos;s
          roles, several at once, never ownership. They receive @everyone plus those roles; <code className={C}>@everyone</code>{" "}
          cannot be left out.
        </li>
        <li>
          Choose their <strong className="text-foreground">servers</strong>: all of the team&apos;s servers, or{" "}
          <strong className="text-foreground">chosen servers only</strong>. With chosen servers, a member override
          denying <code className={C}>server.view</code> is written for every server that enters the team later, so the
          limit cannot widen by itself.
        </li>
        <li>
          Choose <strong className="text-foreground">Send invitation</strong>. Nothing is granted yet: the Hub emails
          a single-use link valid for 24 hours and shows the same invitation in the person&apos;s sidebar. The
          response says whether the email left (<code className={C}>emailSent</code>); a mail failure keeps the
          in-Hub invitation usable.
        </li>
        <li>
          Follow it in <strong className="text-foreground">Pending invitations</strong>, above the member table:
          person, roles, status, expiry, <strong className="text-foreground">Resend</strong> and{" "}
          <strong className="text-foreground">Revoke</strong>.
        </li>
      </ol>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Resend</strong> mints a new token and a new 24-hour expiry; the
          previous link stops working. <strong className="text-foreground">Revoke</strong> kills a pending
          invitation, and its link stops working too. Both need <code className={C}>members.manage</code> and both are
          audited.
        </li>
        <li>
          <strong className="text-foreground">Hierarchy applies to invitations.</strong> A non-Owner with{" "}
          <code className={C}>members.manage</code> may invite with, assign or remove only roles below their highest
          role, and only for members below them: <code className={C}>403 HIERARCHY</code> names the role or member.
          Roles that vanished between sending and accepting are skipped rather than re-created.
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
      {/* SCREENSHOT: the Invite a person form with the lookup result, the roles and the chosen-servers choice */}
      <Screenshot caption="Invite a person: the email or username lookup result, the roles to assign, and the chosen-servers choice." />

      <h2 id="share-an-app" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Share an app
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Sharing an app is an invitation scoped to one app and the actions you tick. The form offers two ways side by
        side, and <strong className="text-foreground">Share only this app</strong> is the default: either that one app
        goes to the person on its own, or the server moves into a team and they join it through the app. Both send
        the same 24-hour invitation and grant nothing until the person accepts.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open <strong className="text-foreground">Deployments</strong>, open the app and choose its{" "}
          <strong className="text-foreground">Sharing</strong> tab. The tab exists only for the Owner of the server
          or of its team; anyone else does not see it.
        </li>
        <li>
          Type the person&apos;s email address or username and confirm the account, as in Invite a person.
        </li>
        <li>
          Tick at least one action: <strong className="text-foreground">Deploy</strong>,{" "}
          <strong className="text-foreground">Roll back</strong> or <strong className="text-foreground">Logs</strong>.
          These actions are the whole grant — nothing else on the server comes with them. A direct share creates no
          membership; in a team the same actions become an allow override on that one app.
        </li>
        <li>
          Choose how to share: leave <strong className="text-foreground">Share only this app</strong> selected (the
          default), or pick <strong className="text-foreground">Move the server into a team and share</strong> on a
          personal server.
        </li>
        <li>
          One confirmation names the invitation — and the move, when there is one — then send. The app appears for
          them under <strong className="text-foreground">Shared with me</strong> after they accept.
        </li>
      </ol>

      <h3 id="share-only-this-app" className="text-base font-bold mt-8 mb-3 text-foreground">
        Share only this app (the default)
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The direct share: one app, one person, no team. It is its own row in the Hub, not a membership, so it works
        on a personal server and on a team server alike.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Nothing moves and no team is created.</strong> A personal server stays
          personal and a team server stays in its team. The person receives an invitation for that one app with the
          actions you chose — and only those actions.
        </li>
        <li>
          <strong className="text-foreground">They see it under Shared with me only.</strong> The server is not in
          their Personal list or any team list, and it is not offered in New deploy. They open it from Shared with
          me, where the row names the app and the person who shared it.
        </li>
        <li>
          <strong className="text-foreground">You revoke it from the app&apos;s page.</strong> Open the app&apos;s
          Sharing tab and choose <strong className="text-foreground">Revoke</strong> on that person: their access
          stops at once, the server and its team do not change, and their open page is told. A pending share can be
          sent again with <strong className="text-foreground">Resend</strong>, which mints a new 24-hour link.
        </li>
        <li>
          <strong className="text-foreground">The same form does not add them to a team.</strong> On a team server,
          someone who is already in the team is refused with <code className={C}>ALREADY_MEMBER</code>: give them the
          app from the team&apos;s Members tab instead.
        </li>
      </ul>
      {/* SCREENSHOT: the Sharing tab with "Share only this app" selected, the actions, and a pending direct share */}
      <Screenshot caption="Share only this app: the selected option, the person, the three actions, and a pending direct share in Shared with." />

      <h3 id="share-in-a-team" className="text-base font-bold mt-8 mb-3 text-foreground">
        Move the server into a team and share
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        The team route: the app is shared through a team membership rather than as a direct share, and in the
        role-and-override model it is one allow override on that app.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">On a personal server</strong>, choose the team the server moves into —
          one you own — or type a new team name. Sharing moves the server there in the same step, and the person
          joins that team through this one app: they are invited with no roles, and an allow override of{" "}
          <code className={C}>app.view</code> plus the actions you chose is written on that app when they accept.
          Read the notice first: you stay its owner, nothing on the server changes, and people see only what you grant.
        </li>
        <li>
          <strong className="text-foreground">On a team server</strong> the option reads{" "}
          <strong className="text-foreground">Invite them to the team and share</strong>: they join with no roles
          beyond <code className={C}>@everyone</code> and an allow override on this app only.
        </li>
        <li>
          <strong className="text-foreground">Shared with</strong> lists pending and accepted people with their
          actions and expiry. On a member&apos;s row, <strong className="text-foreground">Revoke</strong> deletes that
          app override; when the membership then reaches nothing it is removed too. Open pages and Shared with me
          update at once.
        </li>
      </ul>
      {/* SCREENSHOT: the team option selected on a personal server, with the team destination and the move notice */}
      <Screenshot caption="The team option: Move the server into a team and share, with the destination team and the notice that you stay its owner." />

      <h3 id="direct-shares-later" className="text-base font-bold mt-8 mb-3 text-foreground">
        When the server moves or the app is deleted
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        A direct share belongs to the server and the app, not to the person&apos;s team, so moving either one asks
        what should happen to it.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Moving the server into a team</strong> (Settings → Transfer server, or
          the team share above) while direct shares exist needs a decision, listed person by person:{" "}
          <strong className="text-foreground">Keep these direct shares</strong> leaves them exactly as they are,
          still working for people outside the team, or{" "}
          <strong className="text-foreground">Turn them into team app grants</strong> writes, for each accepted share,
          a member allow override on that app with the same actions — never more than the share gave. Pending shares
          and shares held by people already in the team are revoked and named in the answer.
        </li>
        <li>
          <strong className="text-foreground">Handing the server to another person</strong> asks the same question:{" "}
          <strong className="text-foreground">Revoke these shares</strong> (the default) takes their access away
          with the hand-over, or <strong className="text-foreground">Keep them for the new owner</strong>, who then
          sees them on the app&apos;s Sharing tab and can revoke them there.
        </li>
        <li>
          <strong className="text-foreground">Nothing is decided for you.</strong> Without a choice the move is
          refused with <code className={C}>SHARES_DECISION_REQUIRED</code> and the list of affected shares; the
          server has not moved.
        </li>
        <li>
          <strong className="text-foreground">Deleting the app removes its shares.</strong> Whether you delete it
          through the Hub or it disappears from the server&apos;s app list, its direct shares go with it, the
          grantees lose access at once and are told live. A pending invitation for it stops working too.
        </li>
      </ul>
      {/* SCREENSHOT: the second confirmation listing the affected people, with Keep / Turn into team app grants */}
      <Screenshot caption="Moving a server that has direct shares: the affected people and the choice to keep them or turn them into team app grants." />

      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Refusals:</strong>{" "}
          <code className={C}>ALREADY_MEMBER</code> (give them the app from the team&apos;s Members tab instead),{" "}
          <code className={C}>INVITE_PENDING</code> (the same app is already pending for that person — resend that
          one), <code className={C}>ALREADY_SHARED</code> (they already have an accepted direct share of this app),{" "}
          <code className={C}>UNKNOWN_APP</code> (open the server once so the Hub learns its apps),{" "}
          <code className={C}>NO_ACCOUNT</code> and <code className={C}>CANNOT_INVITE</code>.
        </li>
        <li>
          <strong className="text-foreground">Every share is audited by name</strong> — sent, resent, revoked,
          accepted, declined, expired, converted or deleted with the app — never with the token.
        </li>
      </ul>

      <h2 id="shared-with-me" className="text-xl font-bold mt-10 mb-4 text-foreground">
        Shared with me
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Everything another team or person gives you personally is collected under{" "}
        <strong className="text-foreground">Shared with me</strong> in the sidebar, so a one-app grant never means
        hunting through teams for the server.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open <code className={C}>/dashboard</code> and find <strong className="text-foreground">Shared with
          me</strong> under Personal and the teams (on a server page it sits under SERVERS).
        </li>
        <li>
          <strong className="text-foreground">Invitations come first</strong>: the team (or, for a direct app share, no
          team at all), who invited you, the roles you were given, the app and server for a share, and the expiry.{" "}
          <strong className="text-foreground">Accept</strong> or{" "}
          <strong className="text-foreground">Decline</strong> there — the same answer as the email link.
        </li>
        <li>
          Accepted app shares follow, grouped by server name, one row per app. Choosing one opens that server&apos;s
          Deployments section at the app. A direct share (<strong className="text-foreground">Share only this
          app</strong>) has no team: the row names the person who shared it, and its owner revokes it from that
          app&apos;s page.
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
        belong to, then <strong className="text-foreground">Shared with me</strong>. A server&apos;s name is a link:
        choosing it opens that server at its overview. The arrow beside the name is a separate control — it opens the
        server to show only the sections you may open: overview for <code className={C}>server.view</code>, deployments
        with at least one visible app or <code className={C}>deploy.create</code>, then domains, ssl, nginx, processes,
        logs, notifications and the action log each only when its own view key is held, settings always, and a
        Permissions section for the Owner and holders of <code className={C}>roles.manage</code>. The list is the
        server&apos;s own <code className={C}>sections</code> field, so the tree never guesses a rule from a role.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">A name opens, an arrow expands.</strong> Choosing the server&apos;s name
          navigates to the server; only the arrow (or Space on the row) lists its sections, and each section is a
          link to that part of the page. Clicking the name never collapses the sections you already have open.
        </li>
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
          refuses the create for your keys or scope (the same sentence the create command would answer, for example{" "}
          <code className={C}>MISSING_PERMISSION</code>); the server itself has Deployments switched off in its
          Settings → Hub; it is offline; or it runs as a Windows service and refuses Hub deploys.
        </li>
        <li>
          Continue opens the existing create form at{" "}
          <code className={C}>/dashboard/servers/&lt;id&gt;?section=deployments&amp;create=1</code>. The chooser is
          skipped only when you can see exactly one server and it can take a deploy — then New deploy goes straight
          to its create form. With two or more servers the list always appears, even when only one of them is
          selectable, so a server that cannot take a deploy is seen with its reason instead of being skipped silently.
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
        Eight steps from an empty Hub to a team where a custom role deploys on two apps and can do nothing else. Every
        one is reversible; the troubleshooting table at the end names the next step for each refusal.
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
        someone who already has a Hub account. The form confirms the account before it will send. Pick the roles they
        should hold and whether they get all servers or chosen servers only, then choose{" "}
        <strong className="text-foreground">Send invitation</strong> — the person joins only when they accept.
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
          <strong className="text-foreground">They start visible but not acting.</strong> Once they accept,{" "}
          <code className={C}>@everyone</code> gives them <code className={C}>server.view</code>,{" "}
          <code className={C}>app.view</code> and the other section view keys: they see all of the team&apos;s servers,
          apps and sections, can act on nothing (and cannot open Logs), until a role or an override adds a key — which
          is steps 3 to 5.
        </li>
        <li>Lookups, invitations and shares share a budget of 30 per account per hour, every attempt counted, plus a per-IP limit.</li>
      </ul>
      {/* SCREENSHOT: the Invite a person form with the lookup result, the roles and the chosen-servers choice */}
      <Screenshot caption="The Invite a person form: the confirmed account, the roles to assign, and the chosen-servers choice." />

      <h3 id="step-3-create-a-role" className="text-base font-bold mt-8 mb-3 text-foreground">
        3. Create a role and give it keys
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Open <strong className="text-foreground">Members → Roles</strong>. The built-in Admin, Member and Viewer are
        ordinary roles you can edit, so a custom role is only needed when someone should hold a different set:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Choose <strong className="text-foreground">New role</strong>, type a name that is unique in the team, and
          pick a colour so it is recognisable in the member list.
        </li>
        <li>
          Tick the <strong className="text-foreground">keys</strong> it should carry, grouped General, Deployments,
          Domains, SSL, Nginx, Processes, Logs, Notifications, Action log and Team. The first switch of a group is that
          section&apos;s view key; the rest of the group stays greyed out until it is on. A dangerous key (★) shows a
          warning before it can be ticked.
        </li>
        <li>
          Save. The role is placed just below your own highest role — the{" "}
          <a href="#hierarchy" className="text-primary hover:underline font-medium">hierarchy</a> rule — and can be
          dragged lower at any time.
        </li>
        <li>
          To start from an existing set, edit the built-in role instead: Member carries deploy and process keys, Viewer
          none, Admin <code className={C}>administrator</code>.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-6">
        A role never adds a key the server has switched off. If the server has{" "}
        <code className={C}>domains.delete</code> disabled, a role carrying it still gets nothing done — the agent
        refuses. And a role with no keys is useful rather than empty: it is the base for the override in step 5.
      </p>
      {/* SCREENSHOT: the role editor with the grouped keys and the dangerous-key warning */}
      <Screenshot caption="The role editor: name, colour, the grouped keys, and the warning on a dangerous key." />

      <h3 id="step-4-assign-roles" className="text-base font-bold mt-8 mb-3 text-foreground">
        4. Assign the roles to a person
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        On the <strong className="text-foreground">Members</strong> tab, pick the person and tick every role they
        should hold:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Tick any number of roles. Their keys add up, and <code className={C}>@everyone</code> is always included.
        </li>
        <li>
          Leave a role unticked to take it away; the person loses those keys on their next request and any open page is
          re-checked at once.
        </li>
        <li>
          Choose <strong className="text-foreground">View as</strong> beside the person to see the result before they
          notice anything.
        </li>
        <li>Choose <strong className="text-foreground">Save</strong>.</li>
      </ol>
      {/* SCREENSHOT: the Members tab with one person's role checkboxes and View as beside the name */}
      <Screenshot caption="The Members tab: one person's roles ticked, @everyone shown as implicit, and View as beside the name." />

      <h3 id="step-5-set-overrides" className="text-base font-bold mt-8 mb-3 text-foreground">
        5. Set overrides on a server and on an app
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">
        Overrides are how one server or one app differs from the roles. Work from the server down to the app:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          Open the server → <strong className="text-foreground">Permissions</strong> → pick the target (a role, a
          member, or <code className={C}>@everyone</code>).
        </li>
        <li>
          For each key choose allow, deny, or leave inherit. Server overrides take server and app keys; team keys never
          appear here.
        </li>
        <li>
          Save. The server override applies to everyone holding that role, or to that one member, from the next
          request.
        </li>
        <li>
          Open the app → <strong className="text-foreground">Permissions</strong> tab and repeat for app keys only.
          App overrides sit on top of the server ones.
        </li>
        <li>
          To make the server or the app private, deny <code className={C}>server.view</code> or{" "}
          <code className={C}>app.view</code> on <code className={C}>@everyone</code>, then allow it for the roles or
          members who should keep it; to hide one section, deny its view key the same way. Clearing both lists
          (Inherit all) deletes the override.
        </li>
      </ol>
      <p className="text-sm text-muted leading-relaxed mb-6">
        Saving takes effect on the next request and re-checks every open page in the team at once — nobody refreshes.
        The roles have not changed; only what they reach on that server, section or app has.
      </p>
      {/* SCREENSHOT: the server Permissions editor with a role target, one allow and one deny, and the app Permissions tab */}
      <Screenshot caption="The Permissions editor: a role target with an allow and a deny on the server, and the same editor on one app." />

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
          passes to that team&apos;s Owner. Moving between teams works the same way. Moving a personal server in is
          yours to do as its owner (<code className={C}>server.manage</code>); moving a server out of a team is the
          team Owner&apos;s alone.
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
          <strong className="text-foreground">The old team&apos;s access rules are cleared.</strong> Overrides that
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
        Ownership</strong>, choose the new Owner and confirm. The chosen member becomes the only Owner; you stop being
        the Owner and keep the roles you already hold.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>
          <strong className="text-foreground">Every server follows the Owner.</strong> The team&apos;s servers change
          their owning account in the same transaction, because a team server is owned by the team&apos;s Owner.
        </li>
        <li>
          <strong className="text-foreground">The new Owner holds everything immediately</strong>, above every role.
          Ownership is not a role: it cannot be assigned by an invite, narrowed by an override or given as a key.
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
        The team has an <strong className="text-foreground">Audit</strong> view for holders of{" "}
        <code className={C}>audit.view</code> — by default Admin and Owner: newest first, 50 entries at a time, up to
        200 per request, with an older-page cursor.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted leading-relaxed mb-4">
        <li>Recorded: team create, rename and delete; invitations sent, resent, revoked, accepted, declined and expired; a member&apos;s roles changed, removed or leaving; roles created, updated, deleted and reordered; overrides set and deleted; ownership transfers; server transfers in and out; every command dispatched and every refusal; and the private-app overrides written when the Hub creates an app.</li>
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
        newest first, without a payload. The personal owner, a team member holding{" "}
        <code className={C}>audit.view</code> and the team Owner can read it; everyone else is refused for the missing
        key.
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
            <td className="py-3 px-4 text-xs text-muted">Owner, or a holder of members.manage for members below them</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">Their membership, role assignments and overrides are deleted and their open sockets are told. The Owner cannot be removed — transfer ownership first.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">Transfer ownership</td>
            <td className="py-3 px-4 text-xs text-muted">Owner</td>
            <td className="py-3 px-4 text-xs text-muted leading-relaxed">The chosen member becomes the only Owner and sits above every role. Every team server follows the new Owner. The team still has exactly one Owner.</td>
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
        A server that is deleted is removed from the team like any other server; the overrides written for it go with
        it. Moving the last server out of a team does not delete the team — do that yourself when you no longer need
        it.
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
