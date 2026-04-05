"use client";

import { useState, useEffect } from "react";
import { Code, Terminal, Download, FolderOpen } from "lucide-react";
import CodeBlock from "./CodeBlock";

const tabs = [
  { id: "quick", label: "Quick Install", icon: Code },
  { id: "linux", label: "Linux / macOS", icon: Terminal },
  { id: "windows", label: "Windows", icon: Download },
  { id: "source", label: "From Source", icon: FolderOpen },
];

export default function InstallTabs() {
  // Auto-detect OS
  const [active, setActive] = useState("quick");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent || "";
    setActive(/Windows/.test(ua) ? "windows" : "linux");
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-1 bg-surface border border-border rounded-t-xl p-1.5 pt-0 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-150 whitespace-nowrap ${
                (mounted ? active : "quick") === tab.id
                  ? "text-primary border-b-2 border-primary bg-primary/[0.04]"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="border border-t-0 border-border rounded-b-xl bg-surface p-6">
        {/* Quick */}
        {active === "quick" && (
          <div>
            <p className="text-sm text-muted mb-4">If you already have Node.js 18+, one command is all it takes:</p>
            <CodeBlock lang="bash" filename="terminal">npm install -g easy-devops && easy-devops</CodeBlock>
            <p className="text-sm text-muted">No Node.js? See the bootstrap installers below for a one-line auto-install.</p>
          </div>
        )}

        {/* Linux / macOS */}
        {active === "linux" && (
          <div className="space-y-6">
            <InstallStep number={1} title="Run the bootstrap installer" desc="Downloads Node.js LTS via nvm, installs Easy DevOps, and launches the CLI.">
              <CodeBlock lang="bash" filename="bash">curl -fsSL https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/install.sh -o install.sh && bash install.sh</CodeBlock>
              <p className="text-xs text-muted mb-3 mt-2">Or with wget:</p>
              <CodeBlock lang="bash" filename="bash">wget -qO install.sh https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/install.sh && bash install.sh</CodeBlock>
            </InstallStep>
            <InstallStep number={2} title="Follow the interactive prompts" desc="The installer will offer to install or upgrade Node.js. Choose your version or keep the current one." />
            <p className="text-sm text-muted"><strong>Installer flags:</strong> <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">--version X</code> to skip the picker, <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">--keep-node</code> to skip Node.js management.</p>
          </div>
        )}

        {/* Windows */}
        {active === "windows" && (
          <div className="space-y-6">
            <div className="bg-red-500/8 border border-red-500/20 rounded-lg p-4 text-sm text-red-500 dark:bg-red-500/8 dark:border-red-500/20">
              ⚠️ <strong>Run PowerShell as Administrator.</strong> Right-click PowerShell → "Run as Administrator".
            </div>
            <InstallStep number={1} title="Run the bootstrap installer" desc="Downloads nvm-windows, installs Node.js LTS, and registers Easy DevOps globally.">
              <CodeBlock lang="powershell" filename="PowerShell">Invoke-WebRequest -Uri "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/install.ps1" -OutFile "install.ps1"; ./install.ps1</CodeBlock>
            </InstallStep>
            <InstallStep number={2} title="From Command Prompt" >
              <CodeBlock lang="bat" filename="CMD">powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/install.ps1' -OutFile 'install.ps1'; ./install.ps1"</CodeBlock>
            </InstallStep>
          </div>
        )}

        {/* Source */}
        {active === "source" && (
          <div className="space-y-6">
            <InstallStep number={1} title="Clone the repository">
              <CodeBlock lang="bash" filename="bash">git clone https://github.com/omar00050/Easy-DevOps.git
cd Easy-DevOps</CodeBlock>
            </InstallStep>
            <InstallStep number={2} title="Install dependencies and run">
              <CodeBlock lang="bash" filename="bash">npm install
npm start      # CLI
npm run dashboard  # Web Dashboard</CodeBlock>
            </InstallStep>
          </div>
        )}
      </div>
    </div>
  );
}

function InstallStep({ number, title, desc, children }: {
  number: number;
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="text-[15px] font-semibold text-foreground mb-1">{title}</h4>
        {desc && <p className="text-sm text-muted mb-3">{desc}</p>}
        {children}
      </div>
    </div>
  );
}
