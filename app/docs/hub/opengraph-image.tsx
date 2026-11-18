import { OG_CONTENT_TYPE, OG_SIZE, renderDocOg } from "@/lib/docOg";

export const alt = "Easy DevOps docs — Easy DevOps Hub";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDocOg({
    section: "Operations",
    title: "Easy DevOps Hub",
    path: "/docs/hub",
  });
}
