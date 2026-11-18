"use client";

import Reveal from "./Reveal";

interface Step {
  num: string;
  title: string;
  tag?: string;
  desc: string;
  cmd?: string;
  plain?: boolean;
  branches?: string[];
}

const steps: Step[] = [
  {
    num: "00",
    title: "Install Easy DevOps",
    tag: "2 min",
    desc: "Install globally, or use the one-line installer for your platform. Node.js 18+ is the requirement; nginx can be installed by the tool.",
    cmd: "npm install -g easy-devops",
  },
  {
    num: "01",
    title: "Open the dashboard for the first time",
    tag: "first run",
    desc: "There is no default password. A fresh dashboard shows a setup screen: it asks for a one-time setup code, then your new password — or you choose no-password mode, offered only when it listens on this machine. The code appears in this terminal or the service log; ezz dashboard setup-code prints a fresh one.",
    cmd: "ezz --dash",
  },
  {
    num: "02",
    title: "Point it at your stack",
    desc: "Settings → nginxDir, sslDir and the ACME email. These decide where configs and certificates are read from and written to.",
    cmd: "Settings → paths",
    plain: true,
  },
  {
    num: "03",
    title: "Put a site online",
    tag: "domain + SSL",
    desc: "Add a domain, choose the upstream host:port, and turn SSL on. If a certificate for that name already exists on disk, the dashboard offers to reuse it.",
    branches: [
      "Existing certificate → one click fills both file paths.",
      "No certificate → issue one with HTTP-01, or DNS-01 for wildcards.",
    ],
  },
  {
    num: "04",
    title: "Deploy your app",
    tag: "from Git",
    desc: "Connect a repository: every deploy builds a fresh release, health-checks it, then switches PM2. Rollback returns to an earlier release.",
    cmd: "Deployments → Add app",
    plain: true,
    branches: [
      "App writes files at runtime? List those folders under Persistent data — they survive every deploy and rollback.",
      "Already building in CI? Skip install or build per app.",
    ],
  },
  {
    num: "05",
    title: "Keep it running",
    tag: "background",
    desc: "Install the native background service so monitoring, certificate renewal and notifications survive logout. The dashboard stays the interface only.",
    cmd: "ezz service install",
  },
  {
    num: "06",
    title: "Stay informed",
    tag: "notifications",
    desc: "Add a Discord or Telegram channel, choose which events are sent, and send a test message from the dashboard.",
    cmd: "Notifications → Add channel",
    plain: true,
  },
  {
    num: "07",
    title: "More than one server?",
    tag: "Hub",
    desc: "Pair each server with the Hub using the connection string the Hub issues (ezops://hubUrl|serverId|secret), then grant only the permissions you want through the permission tree.",
    cmd: "Settings → Hub → Pair",
    plain: true,
  },
  {
    num: "08",
    title: "Keep it current",
    tag: "maintenance",
    desc: "Check for updates, read live logs, and clean up old runtime files — from the CLI or the dashboard.",
    cmd: "ezz update",
  },
];

export default function InstallJourney() {
  return (
    <Reveal>
      <figure className="d-figure">
        <div className="d-figure-head">
          <div>
            <div className="d-eyebrow">User journey</div>
            <div className="d-figure-title">From install to a running fleet</div>
          </div>
          <div className="d-chips" aria-hidden="true">
            <span className="d-chip">9 steps</span>
            <span className="d-chip">Linux · Windows</span>
            <span className="d-chip">CLI or dashboard</span>
          </div>
        </div>

        <div className="d-body">
          <ol className="d-steps">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li key={step.num} className="d-step d-anim">
                  <div className="d-step-rail" aria-hidden="true">
                    <span className={`d-step-dot ${index === 0 ? "is-start" : ""}`}>{step.num}</span>
                    {!isLast && <span className="d-step-line" />}
                  </div>
                  <div className="d-step-body">
                    <div className="d-step-card">
                      <div className="d-step-head">
                        <h3 className="d-step-title">{step.title}</h3>
                        {step.tag && <span className="d-tag">{step.tag}</span>}
                      </div>
                      <p className="d-step-desc">{step.desc}</p>
                      {step.cmd && (
                        <code className={`d-cmd ${step.plain ? "d-cmd--plain" : ""}`}>{step.cmd}</code>
                      )}
                      {step.branches && (
                        <ul className="d-branches">
                          {step.branches.map((branch) => (
                            <li key={branch}>{branch}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <figcaption className="d-caption">
          The same path works from the CLI or the dashboard. After the service is installed, steps 3–6 can be
          done in any order — and a paired server shows all of it in the Hub.
        </figcaption>
      </figure>
    </Reveal>
  );
}
