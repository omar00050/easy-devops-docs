import Link from "next/link";

export default function SecurityUpdateNotice() {
  return (
    <aside aria-label="Security update" className="mb-6 rounded-xl border border-primary/40 bg-primary/[0.06] p-4 text-sm leading-relaxed">
      <strong>1.4.3 to 1.4.7 are not recommended, and not on Windows Server.</strong>{" "}
      Easy DevOps 1.4.6 and earlier are missing the security fixes in 1.4.7, and
      on Windows Server a 1.4.7 install can stop at the runtime permission step.
      Update to 1.4.8, then recover the service if it stopped.{" "}
      <Link className="text-primary underline" href="/docs/troubleshooting#runtime-read-back-1-4-7">What to do when a 1.4.7 install stops at the runtime permission step</Link>
      {" "}or the{" "}
      <Link className="text-primary underline" href="/docs/troubleshooting#service-stopped-after-update-1-4-4">recovery steps for a service that stopped after updating</Link>.
    </aside>
  );
}
