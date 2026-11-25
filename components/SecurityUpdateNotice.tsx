import Link from "next/link";

export default function SecurityUpdateNotice() {
  return (
    <aside aria-label="Security update" className="mb-6 rounded-xl border border-primary/40 bg-primary/[0.06] p-4 text-sm leading-relaxed">
      <strong>1.4.3 and 1.4.4 are not recommended.</strong> Easy DevOps 1.4.4 and earlier
      need the security fixes in 1.4.5. Windows Server mode also
      requires a service repair after the update.{" "}
      <Link className="text-primary underline" href="/docs/security-advisories#v1-4-5">Read the advisory and upgrade steps</Link>.
    </aside>
  );
}
