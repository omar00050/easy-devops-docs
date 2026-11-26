import type { MetadataRoute } from "next";

const SITE_URL = "https://easy-devops.devxor.team";

const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/docs/overview", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/quickstart", priority: 0.9, changeFrequency: "monthly" },
  { path: "/docs/installation", priority: 0.9, changeFrequency: "monthly" },
  { path: "/docs/features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/cli", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/commands", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/ssl", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/deployments", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/service", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/pm2-windows-server", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/hub", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/teams", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/maintenance", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/security-advisories", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/troubleshooting", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/api", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/configuration", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/platform", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/faq", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
