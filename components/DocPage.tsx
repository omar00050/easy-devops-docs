import Link from "next/link";

interface DocPageProps {
  section: string;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}

export default function DocPage({ section, title, description, children }: DocPageProps) {
  return (
    <div className="doc-content">
      <header className="mb-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
        >
          <Link href="/docs/overview" className="transition-colors hover:text-primary">
            Docs
          </Link>
          <span className="text-border">/</span>
          <span className="text-primary/80">{section}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground md:text-[40px] md:leading-[1.08]">
          {title}
        </h1>

        <p className="mt-4 max-w-[660px] text-[15px] leading-relaxed text-muted">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-primary/50 via-border to-transparent" />
          <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
        </div>
      </header>

      {children}
    </div>
  );
}
