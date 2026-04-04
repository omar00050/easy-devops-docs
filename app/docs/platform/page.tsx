import type { Metadata } from "next";
import DocsPagination from "@/components/DocsPagination";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Support",
  description:
    "Easy DevOps supports both Linux and Windows servers with full feature parity. See platform-specific details for Nginx, SSL, and Node.js management.",
  keywords: ["DevOps Linux Windows", "cross-platform DevOps", "Nginx on Windows", "SSL on Linux", "DevOps compatibility"],
  alternates: { canonical: "/docs/platform" },
};

const features = [
  "CLI Interface",
  "Web Dashboard",
  "Nginx Management",
  "SSL — HTTP-01 (acme-client)",
  "SSL — DNS-01 (acme-client)",
  "Wildcard Certificates",
  "Node.js Management",
  "Nginx service control",
];

const linuxDetails = ["✅", "✅", "✅", "✅", "✅", "✅", "✅ nvm", "systemctl"];
const winDetails = ["✅", "✅", "✅", "✅", "✅", "✅", "✅ nvm-windows", "nginx.exe direct"];

export default function PlatformPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Reference</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Platform Support</h1>
      <p className="text-muted text-base leading-relaxed mb-10">Easy DevOps works on both Linux and Windows servers.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-3xl mb-4">🐧</div>
          <h3 className="text-lg font-bold mb-3">Linux</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {features.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span>{f}</span>
                <span className="text-foreground font-medium text-xs">{linuxDetails[i]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-3xl mb-4">🪟</div>
          <h3 className="text-lg font-bold mb-3">Windows</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {features.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span>{f}</span>
                <span className="text-foreground font-medium text-xs">{winDetails[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 text-sm">
        <h3 className="font-bold text-foreground mb-3">Service Control Difference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-primary/[0.04] rounded-lg">
            <code className="font-mono text-xs text-primary font-semibold">Linux</code>
            <p className="text-muted mt-1">Uses <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">systemctl start/stop/restart nginx</code> for service management.</p>
          </div>
          <div className="p-4 bg-primary/[0.04] rounded-lg">
            <code className="font-mono text-xs text-primary font-semibold">Windows</code>
            <p className="text-muted mt-1">Uses <code className="font-mono text-xs bg-primary/[0.08] text-primary px-1.5 py-0.5 rounded">nginx.exe</code> direct execution with process management.</p>
          </div>
        </div>
      </div>

      <DocsPagination
        prev={{ title: "Configuration", href: "/docs/configuration", section: "Reference" }}
        next={{ title: "FAQ & Troubleshooting", href: "/docs/faq", section: "Help" }}
      />
    </div>
  );
}
