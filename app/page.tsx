import LandingPage from "./LandingPage";
import { latestVersion } from "@/lib/version";

export const metadata = {
  title: "Easy DevOps — Unified DevOps CLI for Nginx, SSL & Node.js",
  description:
    "Manage Nginx, SSL certificates, domains, and Node.js from a single open-source CLI and web dashboard. Free, lightweight, and production-ready.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Easy DevOps — Unified DevOps CLI for Nginx, SSL & Node.js",
    description:
      "Manage Nginx, SSL/TLS certificates, domain configs, and Node.js versions from a single open-source CLI and modern web dashboard.",
    url: "/",
  },
};

export const revalidate = 3600;

export default async function Home() {
  const version = await latestVersion();
  return <LandingPage version={version} />;
}
