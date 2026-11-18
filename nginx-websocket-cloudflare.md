# nginx: WebSocket proxying and Cloudflare real IP

This page covers two related additions to the generated domain configs.

## WebSocket-ready proxying (every domain)

Every proxied domain now carries:

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $ezz_connection_upgrade;
```

`$ezz_connection_upgrade` comes from one shared map file in `conf.d`:

```nginx
map $http_upgrade $ezz_connection_upgrade {
    default upgrade;
    ''      '';
}
```

The map may only exist in the `http` context, and defining it twice fails
`nginx -t`. Easy DevOps writes it once to `00-easy-devops-websocket.conf` in the
platform's `conf.d` (`<nginx>/conf/conf.d` on Windows, `<nginx>/conf.d` on
Linux), which is already included at `http` level. No domain config defines it,
so adding a hundred domains still produces exactly one map.

`'' ''` (rather than `'' close`) is intentional: an ordinary request has no
`Upgrade` header, nginx sends no `Connection` header at all, and upstream
keep-alive is preserved. A real WebSocket request gets `upgrade` via the
`default` line.

The `/socket.io/` location additionally disables buffering and allows an hour
of idle time:

```nginx
location ^~ /socket.io/ {
    proxy_buffering off;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

Ordinary HTTP keeps the domain's configured `readTimeout` (60s by default).

## Domains behind Cloudflare (`behindCloudflare`)

Set `behindCloudflare: true` on a domain when Cloudflare proxies its traffic.
The config then trusts the client IP Cloudflare supplies:

```nginx
set_real_ip_from <every published Cloudflare IPv4 and IPv6 range>;
real_ip_header CF-Connecting-IP;
```

The ranges live in `src/core/cloudflare-ips.js`. Refresh them with:

```bash
node scripts/refresh-cloudflare-ips.mjs
```

That script fetches <https://www.cloudflare.com/ips-v4> and
<https://www.cloudflare.com/ips-v6>, validates every entry as a CIDR, and
rewrites the list (it is never run by the test suite). The default is `false`,
and domains saved before this field existed keep generating the same config
apart from the WebSocket headers above.

### What this does and does not do

- **The application behind nginx must trust exactly one proxy.** For the Hub,
  set `TRUST_PROXY=1`. Do not trust a longer chain: `set_real_ip_from` makes
  nginx rewrite `$remote_addr`, but the app still has to read the forwarded
  headers correctly.
- **`set_real_ip_from` alone does not block direct origin access.** It only
  tells nginx whose `CF-Connecting-IP` to believe; anyone who knows the origin
  IP can still connect to ports 80/443 and send their own header.
- **Close that hole at the firewall:** restrict inbound ports 80 and 443 to
  Cloudflare's published ranges only (the same lists in
  `src/core/cloudflare-ips.js`). Then the only traffic nginx sees came through
  Cloudflare, and the real-IP configuration is meaningful.
