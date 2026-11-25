import dns from "node:dns";
import http from "node:http";
import http2 from "node:http2";
import https from "node:https";
import net from "node:net";
import { syncBuiltinESMExports } from "node:module";
import tls from "node:tls";

const LOOPBACK_HOSTS = new Set(["localhost", "localhost.", "::1"]);

function block(kind, target) {
  const destination = target ? ` to ${target}` : "";
  throw new Error(`Offline docs build blocked ${kind}${destination}`);
}

function hostnameOnly(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return "localhost";
  if (text.startsWith("[")) return text.slice(1, text.indexOf("]"));

  const ipVersion = net.isIP(text);
  if (ipVersion) return text;

  const separator = text.lastIndexOf(":");
  return separator > 0 ? text.slice(0, separator) : text;
}

function isLoopback(hostname) {
  const host = hostnameOnly(hostname);
  return LOOPBACK_HOSTS.has(host)
    || host.endsWith(".localhost")
    || (net.isIP(host) === 4 && host.startsWith("127."));
}

function assertDestination(kind, { hostname, host, socketPath } = {}) {
  if (socketPath) return;
  const target = hostname ?? host ?? "localhost";
  if (!isLoopback(target)) block(kind, target);
}

function requestTarget(input, options) {
  const opts = options && typeof options === "object" ? options : {};
  if (opts.socketPath) return { socketPath: opts.socketPath };
  if (opts.hostname || opts.host) {
    return { hostname: opts.hostname, host: opts.host };
  }

  if (input instanceof URL || typeof input === "string") {
    try {
      return { hostname: new URL(String(input)).hostname };
    } catch {
      // A path-only request still uses the local default host.
    }
  } else if (input && typeof input === "object" && input.socketPath) {
    return { socketPath: input.socketPath };
  }
  return { hostname: "localhost" };
}

function guardHttpRequest(original, kind) {
  return function guardedHttpRequest(input, options) {
    assertDestination(kind, requestTarget(input, options));
    return Reflect.apply(original, this, arguments);
  };
}

function guardDns(original, kind) {
  return function guardedDns(hostname) {
    if (!isLoopback(hostname)) block(kind, hostname);
    return Reflect.apply(original, this, arguments);
  };
}

function guardNetConnect(original, kind) {
  return function guardedConnect(...args) {
    const first = args[0];
    if (first && typeof first === "object") {
      assertDestination(kind, first);
    } else if (typeof first === "number") {
      assertDestination(kind, { host: args[1] });
    }
    return Reflect.apply(original, this, args);
  };
}

function guardHttp2Connect(original) {
  return function guardedHttp2Connect(input, options) {
    assertDestination("HTTP/2 connection", requestTarget(input, options));
    return Reflect.apply(original, this, arguments);
  };
}

function guardSocketConnect(original, kind) {
  return function guardedSocketConnect(...args) {
    const first = args[0];
    if (first && typeof first === "object") {
      assertDestination(kind, first);
    } else if (typeof first === "number") {
      assertDestination(kind, { host: args[1] });
    }
    return Reflect.apply(original, this, args);
  };
}

globalThis.fetch = async function offlineFetch(input) {
  const target = typeof input === "string" || input instanceof URL
    ? String(input)
    : input?.url;
  block("fetch", target);
};

http.request = guardHttpRequest(http.request, "HTTP request");
http.get = guardHttpRequest(http.get, "HTTP request");
https.request = guardHttpRequest(https.request, "HTTPS request");
https.get = guardHttpRequest(https.get, "HTTPS request");
http2.connect = guardHttp2Connect(http2.connect);
net.connect = guardNetConnect(net.connect, "TCP connection");
net.createConnection = guardNetConnect(net.createConnection, "TCP connection");
net.Socket.prototype.connect = guardSocketConnect(net.Socket.prototype.connect, "TCP connection");
tls.connect = guardNetConnect(tls.connect, "TLS connection");

for (const name of ["lookup", "resolve", "resolve4", "resolve6", "resolveAny"]) {
  dns[name] = guardDns(dns[name], `DNS ${name}`);
  dns.promises[name] = guardDns(dns.promises[name], `DNS ${name}`);
}

for (const name of ["WebSocket", "EventSource"]) {
  if (name in globalThis) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value: class BlockedNetworkClient {
        constructor(url) {
          block(name, url);
        }
      },
    });
  }
}

syncBuiltinESMExports();
