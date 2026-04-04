import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Dashboard API",
  description:
    "Easy DevOps web dashboard REST API reference. Nginx, domains, SSL, and settings endpoints with request/response examples.",
  keywords: ["Easy DevOps API", "DevOps dashboard API", "REST API documentation", "Nginx API", "domain management API", "SSL API"],
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
      { path: "/api/domains", methods: ["GET", "POST"], desc: "List / create domains" },
      { path: "/api/domains/:name", methods: ["PUT", "DELETE"], desc: "Update / delete domain" },
      { path: "/api/domains/:name/toggle", methods: ["PUT"], desc: "Enable or disable domain" },
      { path: "/api/domains/:name/reload", methods: ["POST"], desc: "Reload nginx for domain" },
    ],
  },
  {
    id: "ssl",
    title: "SSL",
    endpoints: [
      { path: "/api/ssl", methods: ["GET"], desc: "List certificates" },
      { path: "/api/ssl/create", methods: ["POST"], desc: "Issue new certificate (HTTP-01 or DNS-01)" },
      { path: "/api/ssl/create-confirm", methods: ["POST"], desc: "Confirm DNS-01 challenge" },
      { path: "/api/ssl/renew/:domain", methods: ["POST"], desc: "Renew certificate" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    endpoints: [
      { path: "/api/settings", methods: ["GET", "POST"], desc: "Get / save dashboard settings" },
    ],
  },
];

export default function APIPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Reference</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Dashboard API</h1>
      <p className="text-muted text-base leading-relaxed mb-10">The web dashboard exposes a REST API consumed by the Vue 3 frontend.</p>

      <h2 id="example" className="text-xl font-bold mt-10 mb-4 text-foreground">Example: Create a Domain</h2>
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
  "success": true,
  "data": {
    "name": "example.com",
    "port": 3000,
    "backendHost": "127.0.0.1",
    "upstreamType": "http",
    "ssl": { "enabled": true },
    "enabled": true
  }
}`}</CodeBlock>

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
        prev={{ title: "SSL Manager", href: "/docs/ssl", section: "Usage" }}
        next={{ title: "Configuration", href: "/docs/configuration", section: "Reference" }}
      />
    </div>
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
