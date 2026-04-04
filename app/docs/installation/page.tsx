import DocsPagination from "@/components/DocsPagination";
import InstallTabs from "@/components/InstallTabs";

export default function InstallationPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <span>Docs</span> <span>/</span> <span>Getting Started</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Installation</h1>
      <p className="text-muted text-base leading-relaxed mb-10">Choose the method that fits your setup. The bootstrap installer handles Node.js + Easy DevOps in one pass.</p>

      <InstallTabs />

      <div id="requirements" className="mt-10 bg-surface border border-border rounded-xl p-6">
        <h2 id="requirements" className="text-base font-bold mb-4 text-foreground">Requirements</h2>
        <ul className="space-y-2.5 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✅</span>
            <span><strong className="text-foreground">Node.js 18+</strong> (with npm)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✅</span>
            <span><strong className="text-foreground">Linux</strong> (Debian/Ubuntu etc.) or <strong className="text-foreground">Windows</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">⚠️</span>
            <span><strong className="text-foreground">Windows users:</strong> PowerShell must be run <em>as Administrator</em> (required for managing services and SSL certificates)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">➕</span>
            <span>Optional: Nginx, nvm (installed separately or via the tool)</span>
          </li>
        </ul>
      </div>

      <DocsPagination
        prev={{ title: "Features", href: "/docs/features", section: "Getting Started" }}
        next={{ title: "Quick Start", href: "/docs/quickstart", section: "Usage" }}
      />
    </div>
  );
}
