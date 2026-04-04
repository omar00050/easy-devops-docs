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
  return (
    <div className="flex gap-4 mt-16 pt-8 border-t border-border">
      {prev && (
        <Link href={prev.href} className="flex-1 group block border border-border rounded-xl p-4 hover:border-primary/40 transition-all duration-200">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Previous
          </div>
          <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{prev.title}</div>
          <div className="text-xs text-muted">{prev.section}</div>
        </Link>
      )}
      {next && (
        <Link href={next.href} className="flex-1 group block border border-border rounded-xl p-4 hover:border-primary/40 transition-all duration-200 text-right">
          <div className="flex items-center gap-2 justify-end text-xs text-muted mb-1">
            Next
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{next.title}</div>
          <div className="text-xs text-muted">{next.section}</div>
        </Link>
      )}
      {!prev && !next && null}
    </div>
  );
}
