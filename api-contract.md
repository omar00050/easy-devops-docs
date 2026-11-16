# Easy DevOps — Dashboard API Contract

**Contract version: 2.6.0** · Last updated: 2026-11-15 · Derived from the code in
`src/dashboard/`, not from any earlier plan.

> ## The rule
>
> **Any change to an endpoint or a Socket.io event updates this file first, in
> the same change.** Adding, removing or renaming a route, changing a request or
> response shape, or changing which auth applies — all of it lands here before
> or alongside the code.
>
> This is enforced, not merely requested: `e2e/run.mjs` compares the routes
> actually registered by `src/dashboard/routes/*.js` against the table below and
> **fails the test run on any mismatch**. `npm test` will not pass if they
> disagree.
>
> The contract version is semantic: MAJOR for a removal or an incompatible
> change to an existing endpoint or event, MINOR for additions, PATCH for
> documentation-only corrections.

---

## 1. Transport and request rules

All REST endpoints are under `/api`. All requests and responses are JSON
(`Content-Type: application/json`), except `GET /api/settings/backup`, which
sends a file download.

Three checks apply to **every** `/api` request, before authentication, and in
**both** auth modes. They are implemented in `src/dashboard/lib/localRequest.js`
and they defend against a hostile page in the same browser — something a
password never protected against.

| Check | Rule | Failure |
|---|---|---|
| `Host` | Port must match the dashboard's. On a **loopback** bind the hostname must be `localhost`, `127.0.0.1` or `[::1]`. On a **public** bind any hostname is accepted. | `403` |
| `Origin` | When present: port must match. On a loopback bind the hostname must be a loopback name; on a public bind it must equal the `Host` hostname (same-origin). | `403` |
| `X-EZ-Request: 1` | Required on every `POST`, `PUT`, `PATCH`, `DELETE`, and on the Socket.io handshake. Not required on `GET`. | `403` |

A `403` from these checks carries `{ error, reason, detail }`, where `reason` is
one of `host_missing`, `host_port_mismatch`, `host_not_local`,
`origin_malformed`, `origin_port_mismatch`, `origin_not_local`,
`origin_cross_site`, `missing_request_header`.

**403 is deliberately not 401.** A login cannot fix "this request may not be
made from where it came from", so the client must not be sent to the login
screen.

### Authentication

`dashboardAuth` is either `password` (default) or `none`.

- **`password`** — every endpoint marked *session* requires a logged-in session
  cookie. Without one: `401 { error: "Unauthorized" }`.
- **`none`** — no session is required. Honoured **only** while
  `dashboardBindAddress` is `127.0.0.1` or `::1`; if the stored config ever says
  `none` with a public bind, a password is required anyway
  (`effectiveAuthMode()` in `src/core/config.js`).

The transport checks above are **not** relaxed in `none` mode. In that mode they
are the only defence left, which is what makes "no password on loopback" a
defensible option rather than an open door.

**Auth column values used below:** `public` (no session needed, ever) ·
`session` (session required in `password` mode).

---

## 2. REST endpoints

### 2.1 Authentication — `src/dashboard/routes/auth.js`

The only public router. Everything here exists so a client can obtain a session
in the first place, so it cannot sit behind the session gate; each endpoint
carries its own guard instead.

| Method | Path | Auth |
|---|---|---|
| GET | `/api/auth` | public |
| POST | `/api/login` | public |
| POST | `/api/setup` | public |
| POST | `/api/logout` | public |

**`GET /api/auth`** — what the page needs to decide between the dashboard, the
login form and the first-run screen.

Response `200`:
```json
{
  "authenticated": true,
  "needsSetup": false,
  "authMode": "password",
  "canUseNoPassword": false,
  "bindAddress": "127.0.0.1",
  "minPasswordLength": 6,
  "setupCodeRequired": false,
  "setupCodeExpiresAt": null
}
```
`canUseNoPassword` is true only when the bind is loopback **and** this request
came from a loopback address. It drives whether the first-run screen offers the
"No password" option at all.

`setupCodeRequired` is true while first-run setup is pending and a one-time
setup code is outstanding; the first-run screen must then collect it alongside
the new password. `setupCodeExpiresAt` is an epoch-millisecond timestamp, or
`null` when no code is outstanding — it lets the screen say the code has
expired instead of only reporting a rejection.

**The code itself is never in any response.** It is printed to the local
terminal and written to the local service log, and nowhere else: not here, not
in a Socket.io event, and not in anything the Hub agent sends. A client learns
only *whether* a code is required, never what it is.

**`POST /api/login`** — `{ "password": "…" }`

- `200` `{ "ok": true }` — a session cookie is issued, and the session id is
  regenerated to prevent fixation.
- `401` `{ "ok": false, "error": "Invalid password" }`
- `401` `{ "ok": false, "error": "…", "needsSetup": true }` — no password is set.
- `409` `{ "ok": false, "error": "…", "authMode": "none" }` — nothing to log into.
- `429` `{ "ok": false, "error": "…", "retryAfterSeconds": 900 }` plus a
  `Retry-After` header. Rate limit: 10 attempts per 15 minutes per IP.

**`POST /api/setup`** — first run only. Either:
```json
{ "password": "at least 6 characters", "setupCode": "418 902" }
```
or
```json
{ "mode": "none" }
```

`setupCode` is **required whenever `setupCodeRequired` is true** and a password
is being set. It is the first-run takeover protection: this endpoint is public
by necessity — there is no session to require before the first password exists —
so without a code whoever reaches a freshly started dashboard first owns it.
Six digits, accepted with or without the space, valid for 24 hours.

`mode: "none"` does **not** require the code: it is already restricted to a
loopback bind **and** a loopback request, which is a stronger constraint than
the code provides.

- `200` `{ "ok": true, "authMode": "password" | "none" }` — signs the user in
  when a password was set. The code is invalidated at this point and a later
  attempt to reuse it fails.
- `400` `{ "ok": false, "error": "…" }` — password too short, `mode: "none"`
  requested where it is not permitted, or the setup code is missing, wrong or
  expired. A wrong code is not distinguished from a missing one in the message.
- `409` `{ "ok": false, "error": "…" }` — already configured. Prevents this
  public endpoint being used to take over an installation.
- `429` `{ "ok": false, "error": "…", "retryAfterSeconds": 900 }` plus a
  `Retry-After` header — too many setup attempts from this IP. Counted in its
  own budget, so setup guesses cannot exhaust the login budget or the reverse.
- `500` `{ "ok": false, "error": "…" }`

**After 20 failed code attempts in total**, across every IP, the outstanding
code is invalidated: `setupCodeRequired` stays true, every `setupCode` is then
rejected, and the service log says why. A new code can only be issued from the
machine itself:

```
ezz dashboard setup-code
```

That cap is what makes six digits defensible. A per-IP limit alone is
bypassable from many addresses; a global cap bounds the whole attack to 20
guesses against a 10<sup>6</sup> space, and the only way back is physical or
shell access to the server.

**`POST /api/logout`** — no body. `200 { "ok": true }`. Destroys the session.

### 2.2 Domains — `src/dashboard/routes/domains.js` (mounted at `/api/domains`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/domains` | session | List domains (v2 schema, migrated on read) |
| POST | `/api/domains` | session | Create a domain and write its nginx config |
| PUT | `/api/domains/:name` | session | Update a domain and regenerate its config |
| DELETE | `/api/domains/:name` | session | Delete a domain and its config |
| PUT | `/api/domains/:name/toggle` | session | Enable/disable without deleting |
| POST | `/api/domains/:name/reload` | session | Test and reload nginx for one domain |
| GET | `/api/domains/:name/notifications` | session | Per-domain notification config |
| PUT | `/api/domains/:name/notifications` | session | Replace that config |

Create/update bodies carry the v2 domain shape: `name`, `port`, `backendHost`,
`upstreamType`, `www`, `wildcard`, and the nested `ssl`, `performance`,
`security`, `advanced` objects. Unspecified fields take `DOMAIN_DEFAULTS`.

Responses: `201` (create) / `200` with the stored domain object;
`{ "deleted": name }` for delete; `{ "enabled": boolean }` for toggle.

Errors: `400` validation · `404` `{ "error": "Domain not found: …" }` ·
`422` `{ "error": "cert_missing", "certPath", "keyPath", "hint" }` when SSL is
on but the certificate files are absent · `500` with
`{ "error", "details"|"output" }` when nginx rejects the generated config (the
previous config is restored first).

An item from `GET /api/domains` may also carry `sslPathWarning: true` when its
stored certificate paths contain backslashes — nginx on Windows can fail to
load a config with those. The remedy is to open and save the domain, which
regenerates the paths with forward slashes. The field name is kept as the
backend produces it rather than renamed for the API, since the dashboard UI is
its only consumer and renaming would break that for no gain.

`GET`/`PUT /api/domains/:name/notifications` exchange a map keyed by
`nginx_down` | `cert_expiry` | `domain_health`, each value
`{ "enabled": boolean, "channelIds": ["…"] }`.

### 2.3 SSL — `src/dashboard/routes/ssl.js` (mounted at `/api/ssl`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/ssl` | session | List certificates with expiry and status |
| POST | `/api/ssl/create` | session | Issue a certificate |
| POST | `/api/ssl/create-confirm` | session | Continue a DNS-01 issuance after the TXT record is in place |
| POST | `/api/ssl/create-cancel` | session | Abandon a pending DNS-01 issuance |
| POST | `/api/ssl/renew/:domain` | session | Renew one certificate |
| POST | `/api/ssl/renew-all` | session | Renew everything expiring within 30 days |
| DELETE | `/api/ssl/:domain` | session | Delete a certificate, refusing while nginx configs still reference it |

**`GET /api/ssl`** response `200` is an array; each item is:
```json
{ "domain": "example.com", "expiry": "2027-01-02T00:00:00.000Z", "daysLeft": 50, "status": "valid" }
```
`status` is one of `valid` | `expiring` | `expired` | `error`:

- `expiring` means fewer than 30 days remain.
- `expired` means `daysLeft` has already passed zero — `daysLeft` is
  **negative** in that case, and clients display it as overdue rather than
  clamping it to zero.
- `error` means the certificate could not be read at all; `expiry` and
  `daysLeft` are both `null` in that case.
- Otherwise `expiry` is an ISO string and `daysLeft` a number.

Since 2.3.0 each item also carries what the background job intends for it
(additive — a client may ignore all three):

```json
{
  "autoRenew": "auto",
  "autoRenewDays": 7,
  "lastAutoRenew": { "at": 1794000000000, "result": "failed", "error": "DNS problem: NXDOMAIN" }
}
```

- `autoRenew` is one of `auto` (renewed in the background once `daysLeft` is at
  or below `autoRenewDays`) | `manual` (a DNS-01 certificate — every wildcard
  is one — needs a TXT record added by hand, so it only gets the expiry
  warning) | `unused` (no enabled domain with SSL on serves it, so it is left
  alone) | `off` (`sslAutoRenew` is false).
- `lastAutoRenew` is `null` until the job has attempted this certificate.
  `result` is `renewed` or `failed`; `error` is the one-line reason for a
  failure.

The value is computed by the function the job itself uses
(`autoRenewPlan()` in `core/cert-renewal.js`), so the list cannot promise a
renewal the job will not perform.

`POST /api/ssl/create` takes
`{ domain, www?, validationMethod: "http"|"dns", email? }`.

- HTTP-01: `200` with the issuance result, including `mode`, `fellBack`,
  `nginxDownMs` and a human `summary`.
- DNS-01: `202` with the TXT record to create; the request then waits for
  `create-confirm` or `create-cancel`.
- `400` `{ "error": "email_required", "hint": … }` when no ACME email is set.

`renew-all` returns an array of per-domain results, each with `domain`,
`success`, `certPath`, `keyPath`, `mode`, `fellBack`, `nginxDownMs`,
`configRegenerated`, `nginxReloaded`, `summary`.

**`DELETE /api/ssl/:domain`** removes the certificate's directory
(`${sslDir}/${domain}`, containing `fullchain.pem` and `privkey.pem`). Before
deleting anything it scans the nginx configuration tree (`nginxDir`,
recursively, over `*.conf` and `*.conf.disabled` files including the main
`nginx.conf`) for lines that point into that directory.

- `200` `{ "deleted": "broken.example.com", "directory": "/etc/easy-devops/ssl/broken.example.com" }`.
- `404` `{ "error": "Certificate '<domain>' not found" }` when the certificate
  directory does not exist.
- `409` when a config still references the certificate; nothing is deleted:
  ```json
  {
    "error": "cert_in_use",
    "directory": "/etc/easy-devops/ssl/app.example.com",
    "references": [
      {
        "file": "/etc/nginx/conf.d/app.example.com.conf",
        "line": 14,
        "text": "ssl_certificate /etc/easy-devops/ssl/app.example.com/fullchain.pem;"
      }
    ],
    "hint": "At least one nginx config still points at this certificate. …"
  }
  ```
  Disable SSL on the referencing domain (or remove the lines) first; this is
  what keeps a delete from leaving nginx pointing at missing files.

**Renewal behaviour (2.3.0).** `renew/:domain`, `renew-all`, the CLI, the Hub
command and the background job all go through `renewCertificate()` in
`core/cert-renewal.js`:

- The renewed certificate covers the **same names** as the one it replaces,
  read back from the certificate. A certificate issued with `www` keeps `www`;
  before 2.3.0 a renewal silently dropped it.
- After a proxy-mode renewal nginx is **reloaded**, and the result carries
  `nginxReloaded: true | false` (`null` in standalone mode, which restarts
  nginx itself). `false` means the new certificate is on disk but nginx is
  still serving the old one — `summary` says so.
- A DNS-01 / wildcard certificate is refused rather than replaced by a
  single-name HTTP-01 certificate: `renew/:domain` answers `409`
  `{ "error": "manual_renewal_required", "detail": …, "hint": … }`, and
  `renew-all` reports that item with `success: false`,
  `error: "manual_renewal_required"`.

### 2.4 Nginx — `src/dashboard/routes/nginx.js` (mounted at `/api/nginx`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/nginx/status` | session | `{ running, version, pid }` |
| POST | `/api/nginx/start` | session | Start nginx |
| POST | `/api/nginx/stop` | session | Stop nginx |
| POST | `/api/nginx/restart` | session | Restart nginx |
| POST | `/api/nginx/reload` | session | Graceful reload |
| POST | `/api/nginx/test` | session | `nginx -t`, judged by `isNginxTestOk()` |
| GET | `/api/nginx/configs` | session | List config filenames |
| GET | `/api/nginx/config/:filename` | session | `{ content }` |
| POST | `/api/nginx/config/:filename` | session | `{ content }` — written, tested, rolled back on failure |
| GET | `/api/nginx/logs` | session | Recent access/error lines |

**`GET /api/nginx/logs`** takes two optional query parameters and returns
`{ lines: string[], file: "error" | "access" }`:

| Parameter | Values | Default |
|---|---|---|
| `file` | `error` \| `access` | `error` |
| `lines` | 1–5000, clamped | `100` |

Both are additive — the endpoint previously took none and always returned 100
lines of the error log, which is still what it does with no parameters. The
access log was unreachable before this, despite the table above having always
described the endpoint as access/error. `file` is echoed back so a client
cannot mistake which log it is displaying.

The log path is resolved by `nginxLogPath()` in `core/platform.js`:
`<nginxDir>/logs/<file>.log` on Windows, `/var/log/nginx/<file>.log`
elsewhere. Reading `<nginxDir>/logs` unconditionally is why this endpoint
returned nothing at all on Linux before.

Service actions return `{ success, output }`. On Linux a failure caused by
missing sudoers rules returns a message naming
`Settings → Setup Linux Permissions` rather than the raw error.

The `version` field in `GET /api/nginx/status` and in the `nginx:status` socket
event (§3.1) already carries the `nginx/` prefix (e.g. `"nginx/1.26.2"`).
Clients must render it as-is and must not add their own prefix.

### 2.5 Settings — `src/dashboard/routes/settings.js` (mounted at `/api`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/settings` | session | Current settings (never the password or its hash) |
| POST | `/api/settings` | session | Update settings |
| GET | `/api/settings/permissions` | session | Linux sudoers state `{ configured }` |
| POST | `/api/settings/permissions/setup` | session | Write `/etc/sudoers.d/easy-devops` |
| GET | `/api/settings/backup` | session | Download config + domains as JSON |
| POST | `/api/settings/restore` | session | Restore from such a file |
| GET | `/api/settings/channels` | session | Notification channels |
| POST | `/api/settings/channels` | session | Create a channel |
| PUT | `/api/settings/channels/:id` | session | Update a channel |
| DELETE | `/api/settings/channels/:id` | session | Delete a channel |
| POST | `/api/settings/channels/:id/test` | session | Send a test notification |

**`GET /api/settings`** response `200`:
```json
{
  "dashboardPort": 6443,
  "nginxDir": "/etc/nginx",
  "sslDir": "/etc/easy-devops/ssl",
  "acmeEmail": "you@example.com",
  "sslAutoRenew": true,
  "sslAutoRenewDays": 7,
  "sslAutoRenewDaysMin": 1,
  "sslAutoRenewDaysMax": 30,
  "deployDir": "/home/me/.config/easy-devops/ez_deploys",
  "deployDirDefault": "/home/me/.config/easy-devops/ez_deploys",
  "deployDirIsDefault": true,
  "dashboardBindAddress": "127.0.0.1",
  "bindsToLoopbackOnly": true,
  "dashboardAuth": "password",
  "dashboardUi": "classic",
  "canUseNoPassword": true,
  "hasPassword": true,
  "platform": "linux"
}
```
Neither `dashboardPassword` nor `dashboardPasswordHash` is ever returned.

**`POST /api/settings`** accepts any subset of `dashboardPort`,
`dashboardPassword`, `dashboardAuth`, `dashboardBindAddress`, `dashboardUi`,
`nginxDir`, `sslDir`, `acmeEmail`, `deployDir`, `sslAutoRenew` (boolean), `sslAutoRenewDays`
(whole number, `sslAutoRenewDaysMin`–`sslAutoRenewDaysMax`; anything else is a
`400`). Response `200`:
`{ "success": true, "needsRestart": boolean, "dashboardAuth": "…", "dashboardUi": "classic" | "new" }`.
`needsRestart` is true when the port, bind address or UI choice changed —
none of them takes effect until the dashboard restarts.

`deployDir` (2.6.0) is the folder **new** deployed apps are created in. Send
an absolute path, or `""` / `null` to go back to the default
(`deployDirDefault`). The folder is created if it does not exist; `400` when it
cannot be, or when the path contains characters a shell would act on. Existing
apps are not moved — see §2.8.

`sslAutoRenew` / `sslAutoRenewDays` (2.3.0) control the background renewal of
HTTP-01 certificates and need no restart: the job reads them on each pass
(every 12 hours, and once when the background service starts). A fresh install
and an install that predates the setting both read as `true` / `7`. The limits
are published so no client hard-codes them.

`dashboardUi` is `classic` (the default, the EJS page) or `new` (the built
React app in `dist/ui`). Any other value is `400` `{ error }`. The setting
exists so a background service can select the UI on each boot; `--new-ui`
overrides it for a single run. See §4.

The **auth/bind interlock** is validated against the state the request would
produce, not the current state, so a single request cannot set both and slip
through:

- `dashboardAuth: "none"` with a non-loopback bind → `400`
  `{ reason: "no_auth_requires_loopback" }`.
- Moving the bind off loopback while auth is `none` → `400`
  `{ reason: "bind_requires_password" }`, with an error telling the user to set
  a password first.
- Turning auth off from a non-loopback request → `403`
  `{ reason: "no_auth_requires_local_request" }`.
- Setting a password implies `dashboardAuth: "password"`.

**`GET /api/settings/channels`** response `200` is an array; each item is:
```json
{ "id": "…", "name": "…", "type": "discord" | "telegram", "webhookUrl": "…", "botToken": "…", "chatId": "…", "message": "…" }
```
`webhookUrl` applies to `discord`; `botToken` and `chatId` apply to `telegram`;
`message` is optional on either. Only the fields relevant to `type` are present.

`GET /api/settings/backup` strips **both** the password and its hash: a backup is
a file people share, and a scrypt hash is still worth cracking offline.
`POST /api/settings/restore` ignores any `dashboardPassword`,
`dashboardPasswordHash`, `dashboardBindAddress` or `dashboardAuth` in the file,
so a backup can neither reinstate a plain-text password nor silently re-open the
listener.

### 2.6 Hub pairing — `src/dashboard/routes/hub.js` (mounted at `/api/hub`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/hub/connect` | session | Save an `ezops://` connection string and start the agent |
| DELETE | `/api/hub/link` | session | Unlink and stop the agent |
| GET | `/api/hub/status` | session | Link + agent state, the permission catalog, and the active data directory |
| PUT | `/api/hub/permissions` | session | Grant/revoke hub permissions |

`GET /api/hub/status` returns `linked`, `hubUrl`, `serverId`, `permissions`,
`tree`, `comingSoon`, `connected`, `status`, `lastError`, `attempts`, `dataDir`,
`defaultDataDir`, `devDataDir`. **It never returns the shared secret**, and no
endpoint echoes an `ezops://` string back.

`defaultDataDir` and `devDataDir` answer different questions, and conflating
them was a bug:

| Field | True when | Use |
|---|---|---|
| `defaultDataDir` | `dataDir` is the ordinary location for this platform | A `false` here explains an apparent sync bug: a CLI and a dashboard may be reading two different databases |
| `devDataDir` | this is a **development** run — `--dev`/`EZ_DEV=1`, or a `.dev-data` directory | Development behaviour: Let's Encrypt **staging**, `-dev` process names, the legacy migration skipped |

Every installed background service passes `EASY_DEVOPS_DATA_DIR` so the service
and the CLI agree on one location. That alone used to set `devDataDir`, which
made a real install issue staging certificates on real domains.

**`POST /api/hub/connect`** also returns `agentOwner`: `"daemon"` when a
background service is running and will pick up the new pairing (with a `detail`
string saying so), or `"dashboard"` when this process holds the agent itself.
Only one process may hold an agent — the Hub keeps a single socket per server
and evicts the older one, so two would evict each other indefinitely.

`PUT /api/hub/permissions` takes leaf ids (`{ "nginx.reload": true }`) or whole
groups (`{ "groups": { "nginx": true } }`). Unknown and `comingSoon` ids are
ignored, so a malformed request cannot widen access.

### 2.7 Service and processes — `src/dashboard/routes/processes.js` (mounted at `/api`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/service` | session | Background-service state |
| POST | `/api/service/start` | session | Start the background service |
| POST | `/api/service/stop` | session | Stop it — temporarily |
| POST | `/api/service/restart` | session | Stop then start it |
| GET | `/api/processes` | session | PM2 process list |
| GET | `/api/processes/:name/logs` | session | Recent lines for one process |
| POST | `/api/processes/:name/:action` | session | `action` ∈ `start`, `stop`, `restart`, `reload` |

> **This section describes the NATIVE background service.** Easy DevOps used to
> run itself as a PM2 app named `ez-dashboard`, started at boot by a Windows
> Task Scheduler task that needed the user's **password**. All of that is gone.
> The service is now a systemd unit, a real Windows Service via WinSW, or a
> Startup-folder supervisor, and **no password is ever requested in any mode** —
> the Windows service runs as the virtual account `NT SERVICE\EasyDevOps`.
>
> The PM2-era daemon fields were **removed** from `GET /api/service`:
> `installed`, `running`, `status`, `app`, `appName`, `enabledOnBoot`,
> `bootMode`, `bootDetail`, `sameUser`, `currentUser`, `appUser`, `pm2Home`,
> `daemonRunning`, `canInstallFromDashboard`, `cliHint`. They described a PM2
> app that no longer exists, and on a machine where the daemon WAS running they
> reported `installed: false, running: false` — so a client reading them showed
> "Not installed" over a working service.

**`GET /api/service`** response `200`:

```json
{
  "backgroundService": { "…": "see below" },
  "pm2": { "installed": true, "version": "6.0.14", "path": "C:\\…\\pm2.cmd" },
  "dev": false,
  "dataDir": "C:\\Users\\me\\AppData\\Roaming\\easy-devops",
  "install": { "command": "ezz service install", "needsElevation": false, "shell": null },
  "probes": { "ageMs": 2800, "fresh": true, "pending": false, "refreshing": false }
}
```

`pm2`, `dev`, `dataDir` and `install` are what remains true: PM2 is still how
the **user's own** applications run (the Processes page below), `dev` drives the
dev badge, and `install` is the per-mode guidance for a client that cannot
elevate itself. Reading `pm2` never starts a PM2 daemon — every pm2 command
would, so the pid file is checked first.

#### Cheap facts now, measured facts when they are ready

This endpoint took about **twenty seconds** on a Windows machine. Nothing in it
was slow by itself: it made about six subprocesses, in sequence, and on that
machine one subprocess through PowerShell costs about a second (`where.exe pm2`
2.0 s, `pm2 --version` 4.0 s, `schtasks /Query` 1.7 s).

So the response is now built from two kinds of fact:

| | read | cost |
|---|---|---|
| The daemon lock, its heartbeat, whether a stop was requested, what install recorded, the data directory | **fresh on every request** | microseconds |
| The service manager's view, the pinned runtime's version, legacy PM2 leftovers, PM2 detection | from a cache, refreshed in the background | one subprocess each |

The cached probes run **in parallel** when they do run, and the dashboard warms
them when it starts. Measured after the change: a warm call about **3 ms**, and
the first call after a start about **1.6 s**, bounded by a deadline rather than
by how slow the probes happen to be.

`probes` describes the measurement, not the service:

| Field | Meaning |
|---|---|
| `ageMs` | Age of the oldest cached probe in this response |
| `fresh` | Every probe is within its lifetime. `false` means a refresh is running behind this response |
| `pending` | At least one probe has **never** completed, so the fields it fills are `null` (see below). Ask again shortly |
| `refreshing` | A background refresh is in flight |

**While `pending` is true**, only the measured fields are unavailable:
`state`, `enabledOnBoot`, `restarts`, `crashLooping`, `runtime` and the
`warnings` derived from them. Everything a client needs to render the banner —
`running`, `installed`, `mechanism`, `mode`, `startsAt`, `stoppedByUser`,
`pid`, `version`, `heartbeatAgeMs` — comes from the cheap half and is always
real. A client should render immediately and re-fetch rather than block.

The cache is dropped, so the next read re-measures, when any of these happens:
one of the three lifecycle endpoints above, `ezz service install`,
`ezz service uninstall`, `ezz service repair`, a runtime update, and whenever
`service:changed` (§3.1) fires — which covers a change made by
`ezz service start` in another process. A TTL per probe is the
backstop for a change made outside Easy DevOps entirely, such as `sc stop`.

`ezz service status` in the terminal does **not** use the cache: someone typing
that command is asking because something changed, so it measures afresh — in
parallel, which took it from about 7.5 s to about 2 s.
#### `backgroundService` — the single authority

```json
{
  "running": true,
  "connected": true,
  "pid": 51404,
  "version": "2.0.0",
  "startedAt": 1794691485390,
  "heartbeatAgeMs": 1200,

  "jobsRunningHere": false,
  "jobsOwnerPid": 51404,
  "jobsOwnerRole": "daemon",

  "mechanism": "startup-supervisor",
  "mode": "personal",
  "installed": true,
  "startsAt": "logon",

  "stoppedByUser": false,
  "stoppedAt": null,

  "dataDir": "C:\\Users\\me\\AppData\\Roaming\\easy-devops",
  "serverMode": false,
  "detail": "pid alive, heartbeat fresh",

  "state": "installed (starts at logon)",
  "enabledOnBoot": true,
  "restarts": 0,
  "crashLooping": false,
  "warnings": [],
  "runtime": {
    "systemNode": { "path": "C:\\Program Files\\nodejs\\node.exe", "version": "v22.21.1", "abi": "127" },
    "pinned": { "kind": "recorded", "path": "…", "version": "v22.21.1", "exists": true, "broken": false },
    "manager": { "managed": false, "manager": null },
    "warnings": []
  }
}
```

| Field | Meaning |
|---|---|
| `running` | A daemon holds the lock, so monitoring survives closing the dashboard |
| `connected` | **This** dashboard has a live IPC event channel to it. Narrower than `running`: a daemon whose IPC failed to bind is still working |
| `installed` | A native install exists. **Not derivable from `running`** — a daemon started by hand runs without being installed, and a stopped service is installed without running |
| `mechanism` | `systemd` \| `winsw` \| `startup-supervisor` |
| `mode` | `personal` \| `server` \| `null` (Linux) |
| `startsAt` | `logon` (Windows Personal) or `boot` |
| `jobsRunningHere` | This process is the one running the jobs. Exactly one process does, enforced by a marker — see §3.5 |
| `stoppedByUser` | Stopped deliberately, not crashed. `stoppedAt` is an ISO timestamp when known |
| `warnings` | Human-readable problems from the service status: a crash loop, a broken runtime pin, ACL paths that changed |
| `runtime` | The service's pinned Node next to the system's, so a version-manager break is visible |

`enabledOnBoot` is `true`, `false`, or **`null` for unknown** (a non-systemd
Linux, where the boot hook cannot be read).

#### Lifecycle: start, stop and restart

No body. On success, `200`:

```json
{ "ok": true, "action": "start", "output": null, "backgroundService": { "…": "the new state" } }
```

Every response — success or failure — carries the resulting
`backgroundService`, so a client never has to follow up with `GET /api/service`.

`stop` is **temporary**: it records "stopped by you" and the service comes back
at the next logon or boot. `ezz service uninstall` is the permanent removal,
and is deliberately not exposed over HTTP. `restart` clears that marker.

Failures are machine-readable rather than opaque:

| Status | `error` | When | Also carries |
|---|---|---|---|
| `403` | `elevation_required` | Windows Server mode needs an Administrator context; systemd needs sudo | `command`, `shell` |
| `409` | `not_installed` | No native install to act on | `command` (`ezz service install`) |
| `409` | `already_running` | `start` with a daemon already up | — |
| `500` | `action_failed` | The mechanism refused for another reason | `message` |

```json
{
  "error": "elevation_required",
  "action": "stop",
  "message": "Stopping the Windows service needs an Administrator terminal.",
  "command": "ezz service stop",
  "shell": "Administrator PowerShell",
  "backgroundService": { "…": "unchanged" }
}
```

**The dashboard never elevates and never prompts for a password.** It cannot:
an Administrator context and a sudo prompt both need a terminal the user
controls. So the honest answer is the exact command and the shell to run it in.
In Windows **Personal** mode no elevation is involved at all — the daemon runs
as the same user as the dashboard — so start, stop and restart simply work.

**`GET /api/processes`** response `200`:
```json
{ "pm2": "…", "apps": [ /* see below */ ], "currentUser": "…", "pm2Home": "…", "hint": "…" }
```
`pm2Home` and `hint` are only present when there is something worth telling the
user (for example, PM2 is on a different `PM2_HOME` than expected). Each item of
`apps` is:
```json
{
  "name": "easy-devops",
  "pmId": 0,
  "pid": 12345,
  "status": "online",
  "cpu": 0,
  "memoryBytes": 52428800,
  "startedAt": 1731500000000,
  "uptimeMs": 3600000,
  "restarts": 0,
  "unstableRestarts": 0,
  "execPath": "/usr/bin/node",
  "cwd": "/opt/easy-devops",
  "user": "deploy",
  "managed": true,
  "dataDir": "/home/deploy/.config/easy-devops"
}
```

**`GET /api/processes/:name/logs`** response `200`:
```json
{ "name": "easy-devops", "lines": ["...", "..."] }
```
`lines` is an array of strings, one per log line. The `lines` query parameter
controls how many are returned: it is clamped to the range 1–5000 and defaults
to 200 —
`Math.max(1, Math.min(5000, Number(lines) || 200))` in `src/core/runner.js`.

`POST /api/processes/:name/:action` errors: `400` unknown action · `404` PM2 has
no such process · `409` PM2 not installed, or the process belongs to another OS
user (PM2 keeps one process list per user).

### 2.8 Deployments — `src/dashboard/routes/deployments.js` (mounted at `/api/deployments`)

Added in 2.4.0. Puts a project from a git repository on the server, builds it
there, runs it under PM2 and keeps earlier releases to roll back to. All of it
is `core/deploy/`; these routes are a thin layer over it.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/deployments` | session | Apps, hook status, requirements |
| POST | `/api/deployments` | session | Create an app |
| GET | `/api/deployments/hook` | session | Deploy-hook settings and status |
| PUT | `/api/deployments/hook` | session | Change the deploy-hook settings |
| GET | `/api/deployments/:id` | session | One app with its runs and releases |
| PUT | `/api/deployments/:id` | session | Update an app |
| DELETE | `/api/deployments/:id` | session | Stop the app, forget it, delete its files |
| PUT | `/api/deployments/:id/domain` | session | Link the app to a domain (created if it does not exist) |
| DELETE | `/api/deployments/:id/domain` | session | Forget the link; the domain is untouched |
| POST | `/api/deployments/:id/move` | session | Move the app's folder elsewhere on the server |
| POST | `/api/deployments/:id/deploy` | session | Start a deployment |
| POST | `/api/deployments/:id/rollback` | session | Switch back to an earlier release |
| GET | `/api/deployments/:id/runs/:runId` | session | One run, with the tail of its log |
| POST | `/api/deployments/:id/hook-token` | session | Issue (or replace) the app's deploy token |
| DELETE | `/api/deployments/:id/hook-token` | session | Revoke it |
| POST | `/api/deployments/:id/deploy-key` | session | Generate (or replace) the SSH deploy key |
| GET | `/api/deployments/:id/github` | session | Workflow file, secrets and URL for GitHub Actions |
| POST | `/api/deployments/:id/github/apply` | session | Do the GitHub steps through GitHub's API |

**The app object** (returned by create, update, `GET /:id`, and in `apps[]`):

```json
{
  "id": "my-api",
  "pm2Name": "ez-my-api",
  "repoUrl": "git@github.com:me/my-api.git",
  "branch": "main",
  "authType": "deployKey",
  "hasToken": false,
  "deployKey": "ssh-rsa AAAA… easy-devops-deploy-my-api",
  "settings": { "port": 3000, "healthPath": "/healthz" },
  "env": { "DATABASE_URL": "…" },
  "keepReleases": 5,
  "autoRollback": true,
  "notifyChannelIds": [],
  "hook": { "hasToken": true, "tokenHint": "x9Qz", "createdAt": "2026-11-15T…" },
  "createdAt": "…", "updatedAt": "…"
}
```

- `id` — 1–40 characters, lower-case letters, digits and dashes. It is the
  directory name, the URL segment and (prefixed with `ez-`) the PM2 name, and
  cannot be changed after creation.
- `authType` — `none` (public repository) | `deployKey` (SSH URL; generate the
  key with `deploy-key` and add its public half to the repository) | `token`
  (https URL; a personal access token sent as an HTTP header, never written
  into the checkout).
- The token itself is **never returned**; `hasToken` says whether one is
  stored. The private deploy key is never returned by any endpoint.
- `env` values **are** returned: this is where they are edited, behind the
  dashboard's own login. They are not included in anything sent to a Hub.
- `settings` are overrides. Any of `install`, `build`, `pre`, `post` (string,
  list of strings, or `false` to switch the step off), `start` (one command),
  `port`, `healthPath`, `healthTimeout` (seconds). Absent means "use ez.json,
  then package.json".

In `apps[]` and `GET /:id` each app additionally has `currentRelease`,
`previousRelease`, `deploying`, `activeRunId`, `lastRun` (a run object or
`null`) and `process` (`{ status, pid, cpu, memoryBytes, uptimeMs, restarts }`,
or `null` when PM2 is not running — the list never starts a PM2 daemon).
`GET /:id` adds `runs` (newest first, up to 20) and `releases`
(`[{ id, sha, ref, startable, current, previous }]`).

**`GET /api/deployments`** also returns `hook` (below), `requirements`
`{ git, gitVersion, pm2 }`, `limits`, `ezFileLocations`, `channels`
(`[{ id, name, type }]`) and `domains` (`[{ name, enabled, ssl }]`).

**`POST /api/deployments`** takes `{ id, repoUrl, branch?, authType?, token?,
settings?, env?, keepReleases?, autoRollback?, notifyChannelIds? }` → `201`
with the app. `400` `{ error, errors[] }` on invalid input, `409` when the id
is taken. `PUT /:id` takes any subset of the same fields except `id`.

**Folders (2.6.0).** Every app has `dir`, the folder it lives in
(`<dir>/releases`, `<dir>/logs`, …). It is recorded when the app is created —
`<deployDir>/<id>`, where `deployDir` is the setting in §2.5 (default
`<data dir>/ez_deploys`) — and **changing the setting never moves an existing
app**: each keeps the folder it was created in. An app created before 2.6.0
stays in `<data dir>/deploy/<id>`. `GET /api/deployments` returns `deployDir`,
where a new app would be created.

**`POST /:id/move`** takes `{ path }` — the **parent** folder; the app ends up
in `<path>/<id>`. In order: its PM2 process is stopped, the folder is moved
(a rename, or a copy when the destination is on another disk), the new
location is recorded, and the live release is started again. Response `200`
`{ from, to, restarted, warning }`; `restarted` is false when the app was not
running, and `warning` is set when it was running but could not be started
again. `400` for a path that is not absolute or contains characters a shell
would act on; `409` when the destination exists and is not empty, when the app
is already there, or while a deployment of it is running. If the move itself
fails nothing has changed and the process is started again where it was.

**Domains (2.6.0).** Every app has `domain`, the name of the domain linked to
it, or `null`. **`PUT /:id/domain`** takes `{ domain, ssl? }`. An existing
domain is re-pointed at the app's port; an unknown one is created. The app
needs a port — set on it, or taken from its live release — otherwise `409`.
Response `200` `{ domain, created, port, nginxReloaded, ssl }`, where `ssl` is
`null` unless `ssl: true` was sent, and then `{ ok, detail }`: a certificate
is requested over HTTP-01, and when that fails the link still stands over
HTTP and `detail` says why. The result is an ordinary domain: it appears in
`GET /api/domains` and is edited there. After every successful deployment a
linked domain is moved to the app's port if that changed.
**`DELETE /:id/domain`** forgets the link and leaves the domain as it is.

**`DELETE /:id`** accepts `?deleteDomain=1` to remove the linked domain as
well. Response `{ deleted, domainDeleted, warning }`; when the domain could
not be removed the app is deleted anyway and `warning` says so.

**The run object:**

```json
{
  "id": "20261115-214502-3fa9c1",
  "appId": "my-api",
  "trigger": "manual",
  "actor": "dashboard",
  "ref": "main",
  "sha": "9f2c…",
  "releaseId": "20261115-214502-3fa9c1",
  "status": "running",
  "step": "build",
  "startedAt": 1794000000000,
  "finishedAt": null,
  "error": null,
  "warnings": [],
  "rolledBackTo": null
}
```

- `trigger` — `manual` | `webhook` | `hub` | `rollback`.
- `status` — `running` | `success` | `failed` | `rolled_back`. `rolled_back`
  means the new release started but was not healthy, and the previous release
  is running again (`rolledBackTo` names it).
- `step` — `fetch` → `settings` → `pre` → `install` → `build` → `start` →
  `health` → `post` → `finish` → `done`. On a failure it stays at the step
  that failed.
- `GET /:id/runs/:runId` adds `log` (the last 64 kB of the run's output) and
  `logTruncated`. There is no socket event for deployments: a client polls
  this while `status` is `running`.

**`POST /:id/deploy`** takes `{ ref? }` (a branch, tag or commit; defaults to
the app's branch) → `202` `{ runId, status: "running" }`. `409`
`{ error, runId }` when a deployment of that app is already running.
**`POST /:id/rollback`** takes `{ releaseId? }` (defaults to the previous
release) → `202`, or `409` when there is nothing to roll back to. Neither
waits for the work to finish.

**`POST /:id/hook-token`** → `{ token, tokenHint }`. This is the **only**
response that contains the token: only its SHA-256 is stored. Issuing a new one
invalidates the old one.

**`GET /:id/github`** → `{ hookUrl, hookMode, hookSecure, hookNote, hasToken,
tokenHint, workflowPath, workflow, secrets: [{ name, value }], deployKey }`.
`secrets[].value` is `null` for the token (see above) and for the URL when the
hook is not reachable from outside.

Since 2.5.0 it also returns `targets`: the two ways GitHub can reach this
server, for the user to choose between. `hookUrl` above is still the direct
one.

```json
"targets": [
  { "id": "hook", "label": "This server’s deploy hook", "url": "https://example.com/.ez-deploy/my-api", "secure": true, "note": "…" },
  { "id": "hub",  "label": "Through the Hub", "url": "https://hub.example.com/api/v1/hooks/deploy/<serverId>/my-api", "secure": true, "note": "…", "ready": true }
]
```

The `hub` target has `url: null` on a server that is not paired, and
`ready: false` until the server grants `deploy.ci` (Settings → Hub). Both
targets accept the same request with the same deploy token — the Hub forwards
it over the agent connection and **the server** verifies the token — so the
workflow file is identical; only the value of `EZ_DEPLOY_URL` differs.

**`POST /:id/github/apply`** (2.5.0) takes `{ token?, target?: "hook" | "hub",
secrets?, workflow?, deployKey? }` — the three booleans default to `true`
(`deployKey` only applies to a deploy-key app). `token` is a GitHub token with
write access; when omitted, the app's own access token is tried. A token sent
here is used for this request and not stored.

It issues a **new** deploy token (the previous one stops working), stores
`EZ_DEPLOY_URL` and `EZ_DEPLOY_TOKEN` as encrypted repository secrets, commits
the workflow file to the app's branch and adds the deploy key read-only. The
deploy token is never returned. Response `200`:

```json
{
  "ok": false,
  "repo": "acme/my-api",
  "error": null,
  "target": "hook",
  "deployUrl": "https://example.com/.ez-deploy/my-api",
  "steps": [
    { "id": "secrets",   "ok": true,  "detail": "Stored EZ_DEPLOY_URL and EZ_DEPLOY_TOKEN." },
    { "id": "workflow",  "ok": false, "detail": "GitHub refused (403…). The token needs “Contents: read and write” and “Workflows: read and write” on this repository." },
    { "id": "deployKey", "ok": true,  "detail": "Added the deploy key, read-only." }
  ]
}
```

Each part is attempted independently, so `ok` is true only when every
requested step succeeded. `502` with `error` set when GitHub could not be
reached or the token cannot see the repository (no step was attempted).
`400` when the repository is not on github.com or no usable token is
available; `409` `{ error, reason: "no_deploy_url" | "no_deploy_key" }` when
there is nothing to put in the secret yet. If the secrets step fails, the
token issued for it is revoked rather than left unknown to everyone.

**The deploy hook settings** (`GET` / `PUT /api/deployments/hook`):

```json
{
  "enabled": true, "port": 6445, "bind": "127.0.0.1", "domain": "example.com",
  "listening": true, "path": "/.ez-deploy/",
  "urlExample": "https://example.com/.ez-deploy/your-app",
  "mode": "domain", "secure": true, "note": "Reached through example.com over HTTPS."
}
```

`PUT` takes any subset of `enabled`, `port`, `bind` (`127.0.0.1` | `0.0.0.0`)
and `domain` (a configured domain name, or `null`). Choosing a domain rewrites
that domain's nginx config to forward `/.ez-deploy/` to the listener and
reloads nginx; if nginx rejects the result the setting is not changed and the
answer is `500` `{ error, detail }`. The response adds `nginxReloaded` and
`appliesWithinSeconds` — the listener runs with the background jobs, usually
in another process, and re-reads the setting on a timer.

`mode` is `domain` (through nginx), `direct` (bound to every interface — plain
HTTP, `secure: false`) or `none` (not reachable from outside).

---

---

## 3. Socket.io events

One namespace (the default), on the dashboard's own port. The handshake runs the
same express-session middleware as HTTP, then the transport checks of §1, then
the session check.

**The browser client must not force `transports: ['websocket']`.** Browsers
cannot set headers on a WebSocket upgrade, so `X-EZ-Request` would never arrive.
socket.io's default order starts with HTTP polling, where `extraHeaders` does
apply, and the handshake is authenticated there before any upgrade.

### 3.1 Server → client

The payloads below are unchanged by the daemon work. The "Produced by" column
now names where each event is **decided**, which is no longer the socket layer:
`core/jobs/` publishes to the in-process bus (`core/jobs/bus.js`) using these
exact names, and `socketManager.js` forwards each one to connected browsers
without touching it. When a daemon owns the jobs, the events cross from that
process over local IPC and `dashboard/lib/daemonBridge.js` republishes them
onto the same bus — so the browser cannot tell which process produced them,
and there is only one schema.

| Event | Payload | Produced by | Runs in the daemon? |
|---|---|---|---|
| `nginx:status` | `{ running, version, pid }` or `{ …, error }` | `core/jobs/monitors.js` — every 5s | **Yes** |
| `domain:health` | `[{ name, up, port, host }]`, `up: null` for external backends | `core/jobs/monitors.js` — every 60s | **Yes** |
| `notification:new` | `{ id, type, subtype?, severity, message, domain?, timestamp }` | `core/jobs/monitors.js` via `core/notifications/dispatch.js` — on nginx and domain-health transitions, on certificate expiry, and after each automatic renewal attempt (`type: "cert_expiry"`, `subtype: "renewed"` or `"renew_failed"`) | **Yes** |
| `logs:line` | `{ line, logFile }` | `socketManager.js` — per line while a tail is active | **No** — a tail exists only for a watching client |
| `local:changed` | `{ section, source, at, …detail }`, `section` ∈ `domains`, `ssl`, `nginx`, `settings` | `core/hub/agent.js` after it applies a Hub command (`source: "hub"`), and `core/jobs/revisionWatcher.js` when another process moves the change counter (`source: "revision"`) | **Yes** |
| `service:changed` | the `backgroundService` object from §2.7, identically shaped | `dashboard/lib/daemonBridge.js` — whenever the background service or the jobs owner changes | **No** — it describes the service *as this dashboard sees it* |

**Replay on connect.** `nginx:status`, `domain:health` and `service:changed`
are state, so the server remembers the last payload of each and sends it to a
socket as soon as it connects. Without that, a tab opened just after a poll
would render empty until the next one — up to 60 seconds for domain health, and
for `service:changed` until the next hand-over, which may never come.
`notification:new` and `local:changed` are deliberately NOT replayed: they are
discrete events, and replaying them would announce outages that are already
over, or a change that was handled, to every new tab.

**`service:changed`** fires when any of this changes: a daemon started or
stopped, it was stopped by the user, the jobs moved between the daemon and this
dashboard, or the event channel connected or dropped. It is published only on a
real change — the dashboard watches the lock file, so an ordinary restart would
otherwise emit several times in a second. Its payload is byte-identical to
`backgroundService` in §2.7, so a client has one shape to render and can treat
`GET /api/service` as the initial fetch and this event as the live update.

### 3.2 Client → server

| Event | Payload | Handled by | Runs in the daemon? |
|---|---|---|---|
| `logs:subscribe` | `{ logFile: "error" \| "access" }` | `socketManager.js` — starts a `tail`/`Get-Content` child, replacing any existing tail for that socket | **No** — per-client, dies with the socket |
| `logs:unsubscribe` | none | `socketManager.js` — stops that tail | **No** |
| `disconnect` | — | `socketManager.js` — stops the tail, decrements the client count | **No** |

On **every** `logs:subscribe`, the server first replays the last 50 lines of
that log (`Get-Content -Tail 50 -Wait` on Windows, `tail -n 50 -f` on Linux),
then streams new lines as `logs:line` events as before. A client that keeps
its own buffer must clear it before each subscribe — otherwise a reconnect
re-appends the same 50 lines onto what it already had. This is called out
because that duplication bug has already been hit once.

### 3.3 When the background daemon is split out

Today the dashboard process is both the UI server and the monitor: it polls
nginx, checks domain health, watches certificate expiry, dispatches
notifications and hosts the hub agent. Those continue only while the dashboard
runs, which is why the PM2 service exists.

Everything marked **Yes** above belongs to the daemon, because it must keep
working with no browser open. The split should keep the event names and payloads
identical and have the dashboard relay them, so this contract does not change
for clients. Everything marked **No** is inherently per-client and stays with
whatever process is serving that socket.

### 3.4 Commands the Hub sends to the agent

A separate surface from everything above: these arrive on the agent's **outbound**
socket to the Hub (`core/hub/agent.js`), not on the dashboard's socket, and no
browser can send them. They are listed here because the agent's handling of
them — and especially its permission checks — is part of what this project
promises.

Every command carries a `requestId` and is answered exactly once with
`command:result { requestId, ok, error, data }`. Every one is checked against
the local permission catalog by `checkCommandAllowed()` before it runs; the
agent is the authoritative gate, and the Hub's own check only exists so it can
answer 403 instead of reporting a dropped command as dispatched.

| Command | Payload | Permission |
|---|---|---|
| `hub:reloadNginx` | — | `nginx.reload` |
| `hub:nginxAction` | `{ action: start \| stop \| restart \| reload \| test }` | `nginx.<action>` |
| `hub:manageDomain` | `{ action: create \| update \| toggle \| delete \| reload, … }` | `domains.<action>` (`reload` → `nginx.reload`) |
| `hub:manageSSL` | `{ action: renew \| renewAll \| issue \| delete, … }` | `ssl.<action>` |
| `hub:getConfigs` | `{ filename? }` | `nginx.config.view` |
| `hub:saveConfig` | `{ filename, content, reload? }` | `nginx.config.edit` |
| `hub:getLogs` | `{ lines? }` | `nginx.logs.view` |

**`hub:saveConfig`** writes the file inside the nginx config directory, runs
`nginx -t`, and **restores the previous bytes when the test fails** (a new file
is deleted instead), so a rejected config never takes effect.

Its optional `reload: true` is gated **separately**, on `nginx.reload`, because
saving a file that passes `nginx -t` and affecting live traffic are different
things to be trusted with:

- granted → nginx is reloaded after the successful test
- not granted → the file is still saved and tested, **not** reloaded, and the
  result says why. The Hub does not refuse the command: the save itself is
  permitted, and a server that allows editing but not reloading has said
  something specific that a flag must not override.
- only a real boolean `true` asks for a reload — `"true"`, `1` and anything
  else are ignored, since a reload affects live traffic and must never happen
  through a loose coercion.

`data` on success:

```json
{
  "filename": "site.conf",
  "output": "nginx: configuration file … test is successful",
  "reloadRequested": true,
  "reloaded": false,
  "reloadDetail": "Permission 'nginx.reload' is disabled on this server."
}
```

A reload that is attempted and fails does not undo the save — the file has
already passed `nginx -t`, so `reloaded` is `false` and `reloadDetail` explains
that the config is saved and valid but the reload did not succeed.

---

## 4. Non-API routes

Everything outside `/api` (and `/socket.io`) is public by design: a shell has
to load before a session can exist. It contains no privileged data — it calls
`GET /api/auth` and then renders the login, first-run or dashboard view.

Two UI builds can be served at `/`. **The classic EJS page is the default;**
the React build is selected only when asked for.

| Path | Auth | Serves |
|---|---|---|
| `/js/*`, `/css/*`, `/img/*` | public | Classic static assets (`src/dashboard/public`, directory indexes disabled) |
| `/assets/*` | public | New UI's built assets from `dist/ui`, cached as immutable |
| `GET /` and any other GET/HEAD path | public | The active UI's `index.html` |

**Choosing the UI.** The `dashboardUi` setting (§2.5) selects `classic` or
`new`, which is what a background service reads on each boot. The
`--new-ui` CLI flag selects `new` for that run and **wins over the setting**.
The setting takes effect on restart; the flag does not need one.

**New UI serving.** When the new UI is active, `GET /` and any other GET or
HEAD path that is not a static file or a registered API route return
`dist/ui/index.html` with `Cache-Control: no-cache` — the SPA fallback. Built
assets are served from `dist/ui` and cached as immutable. `/api` and
`/socket.io` are mounted exactly as before and are unaffected; every API
endpoint keeps the auth and transport rules of §1. Socket.io clients are
unaffected.

**Missing build.** If the new UI is requested but `dist/ui/index.html` does
not exist, the server prints the expected path and `npm run build:ui`, and
serves the classic UI for that run instead of failing to start.

---

## 5. The deploy hook listener (not part of the dashboard)

Added in 2.4.0. `core/deploy/hookServer.js` — a separate HTTP listener that a
CI job calls. It is **off by default**, runs with the background jobs (so it is
there when the dashboard is not), and none of the dashboard's rules in §1
apply to it: there is no session, no `X-EZ-Request` header and no cookie. It
authenticates each request with the app's deploy token instead.

It answers three requests and nothing else. (They are listed as prose, not as a
table, on purpose: the route check in `e2e/run.mjs` reads this document's
tables as dashboard routes, and these are not.)

- **Start a deployment** — a `POST` to the path `/.ez-deploy/<app>`, with the
  header `Authorization: Bearer <deploy token>`.
- **Read a run's status** — a `GET` of `/.ez-deploy/<app>/runs/<runId>`, with
  the same header.
- **Liveness** — a `GET` of `/.ez-deploy/health`, no token: `{ "ok": true }`.
  It says nothing about apps.

Details:

- The start request's body is optional JSON `{ "ref": "<commit, tag or branch>" }` (16 kB
  limit). `202` `{ runId, status: "running", statusPath }`; `409`
  `{ error, runId }` when that app is already deploying.
- The status answer is `{ runId, status, step, sha, error, rolledBackTo,
  startedAt, finishedAt }`. No log: the log can contain build output and stays
  behind the dashboard login.
- `401` `{ "error": "Unauthorized" }` for a wrong token, an app with no token
  and an app that does not exist — deliberately indistinguishable.
- `429` after 10 failed attempts from one client in 15 minutes.
- A token can only start a deployment of **its** app from that app's configured
  repository. It cannot choose the repository, the commands or the
  environment.

---

## 6. Deployments through the Hub (agent events and commands)

Added in 2.5.0. What `core/hub/agent.js` exchanges with the Hub about
deployments. The local permission check in `core/hubPermissions.js` is the
gate for every command; the Hub's own copy is a UI hint.

**Telemetry the agent sends** — `deploy:apps`: the array `GET /api/deployments`
returns in `apps`, with one difference that matters. Each app is the *public*
view: `envKeys` (sorted variable names) instead of `env`, and no credentials.
Sent on connect, every 20 seconds, and when a deployment started through the
agent begins or ends. Not gated: a paired server is a monitored server.

**The command `hub:manageDeploy`** — payload `{ action, id?, … }`, answered
with `command:result` like every other command.

- `list` → `{ apps }` · `detail` (`id`) → the app with `runs` and `releases` ·
  `github` (`id`) → the setup of §2.8, with the public app view. No permission.
- `deploy` (`id`, `ref?`) → `{ runId, status: "running" }`. Needs `deploy.run`.
- `rollback` (`id`, `releaseId?`) → `{ runId, status }`. Needs `deploy.rollback`.
- `run` (`id`, `runId`) → the run with `log` (last 32 kB) and `logTruncated`.
  Needs `deploy.logs`.
- `linkDomain` (`id`, `domain`) · `unlinkDomain` (`id`) · `move` (`id`, `path`)
  (2.6.0). Need `deploy.manage`. `linkDomain` additionally needs
  `domains.create` or `domains.edit`, and never requests a certificate;
  `delete` with `deleteDomain: true` additionally needs `domains.delete`.
- `create` (`app`) · `update` (`id`, `app`) · `delete` (`id`) · `issueToken`
  (`id`) → `{ token, tokenHint }`. Need `deploy.manage`. `app` takes the fields
  of `POST /api/deployments` **except `env`**, which is ignored here.
- `getEnv` (`id`) → `{ env }` · `setEnv` (`id`, `env`) → `{ envKeys }`. Need
  `deploy.env`. This is the only path on which environment values leave the
  server, and only to the person who asked; the Hub does not store them.

**The command `hub:deployHook`** — sent only by the Hub's CI endpoint (on the
Hub, the path `/api/v1/hooks/deploy/<serverId>/<appId>`, called with POST),
never by a Hub user. Needs `deploy.ci`. Payload `{ action: "trigger" | "status", appId,
token, ref?, runId? }`, where `token` is whatever the CI job presented. **The
server verifies it** against the app's own deploy token, exactly as §5 does;
the Hub stores no token and cannot mint one.

- An unknown app, an app without a token and a wrong token all answer
  `{ unauthorized: true }` and nothing else.
- `trigger` → `{ started: true, runId }`, or
  `{ started: false, status: 409, error, runId }` when the app is already
  deploying.
- `status` → `{ found: true, run: { runId, status, step, sha, error,
  rolledBackTo, startedAt, finishedAt } }`, or `{ found: false }`.

The Hub's endpoint answers a CI job in the same shape as §5, so one workflow
file works against either; only the `EZ_DEPLOY_URL` secret differs.
