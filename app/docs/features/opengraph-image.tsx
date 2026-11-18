import { OG_CONTENT_TYPE, OG_SIZE, renderDocOg } from "@/lib/docOg";

export const alt = "Easy DevOps docs — Features";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDocOg({ section: "Getting Started", title: "Features", path: "/docs/features" });
}
