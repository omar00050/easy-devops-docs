import Link from "next/link";

export default function SecurityUpdateNotice() {
  return (
    <aside aria-label="Security update" className="mb-6 rounded-xl border border-primary/40 bg-primary/[0.06] p-4 text-sm leading-relaxed">
      <strong>1.4.3 to 1.4.6 are not recommended.</strong> Easy DevOps 1.4.6 and
      earlier are missing the security fixes in 1.4.7, and the 1.4.4 to 1.4.6
      upgrades can leave the service unable to start. Update to 1.4.7, then
      recover the service if it stopped.{" "}
      <Link className="text-primary underline" href="/docs/security-advisories#v1-4-7">Read the advisory and upgrade steps</Link>
      {" "}or the{" "}
      <Link className="text-primary underline" href="/docs/troubleshooting#service-stopped-after-update-1-4-4">recovery steps for a service that stopped after updating</Link>.
    </aside>
  );
}
