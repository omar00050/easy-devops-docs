import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PageDef {
  title: string;
  href: string;
  section: string;
}

interface DocsPaginationProps {
  prev?: PageDef;
  next?: PageDef;
}

export default function DocsPagination({ prev, next }: DocsPaginationProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Documentation pagination" className="mt-16 border-t border-border pt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="group rounded-xl border border-border bg-surface/50 p-4 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/[0.03]"
          >
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </div>
            <div className="mt-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {prev.title}
            </div>
            <div className="text-[11px] text-muted">{prev.section}</div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {next && (
          <Link
            href={next.href}
            className="group rounded-xl border border-border bg-surface/50 p-4 text-right transition-colors duration-200 hover:border-primary/40 hover:bg-primary/[0.03] sm:col-start-2"
          >
            <div className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Next
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="mt-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {next.title}
            </div>
            <div className="text-[11px] text-muted">{next.section}</div>
          </Link>
        )}
      </div>
    </nav>
  );
}
