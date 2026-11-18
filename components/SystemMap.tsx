"use client";

import {
  Activity,
  Bell,
  Boxes,
  Cloud,
  Cpu,
  Database,
  FileCode2,
  FolderTree,
  GitBranch,
  Globe,
  Globe2,
  KeyRound,
  Layers,
  LayoutDashboard,
  Plug,
  RefreshCw,
  Server,
  Settings,
  ShieldCheck,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

interface DiagramNode {
  icon: LucideIcon;
  title: string;
  sub: string;
  meta?: string;
}

const surfaces: DiagramNode[] = [
  { icon: Terminal, title: "CLI", sub: "Interactive menus and scriptable commands.", meta: "ezz" },
  { icon: LayoutDashboard, title: "Web dashboard", sub: "Domains, SSL, deployments, logs, settings.", meta: "localhost:6443" },
  { icon: Globe2, title: "Hub", sub: "Every paired server in one browser tab.", meta: "ez.hub.devxor.team" },
];

const control: DiagramNode[] = [
  { icon: Server, title: "Dashboard server", sub: "Express 5 API · Socket.io · session auth.", meta: "same host" },
  { icon: Cloud, title: "Hub backend", sub: "Accounts · fleet registry · audit · permissions.", meta: "your Hub" },
];

const capabilities: DiagramNode[] = [
  { icon: Globe, title: "Domains & nginx", sub: "Configs · reload · config test" },
  { icon: ShieldCheck, title: "SSL", sub: "ACME · HTTP-01 · DNS-01" },
  { icon: GitBranch, title: "Deployments", sub: "Releases · rollback · shared data" },
  { icon: Boxes, title: "Processes", sub: "PM2 apps and modules" },
  { icon: Bell, title: "Notifications", sub: "Discord · Telegram · events" },
  { icon: Cpu, title: "Background service", sub: "systemd · WinSW · supervisor" },
  { icon: Settings, title: "Settings & access", sub: "Paths · password · permissions" },
  { icon: RefreshCw, title: "Updates & cleanup", sub: "npm · logs · disk" },
];

const resources: DiagramNode[] = [
  { icon: FileCode2, title: "nginx", sub: "binary · conf.d" },
  { icon: KeyRound, title: "Certificates", sub: "sslDir" },
  { icon: Activity, title: "PM2", sub: "app processes" },
  { icon: FolderTree, title: "App files", sub: "releases · shared" },
  { icon: Database, title: "State", sub: "SQLite · settings" },
];

function NodeCard({ node }: { node: DiagramNode }) {
  const Icon = node.icon;
  return (
    <div className="d-anim">
      <div className="d-card">
        <div className="d-card-top">
          <Icon className="d-icon" aria-hidden="true" />
          <span className="d-card-title">{node.title}</span>
          {node.meta && <span className="d-meta">{node.meta}</span>}
        </div>
        <p className="d-card-sub">{node.sub}</p>
      </div>
    </div>
  );
}

function Layer({
  num,
  label,
  hint,
  children,
}: {
  num: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="d-layer">
      <div className="d-layer-head">
        <span className="d-num">{num}</span>
        <span className="d-label">{label}</span>
        {hint && <span className="d-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Link({ label }: { label: string }) {
  return (
    <div className="d-link" aria-hidden="true">
      <span className="d-link-label">{label}</span>
    </div>
  );
}

export default function SystemMap() {
  return (
    <Reveal>
      <figure className="d-figure">
        <div className="d-figure-head">
          <div>
            <div className="d-eyebrow">System map</div>
            <div className="d-figure-title">Three surfaces, one engine</div>
          </div>
          <div className="d-chips" aria-hidden="true">
            <span className="d-chip">one package</span>
            <span className="d-chip">Linux · Windows</span>
            <span className="d-chip">no Docker</span>
          </div>
        </div>

        <div className="d-body">
          <Layer num="01" label="Where you work" hint="pick the surface that fits">
            <div className="d-grid d-grid-3">
              {surfaces.map((node) => (
                <NodeCard key={node.title} node={node} />
              ))}
            </div>
          </Layer>

          <Link label="commands · live events" />

          <Layer num="02" label="Control plane" hint="API, sockets, accounts">
            <div className="d-grid d-grid-2">
              {control.map((node) => (
                <NodeCard key={node.title} node={node} />
              ))}
            </div>
          </Layer>

          <Link label="actions · wss to the agent" />

          <Layer num="03" label="Core engine" hint="one codebase, shared by every surface">
            <div className="d-core d-anim">
              <div className="d-core-head">
                <Layers className="d-icon" aria-hidden="true" />
                <span className="d-core-title">Easy DevOps core</span>
                <span className="d-core-meta">runs in the dashboard or the background service</span>
              </div>
              <div className="d-core-grid">
                {capabilities.map((node) => (
                  <NodeCard key={node.title} node={node} />
                ))}
              </div>
              <div className="d-core-foot">
                <Plug className="d-icon" aria-hidden="true" />
                <span>
                  <strong>Hub agent</strong> — keeps the wss link to the Hub and runs only the actions you grant
                  per server.
                </span>
              </div>
            </div>
          </Layer>

          <Link label="reads · writes · reloads" />

          <Layer num="04" label="On the box" hint="what actually changes">
            <div className="d-grid d-grid-5">
              {resources.map((node) => (
                <NodeCard key={node.title} node={node} />
              ))}
            </div>
          </Layer>
        </div>

        <figcaption className="d-caption">
          Interfaces call the control plane; the core engine reads and writes your server. The dashboard is
          the interface — the background service keeps monitoring and notifications alive when it closes.
        </figcaption>
      </figure>
    </Reveal>
  );
}
