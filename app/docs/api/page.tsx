import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Dashboard API",
  description:
    "Easy DevOps web dashboard REST API reference. Nginx, domains, SSL, settings, and notification channel endpoints with request/response examples.",
  keywords: ["Easy DevOps API", "DevOps dashboard API", "REST API documentation", "Nginx API", "domain management API", "SSL API", "notification channels API"],
  alternates: { canonical: "/docs/api" },
};

const apiGroups = [
  {
    id: "nginx",
    title: "Nginx",
    endpoints: [
      { path: "/api/nginx/status", methods: ["GET"], desc: "Get nginx running status" },
      { path: "/api/nginx/start", methods: ["POST"], desc: "Start nginx" },
      { path: "/api/nginx/stop", methods: ["POST"], desc: "Stop nginx" },
      { path: "/api/nginx/reload", methods: ["POST"], desc: "Graceful reload" },
      { path: "/api/nginx/configs", methods: ["GET"], desc: "List config files" },
      { path: "/api/nginx/config/:file", methods: ["GET", "POST"], desc: "Read / write config file" },
    ],
  },
  {
    id: "domains",
    title: "Domains",
    endpoints: [
      { path: "/api/domains", methods: ["GET", "POST"], desc: "List / create domains. Responses include a notifications field with per-domain channel config." },
      { path: "/api/domains/:name", methods: ["PUT", "DELETE"], desc: "Update / delete domain" },
      { path: "/api/domains/:name/toggle", methods: ["PUT"], desc: "Enable or disable domain" },
      { path: "/api/domains/:name/reload", methods: ["POST"], desc: "Reload nginx for domain" },
      { path: "/api/domains/:name/notifications", methods: ["GET", "PUT"], desc: "Get or update per-domain notification config (enabled flag + channelIds per event type)" },
    ],
  },
  {
    id: "ssl",
    title: "SSL",
    endpoints: [
      { path: "/api/ssl", methods: ["GET"], desc: "List certificates" },
      { path: "/api/ssl/create", methods: ["POST"], desc: "Issue new certificate (HTTP-01 or DNS-01)" },
      { path: "/api/ssl/create-confirm", methods: ["POST"], desc: "Confirm DNS-01 challenge" },
      { path: "/api/ssl/renew/:domain", methods: ["POST"], desc: "Renew certificate (keeps its names, reloads nginx)" },
      { path: "/api/ssl/renew-all", methods: ["POST"], desc: "Renew everything expiring within 30 days" },
    ],
  },
  {
    id: "deployments",
    title: "Deployments",
    endpoints: [
      { path: "/api/deployments", methods: ["GET", "POST"], desc: "List apps with their status, or create an app" },
      { path: "/api/deployments/:id", methods: ["GET", "PUT", "DELETE"], desc: "One app with its runs and releases; update it; or stop and delete it (?deleteDomain=1 removes its linked domain too, ?purgeData=1 its persistent data)" },
      { path: "/api/deployments/:id/deploy", methods: ["POST"], desc: "Start a deployment. Body: { ref? }. Answers 202 with a runId" },
      { path: "/api/deployments/:id/rollback", methods: ["POST"], desc: "Switch back to an earlier release. Body: { releaseId? }" },
      { path: "/api/deployments/:id/releases/:releaseId", methods: ["DELETE"], desc: "Delete an old release's folder. The log and the persistent data stay; the live release and the rollback fallback are refused" },
      { path: "/api/deployments/:id/runs/:runId", methods: ["GET"], desc: "One deployment's status and the tail of its log" },
      { path: "/api/deployments/:id/hook-token", methods: ["POST", "DELETE"], desc: "Issue (shown once) or revoke the app's deploy token" },
      { path: "/api/deployments/:id/deploy-key", methods: ["POST"], desc: "Generate the app's SSH deploy key; returns the public half" },
      { path: "/api/deployments/:id/domain", methods: ["PUT", "DELETE"], desc: "Link the app to a domain (created if it does not exist; body: { domain, ssl? }), or forget the link" },
      { path: "/api/deployments/:id/move", methods: ["POST"], desc: "Move the app's folder. Body: { path } — the app ends up in <path>/<id>, stopped and started again" },
      { path: "/api/deployments/:id/github", methods: ["GET"], desc: "The GitHub Actions workflow, the secrets it needs and the URLs GitHub can call" },
      { path: "/api/deployments/:id/github/apply", methods: ["POST"], desc: "Store the secrets, commit the workflow and add the deploy key through GitHub's API. Body: { token?, target? }" },
      { path: "/api/deployments/hook", methods: ["GET", "PUT"], desc: "The deploy hook: enabled, port, bind and the domain that exposes it" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    endpoints: [
      { path: "/api/settings", methods: ["GET", "POST"], desc: "Get / save dashboard settings" },
      { path: "/api/settings/permissions", methods: ["GET"], desc: "Check whether Linux NOPASSWD sudoers are configured" },
      { path: "/api/settings/permissions/setup", methods: ["POST"], desc: "Write /etc/sudoers.d/easy-devops via sudo -S (Linux only). Body: { password: string }" },
      { path: "/api/settings/backup", methods: ["GET"], desc: "Download config and domains as a JSON file (password excluded)" },
      { path: "/api/settings/restore", methods: ["POST"], desc: "Restore config and domains from a backup JSON body" },
    ],
  },
  {
    id: "channels",
    title: "Notification Channels",
    endpoints: [
      { path: "/api/settings/channels", methods: ["GET"], desc: "List all named notification channels" },
      { path: "/api/settings/channels", methods: ["POST"], desc: "Create a channel. Body: { name, type: 'discord'|'telegram', webhookUrl?, botToken?, chatId?, message? }" },
      { path: "/api/settings/channels/:id", methods: ["PUT"], desc: "Update channel name or credentials. Type is immutable after creation." },
      { path: "/api/settings/channels/:id", methods: ["DELETE"], desc: "Delete a channel" },
      { path: "/api/settings/channels/:id/test", methods: ["POST"], desc: "Send a live test notification to a single channel" },
    ],
  },
];

export default function APIPage() {
  return (
    <DocPage
      section="Reference"
      title="Dashboard API"
      description="The web dashboard exposes a REST API consumed by the React dashboard UI."
    >

      <h2 id="example-domain" className="text-xl font-bold mt-10 mb-4 text-foreground">Example: Create a Domain</h2>
      <CodeBlock lang="bash" filename="Request">{`curl -X POST http://localhost:6443/api/domains \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "example.com",
    "port": 3000,
    "backendHost": "127.0.0.1",
    "upstreamType": "http",
    "ssl": { "enabled": true },
    "performance": { "gzip": true },
    "security": { "rateLimit": false }
  }'`}</CodeBlock>

      <CodeBlock lang="json" filename="Response (201)">{`{
  "name": "example.com",
  "port": 3000,
  "backendHost": "127.0.0.1",
  "upstreamType": "http",
  "ssl": { "enabled": true },
  "enabled": true,
  "notifications": {
    "domain_health": { "enabled": true, "channelIds": [] },
    "cert_expiry":   { "enabled": true, "channelIds": [] }
  }
}`}</CodeBlock>

      <h2 id="example-channel" className="text-xl font-bold mt-10 mb-4 text-foreground">Example: Create a Notification Channel</h2>
      <CodeBlock lang="bash" filename="Request">{`curl -X POST http://localhost:6443/api/settings/channels \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production Discord",
    "type": "discord",
    "webhookUrl": "https://discord.com/api/webhooks/...",
    "message": "<@&1280907071813976196>"
  }'`}</CodeBlock>

      <CodeBlock lang="json" filename="Response (201)">{`{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Production Discord",
  "type": "discord",
  "webhookUrl": "https://discord.com/api/webhooks/...",
  "message": "<@&1280907071813976196>"
}`}</CodeBlock>

      <h2 id="example-notif-config" className="text-xl font-bold mt-10 mb-4 text-foreground">Example: Configure Domain Notifications</h2>
      <CodeBlock lang="bash" filename="Request">{`curl -X PUT http://localhost:6443/api/domains/example.com/notifications \\
  -H "Content-Type: application/json" \\
  -d '{
    "domain_health": { "enabled": true,  "channelIds": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"] },
    "cert_expiry":   { "enabled": false, "channelIds": [] }
  }'`}</CodeBlock>

      <h2 id="endpoints" className="text-xl font-bold mt-10 mb-4 text-foreground">All Endpoints</h2>

      <div className="space-y-8 mb-10">
        {apiGroups.map((group) => (
          <div key={group.id}>
            <h3 id={group.id} className="text-base font-bold mb-3 text-foreground">{group.title}</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Endpoint</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Method</th>
                  <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Description</th>
                </tr>
              </thead>
              <tbody>
                {group.endpoints.map((ep, ei) => (
                  <tr key={ei} className={`${ei % 2 === 1 ? "bg-primary/[0.015]" : ""} hover:bg-primary/[0.03] transition-colors`}>
                    <td className="py-3 px-4 font-mono font-semibold text-xs text-primary">{ep.path}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {ep.methods.map((m) => <MethodBadge key={m} method={m} />)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted text-xs">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <DocsPagination
        prev={{ title: "Maintenance & Updates", href: "/docs/maintenance", section: "Operations" }}
        next={{ title: "Configuration", href: "/docs/configuration", section: "Reference" }}
      />
    </DocPage>
  );
}

function MethodBadge({ method }: { method: string }) {
  const map: Record<string, string> = {
    GET: "bg-blue-500/12 text-blue-500",
    POST: "bg-green-500/12 text-green-500",
    PUT: "bg-yellow-500/12 text-yellow-500",
    DELETE: "bg-red-500/12 text-red-500",
  };
  return <span className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded ${map[method] || "bg-gray-500/12 text-gray-500"}`}>{method}</span>;
}
