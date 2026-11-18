import { OG_CONTENT_TYPE, OG_SIZE, renderDocOg } from "@/lib/docOg";

export const alt = "Easy DevOps docs — Maintenance & Updates";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDocOg({
    section: "Operations",
    title: "Maintenance & Updates",
    path: "/docs/maintenance",
  });
}
