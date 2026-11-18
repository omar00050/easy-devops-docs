import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import CodeBlock from "@/components/CodeBlock";
import DocPage from "@/components/DocPage";

export const metadata: Metadata = {
  title: "Deployments",
  description:
    "Deploy a project from a git repository with Easy DevOps: built on the server, run under PM2, health-checked, rolled back automatically, and triggered from the dashboard or GitHub Actions. Optional ez.json keeps the commands with the code, and persistent paths keep a database, uploads and logs across deployments.",
  keywords: ["deploy from GitHub", "GitHub Actions deploy", "PM2 deployment", "ez.json", "persistent data", "persistent files", "SQLite deploy", "automatic rollback", "self-hosted CI/CD", "deploy hook", "Node.js deployment"],
  alternates: { canonical: "/docs/deployments" },
  openGraph: {
    type: "article",
    url: "/docs/deployments",
    siteName: "Easy DevOps",
    title: "Deployments",
    description:
      "Deploy from a git repository: PM2 releases, health checks, automatic rollback, ez.json and persistent data across deploys.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deployments",
    description:
      "Deploy from a git repository: PM2 releases, health checks, automatic rollback, ez.json and persistent data across deploys.",
  },
};

const C = "font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded";

export default function DeploymentsPage() {
  return (
    <DocPage
      section="Using the CLI"
      title="Deployments"
      description="Put a project from a git repository on your server and keep it deployed. The code is fetched and built on the server, started under PM2, checked for health, and the previous release is kept one step away."
    >

      <h2 id="how-it-works" className="text-xl font-bold mt-10 mb-4 text-foreground">How a deployment runs</h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li><strong className="text-foreground">Fetch</strong> — a fresh checkout into its own release folder. The running release is never built over.</li>
        <li><strong className="text-foreground">Settings</strong> — read from <code className={C}>ez.json</code>, then <code className={C}>package.json</code>, with anything you set on the app taking precedence.</li>
        <li><strong className="text-foreground">Pre hook → install → build → migrate</strong> — in the new folder, with the paths listed under <a href="#persistent-data" className="text-primary hover:underline">persistent data</a> linked in first.</li>
        <li><strong className="text-foreground">Switch</strong> — the old process is stopped and the new one started under PM2, as <code className={C}>ez-&lt;name&gt;</code>. A cluster app that is already running in cluster mode is reloaded instead, with no downtime.</li>
        <li><strong className="text-foreground">Health check</strong> — the app must answer on its port and stay online under PM2 before the deployment counts.</li>
        <li><strong className="text-foreground">Post hook</strong>, then old releases are pruned.</li>
      </ol>
      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-lg p-4 text-sm text-muted mb-10">
        💡 Nothing before the switch touches what is running, so <strong className="text-foreground">a broken build or a failed migration costs nothing</strong>. If the new release crashes at boot — it exits, PM2 restarts it, or the health check fails — the previous release is started again automatically and the run says why. The switch itself is a restart: the app is down for as long as it takes to start.
      </div>

      <h2 id="requirements" className="text-xl font-bold mt-10 mb-4 text-foreground">Requirements</h2>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-4">
        <li><strong className="text-foreground">git</strong> on the server, on the PATH of the Easy DevOps service.</li>
        <li><strong className="text-foreground">PM2</strong> — install it yourself with <code className={C}>npm install -g pm2</code>. Easy DevOps does not install PM2 and the dashboard has no install button; when PM2 is missing, the Deployments page says so and links to Processes, which only reports its state.</li>
      </ul>
      <p className="text-xs text-muted leading-relaxed mb-10">
        There is no CLI deploy command. A deployment is started from the dashboard, from a GitHub
        Action through the deploy hook, from the Hub, or by CI calling the Hub.
      </p>

      <h2 id="first-app" className="text-xl font-bold mt-10 mb-4 text-foreground">Your first app</h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>Open <strong className="text-foreground">Deployments</strong> in the dashboard and press <strong className="text-foreground">New app</strong>.</li>
        <li>Give it a name, the repository URL and the branch.</li>
        <li>Choose how the server reads the repository (below).</li>
        <li>Press <strong className="text-foreground">Deploy</strong> and watch the log.</li>
      </ol>
      <p className="text-muted text-sm leading-relaxed mb-4">A plain Node project needs nothing else: with no <code className={C}>ez.json</code>, Easy DevOps installs with the lockfile&apos;s package manager, runs the <code className={C}>build</code> script if there is one, and starts the <code className={C}>start</code> script.</p>

      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Repository access</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">URL form</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">How it works</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Public</td>
            <td className="py-3 px-4 text-muted text-xs">https://…</td>
            <td className="py-3 px-4 text-muted text-xs">No credentials.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Deploy key</td>
            <td className="py-3 px-4 text-muted text-xs">git@github.com:owner/repo.git</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">Easy DevOps generates an SSH key for the app. You add its public half to the repository under Settings → Deploy keys, read-only. The private half never leaves the server.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Access token</td>
            <td className="py-3 px-4 text-muted text-xs">https://…</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">A personal access token stored on the server and sent only to the repository host. Read access to the one repository is enough.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="ez-json" className="text-xl font-bold mt-10 mb-4 text-foreground">ez.json</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">Optional. Put it in the repository to keep the commands with the code. It is looked for at <code className={C}>ez.json</code>, then <code className={C}>deploy/ez.json</code>, then <code className={C}>.deploy/ez.json</code>.</p>
      <CodeBlock lang="json" filename="ez.json">{`{
  "install": "npm ci",
  "build": "npm run build",
  "migrate": "npx prisma migrate deploy",
  "start": "node dist/server.js",
  "port": 3000,
  "health": "/healthz",
  "execMode": "cluster",
  "instances": "max",
  "persist": ["data", "uploads/imgs"],
  "hooks": {
    "pre": "node scripts/check-env.js",
    "post": "node scripts/warm-cache.js"
  }
}`}</CodeBlock>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Field</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Value</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Without it</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>install</code></td>
            <td className="py-3 px-4 text-muted text-xs">A command, a list of commands, or <code className={C}>false</code> to skip</td>
            <td className="py-3 px-4 text-muted text-xs"><code className={C}>npm ci</code> with a lockfile (yarn and pnpm are detected), else <code className={C}>npm install</code></td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>build</code></td>
            <td className="py-3 px-4 text-muted text-xs">Same</td>
            <td className="py-3 px-4 text-muted text-xs">The <code className={C}>build</code> script, if the project has one</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>migrate</code></td>
            <td className="py-3 px-4 text-muted text-xs">Same, run in the new release after <code className={C}>build</code> and before <code className={C}>start</code></td>
            <td className="py-3 px-4 text-muted text-xs">No migration step</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>start</code></td>
            <td className="py-3 px-4 text-muted text-xs">One command — the long-running process</td>
            <td className="py-3 px-4 text-muted text-xs">The <code className={C}>start</code> script, else <code className={C}>node &lt;main&gt;</code></td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>port</code></td>
            <td className="py-3 px-4 text-muted text-xs">The port the app listens on</td>
            <td className="py-3 px-4 text-muted text-xs">No HTTP health check; the process only has to stay up</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>health</code></td>
            <td className="py-3 px-4 text-muted text-xs">A path, or <code className={C}>{`{ "path": "/healthz", "timeout": 60 }`}</code></td>
            <td className="py-3 px-4 text-muted text-xs"><code className={C}>/</code>, 60 seconds</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>execMode</code></td>
            <td className="py-3 px-4 text-muted text-xs"><code className={C}>&quot;fork&quot;</code> (one process) or <code className={C}>&quot;cluster&quot;</code> (one worker per instance)</td>
            <td className="py-3 px-4 text-muted text-xs"><code className={C}>fork</code> — exactly as before</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>instances</code></td>
            <td className="py-3 px-4 text-muted text-xs">A whole number from 1 to the CPU count, or <code className={C}>&quot;max&quot;</code> for one per CPU</td>
            <td className="py-3 px-4 text-muted text-xs">1</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>persist</code></td>
            <td className="py-3 px-4 text-muted text-xs">Folders or single files, or a list of them, kept across deployments and rollbacks — see <a href="#persistent-data" className="text-primary hover:underline">persistent data</a></td>
            <td className="py-3 px-4 text-muted text-xs">Nothing is kept; each deployment starts from the repository</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4"><code className={C}>hooks.pre</code> / <code className={C}>hooks.post</code></td>
            <td className="py-3 px-4 text-muted text-xs">Commands run before install, and after the release is live</td>
            <td className="py-3 px-4 text-muted text-xs">Nothing</td>
          </tr>
        </tbody>
      </table>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-6">
        <li>The port is passed to your app as <code className={C}>PORT</code>, so the port in <code className={C}>ez.json</code> is the port it actually listens on.</li>
        <li>With an explicit health path, only a 2xx or 3xx answer counts. With the default <code className={C}>/</code>, any answer that is not a server error does.</li>
        <li><strong className="text-foreground">migrate</strong> runs after the build, in the new release, with the same environment as the build. A failing command aborts the deployment before the switch, so the running release keeps running.</li>
        <li>Migrations are <strong className="text-foreground">forward-only</strong>: rolling the code back cannot undo a migration that already ran. Keep each migration backward-compatible for one release.</li>
        <li>A failing <strong className="text-foreground">post</strong> hook is reported as a warning; the release stays live.</li>
        <li>A mistake in <code className={C}>ez.json</code> stops the deployment before anything running is touched.</li>
      </ul>

      <h3 id="cluster-mode" className="text-base font-bold mt-8 mb-3 text-foreground">Cluster mode</h3>
      <p className="text-muted text-sm leading-relaxed mb-4">
        Cluster mode runs one worker per instance under PM2 and can reload a deployment without downtime: the new workers start before the old ones stop. It is off by default — <code className={C}>execMode</code> is <code className={C}>&quot;fork&quot;</code> with one instance, which is exactly how every app ran before these fields existed.
      </p>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-6">
        <li><code className={C}>instances</code> must be a whole number from 1 to the number of CPUs on the server, or <code className={C}>&quot;max&quot;</code>. The error names the CPU count when the value is out of range or not a whole number.</li>
        <li>Cluster mode only accepts a Node app started by running a JS file directly: <code className={C}>node dist/index.js</code> or <code className={C}>node server.mjs</code>. <code className={C}>npm start</code>, yarn/pnpm scripts and non-Node commands are refused, because PM2 has to own the workers; the error tells you to change the start command to <code className={C}>node &lt;file&gt;</code>.</li>
        <li><code className={C}>instances</code> above 1 with <code className={C}>execMode: &quot;fork&quot;</code> is refused: several forked copies would all try to bind the same port. Choose <code className={C}>cluster</code> instead.</li>
        <li>A deployment of a cluster app that is already running in cluster mode uses <code className={C}>pm2 reload</code>; the first deployment, or a switch between fork and cluster, still stops and starts. Rollback follows the same rule, using the mode recorded in the release.</li>
        <li>The health check watches every worker. One errored, stopped or restarting worker is a boot crash and triggers the normal automatic rollback, even if another worker answers.</li>
      </ul>
      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-lg p-4 text-sm text-muted mb-6">
        ⚠️ Cluster mode runs several copies of the app; it must be stateless (no in-memory sessions, sockets, caches or schedulers that assume one process). The dashboard shows this warning wherever the setting appears, but it never blocks a deployment.
      </div>

      <h3 id="any-language" className="text-base font-bold mt-8 mb-3 text-foreground">Any language</h3>
      <p className="text-muted text-sm leading-relaxed mb-4">When <code className={C}>ez.json</code> gives the commands, they are run exactly as written — the project does not have to be Node. PM2 keeps any program running.</p>
      <CodeBlock lang="json" filename="ez.json — a Python app">{`{
  "install": "pip install -r requirements.txt",
  "build": false,
  "start": "python app.py",
  "port": 8000,
  "health": "/health"
}`}</CodeBlock>

      <h3 id="ez-json-steps" className="text-base font-bold mt-8 mb-3 text-foreground">Adding one to your project</h3>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>Open the app in the dashboard and go to its <strong className="text-foreground">ez.json</strong> tab. It shows a file written out from what the app deploys with today — copy it, or download it.</li>
        <li>Save it as <code className={C}>ez.json</code> at the top of the repository, next to <code className={C}>package.json</code>, and change the commands to match your project.</li>
        <li>Commit and push. The next deployment reads it; its log shows where each value came from — <code className={C}>[ez.json]</code>, <code className={C}>[package.json]</code> or <code className={C}>[override]</code>.</li>
      </ol>
      <p className="text-muted text-sm leading-relaxed mb-10">A value set on the app in the dashboard overrides the file. To let the file decide, leave that field empty on the app.</p>

      <h2 id="domain" className="text-xl font-bold mt-10 mb-4 text-foreground">A domain for the app</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">In the app&apos;s <strong className="text-foreground">Domain &amp; folder</strong> tab, type a domain name. A new name is created; an existing domain is re-pointed at the app. nginx proxies it to the app&apos;s port, and a deployment that changes the port takes the domain with it.</p>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-10">
        <li>The app needs a port — set on it, or in <code className={C}>ez.json</code> with one deployment done.</li>
        <li>Tick <strong className="text-foreground">Request an SSL certificate</strong> to issue one over HTTP-01 at the same time. If it cannot be issued (the DNS does not point here yet) the domain still works over HTTP and you can issue it later from the SSL page.</li>
        <li>The result is an ordinary domain: it appears on the Domains page and is edited there.</li>
        <li>Deleting an app asks what to do with its domain. The default is to keep it.</li>
      </ul>

      <h2 id="folder" className="text-xl font-bold mt-10 mb-4 text-foreground">Where apps live, and moving one</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">New apps are created in the <strong className="text-foreground">deployments folder</strong>: <code className={C}>ez_deploys</code> inside the Easy DevOps data directory by default, changeable in Settings. <strong className="text-foreground">Changing the setting never moves an existing app</strong> — each app records the folder it was created in and keeps using it.</p>
      <p className="text-muted text-sm leading-relaxed mb-10">To move one, use <strong className="text-foreground">Move app</strong> in its Domain &amp; folder tab and give a folder. The app is stopped in PM2, its folder is moved to <code className={C}>&lt;folder&gt;/&lt;app name&gt;</code>, and it is started again from there. Moving to another disk copies every release and can take a while.</p>

      <h2 id="environment" className="text-xl font-bold mt-10 mb-4 text-foreground">Environment variables</h2>
      <p className="text-muted text-sm leading-relaxed mb-10">Set them on the app, one <code className={C}>NAME=value</code> per line — a pasted <code className={C}>.env</code> file works. They are stored on the server only, and are available to install, build, migrate and the running app. They are never written to the repository and never sent to the Hub.</p>

      <h2 id="persistent-data" className="text-xl font-bold mt-10 mb-4 text-foreground">Persistent data</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">
        Every deployment starts from a fresh checkout in a new release folder. That is what makes a failed build harmless and a rollback instant — but it also means the folder is disposable. A SQLite database, uploaded images, or a JSON log the app writes each day belong to that one release: the next deployment starts without them, and a rollback brings back the older release&apos;s <em>code</em>, not the data written since.
      </p>
      <p className="text-muted text-sm leading-relaxed mb-4">
        List the folders — or single files — your app writes to under <strong className="text-foreground">Folders and files to keep</strong> in the app&apos;s Edit form. Add one path at a time and it appears as a chip with an × to remove it. Each path is kept once outside the releases, and every release — new, older, rolled back — reaches it at the same path inside the project. Deploying, rolling back and pruning releases leave it alone.
      </p>
      <CodeBlock lang="json" filename="ez.json">{`{
  "persist": ["data", "uploads/imgs", "logs"]
}`}</CodeBlock>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-6">
        <li>Paths are relative to the project folder. A list set on the app in the dashboard or in the Hub overrides the file, like every other field.</li>
        <li><strong className="text-foreground">Prefer the folder.</strong> SQLite creates <code className={C}>-wal</code> and <code className={C}>-shm</code> files next to its database, so list <code className={C}>prisma</code>, not <code className={C}>prisma/hub.db</code> — keeping only the database can leave its latest writes behind. A single file works when the file is genuinely all there is, and on Windows it is kept as a hard link instead of a symlink.</li>
        <li>Up to 20 paths. <code className={C}>.git</code> and <code className={C}>node_modules</code> cannot be listed; dependencies are always installed fresh for each release.</li>
        <li>Paths may not overlap: listing <code className={C}>data</code> and <code className={C}>data/uploads</code> keeps only <code className={C}>data</code>.</li>
        <li>The running app receives the shared location as <code className={C}>EZ_SHARED_DIR</code>, for the rare case where it needs an absolute path.</li>
      </ul>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">When this happens</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">To the kept paths</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Deploy</td><td className="py-3 px-4 text-muted text-xs leading-relaxed">Unchanged. The new release sees the same files the old one did.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Roll back</td><td className="py-3 px-4 text-muted text-xs leading-relaxed">Unchanged. The older release sees the <em>current</em> data, not the copy it had when it was live.</td></tr>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Old releases pruned</td><td className="py-3 px-4 text-muted text-xs leading-relaxed">Untouched. Release folders are deleted; the kept paths are not part of them.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Move app</td><td className="py-3 px-4 text-muted text-xs leading-relaxed">They move with the app and keep working.</td></tr>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Delete app</td><td className="py-3 px-4 text-muted text-xs leading-relaxed"><strong className="text-foreground">Kept by default</strong>, at the path shown when you delete. Tick &quot;Also delete the persistent data&quot; to remove them too.</td></tr>
        </tbody>
      </table>

      <h3 id="persistent-seed" className="text-base font-bold mt-8 mb-3 text-foreground">The first deployment, and after</h3>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-6">
        <li>The first deployment after a path is listed seeds the kept location: from the live release when the app has already run, otherwise from the repository. After that the <strong className="text-foreground">kept copy is what counts</strong> — editing those files in the repository changes nothing, because the deployment will not overwrite data your app may have written since.</li>
        <li>A path that exists nowhere — a database written for the first time at runtime — is created empty: an empty folder, or an empty file when the name has an extension.</li>
        <li>Paths are linked in before install and build, so a build step can use them too. If a build deletes or replaces one, the deployment fails there, rather than finishing without the data.</li>
      </ul>

      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-lg p-4 text-sm text-muted mb-6">
        ⚠️ A rollback runs the older code against the <strong className="text-foreground">same data</strong>. A database migration in a newer release can leave the previous release unable to read it — and the migration itself cannot be undone by rolling the code back. Keep migrations backward compatible for one release, and run them from <code className={C}>migrate</code> rather than the post hook so a failed migration stops the deployment before the switch.
      </div>

      <p className="text-muted text-sm leading-relaxed mb-10">
        What not to keep: caches, compiled assets, anything the build recreates. And since each release installs its own dependencies, keeping <code className={C}>node_modules</code> would only hide which release is running with which packages — the disk cost of releases is expected, and releases are pruned for that reason.
      </p>

      <h2 id="github-actions" className="text-xl font-bold mt-10 mb-4 text-foreground">Deploying from GitHub Actions</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">Every push can deploy the pushed commit, and the commit&apos;s check on GitHub turns red if the deployment fails. This uses the <strong className="text-foreground">deploy hook</strong>: a small listener that is off until you switch it on.</p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted leading-relaxed mb-6">
        <li>On the Deployments page, open <strong className="text-foreground">Deploy hook → Configure</strong>, switch it on, and choose how GitHub reaches it.</li>
        <li>Open the app&apos;s <strong className="text-foreground">GitHub</strong> tab and create its deploy token. It is shown once.</li>
        <li>Add the two repository secrets it lists: <code className={C}>EZ_DEPLOY_URL</code> and <code className={C}>EZ_DEPLOY_TOKEN</code>.</li>
        <li>Commit the workflow file it generates to <code className={C}>.github/workflows/</code>.</li>
      </ol>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">How GitHub reaches the hook</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">What it means</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Through one of your domains <span className="text-green-500 text-xs">recommended</span></td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">One path, <code className={C}>/.ez-deploy/</code>, is added to that domain&apos;s nginx config. With a certificate on the domain the token travels over HTTPS. Nothing else — and nothing of the dashboard — becomes reachable.</td>
          </tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Directly, on its own port</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">The listener binds to loopback by default (port 6445). Setting its bind to <code className={C}>0.0.0.0</code> exposes it on every interface, and then it is <strong className="text-foreground">plain HTTP</strong>: the token is sent unencrypted, and the port has to be opened in the firewall. For private networks. The UI says so when you choose it.</td>
          </tr>
          <tr className="hover:bg-primary/[0.03] transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">Through the Hub</td>
            <td className="py-3 px-4 text-muted text-xs leading-relaxed">For a server paired with a Hub. The Action calls the Hub, which forwards the request down the connection the server already holds open — <strong className="text-foreground">no inbound port, no public domain</strong>. The server still verifies the token itself; the Hub stores nothing. Enable &quot;Deploy from CI through the Hub&quot; in Settings → Hub.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-muted text-sm leading-relaxed mb-6">The workflow file is the same whichever way you choose. Only the value of the <code className={C}>EZ_DEPLOY_URL</code> secret differs.</p>

      <h3 id="automatic-setup" className="text-base font-bold mt-8 mb-3 text-foreground">Do it for me</h3>
      <p className="text-muted text-sm leading-relaxed mb-4">For a github.com repository, the GitHub tab can do the steps itself: it stores both secrets (encrypted, the way GitHub requires), commits the workflow file to the app&apos;s branch, and adds the deploy key read-only.</p>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted leading-relaxed mb-6">
        <li>It needs a GitHub token that may write the repository&apos;s <strong className="text-foreground">secrets</strong>, <strong className="text-foreground">contents</strong> and <strong className="text-foreground">workflows</strong> — and administer it, for a deploy key. A token typed for this is used once and not stored.</li>
        <li>A new deploy token is created and goes straight into the repository&apos;s secrets. It is never shown, and the previous one stops working.</li>
        <li>Each step is reported on its own. If the token may write secrets but not workflows, the secrets are in place and you are told which step is left.</li>
        <li>Committing the workflow is a push to the branch, so it starts the first deployment.</li>
      </ul>

      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-lg p-4 text-sm text-muted mb-10">
        🔒 A deploy token can start a deployment of <strong className="text-foreground">its own app, from that app&apos;s configured repository</strong>, and read that deployment&apos;s status. It cannot choose the repository, the commands or the environment. Only a hash of it is stored; ten wrong attempts lock a client out for 15 minutes.
      </div>

      <h2 id="from-the-hub" className="text-xl font-bold mt-10 mb-4 text-foreground">Deploying from the Hub</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">A paired server&apos;s apps appear in the <strong className="text-foreground">Deployments</strong> section of its Hub page. What the Hub may do is decided <strong className="text-foreground">on the server</strong>, in Settings → Hub, one switch per action. All are off until you turn them on, and the server checks every request itself.</p>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Permission</th>
            <th className="text-left py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">Allows</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Deploy</td><td className="py-3 px-4 text-muted text-xs">Start a deployment of an existing app from its configured repository.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Roll back</td><td className="py-3 px-4 text-muted text-xs">Switch an app back to an earlier release.</td></tr>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">View deployment logs</td><td className="py-3 px-4 text-muted text-xs">Read a deployment&apos;s output.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Create, edit and delete apps</td><td className="py-3 px-4 text-muted text-xs">Add an app from a repository, change its settings, issue its deploy token, delete an old release, or remove the app.</td></tr>
          <tr className="hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Read and edit environment variables</td><td className="py-3 px-4 text-muted text-xs">Separate from managing an app on purpose. Values pass through the Hub while being edited and are not stored there.</td></tr>
          <tr className="bg-primary/[0.015] hover:bg-primary/[0.03] transition-colors"><td className="py-3 px-4 text-foreground font-medium">Deploy from CI through the Hub</td><td className="py-3 px-4 text-muted text-xs">Let a GitHub Action trigger a deployment by calling the Hub.</td></tr>
        </tbody>
      </table>
      <p className="text-muted text-sm leading-relaxed mb-10">The list of apps and their status is always visible on the Hub: a paired server is a monitored server. It contains the <em>names</em> of environment variables, never their values. A deploy key cannot be generated from the Hub — its private half never leaves the server.</p>

      <h2 id="rollback" className="text-xl font-bold mt-10 mb-4 text-foreground">Rolling back</h2>
      <p className="text-muted text-sm leading-relaxed mb-4">The app&apos;s <strong className="text-foreground">Releases</strong> tab lists what is on disk. Rolling back starts an earlier release exactly as it was built — nothing is fetched or rebuilt. The newest five releases are kept by default (2–20); the live one and the one before it are never deleted. The list follows a deployment started from outside the dashboard — a push through GitHub Actions or the Hub — on its own.</p>
      <p className="text-muted text-sm leading-relaxed mb-4">Each older release also has a <strong className="text-foreground">Delete</strong> button beside <strong className="text-foreground">Roll back</strong>. Deleting removes that release&apos;s folder from the server; its deployment log stays, and persistent data is not touched. The live release and the one an automatic rollback would return to cannot be deleted, and nothing can be deleted while a deployment of the app is running.</p>
      <p className="text-muted text-sm leading-relaxed mb-10">Automatic rollback can be switched off per app. Then an unhealthy release is stopped and the deployment is reported as failed.</p>

      <h2 id="files" className="text-xl font-bold mt-10 mb-4 text-foreground">Where things live</h2>
      <CodeBlock lang="text" filename="In the deployments folder">{`ez_deploys/<app>/releases/<id>/    ← one checkout per deployment, built in place
ez_deploys/<app>/shared/           ← the persistent paths (folders and files) listed under persistent data
ez_deploys/<app>/logs/<id>.log     ← that deployment's output
ez_deploys/<app>/runs/<id>.json    ← that deployment's state
ez_deploys/<app>/id_deploy         ← the app's private deploy key (owner-only)`}</CodeBlock>

      <DocsPagination
        prev={{ title: "SSL Manager", href: "/docs/ssl", section: "Using the CLI" }}
        next={{ title: "Background Service", href: "/docs/service", section: "Operations" }}
      />
    </DocPage>
  );
}
