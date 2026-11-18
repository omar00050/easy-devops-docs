import { OG_CONTENT_TYPE, OG_SIZE, renderDocOg } from "@/lib/docOg";

export const alt = "Easy DevOps docs — SSL Manager";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDocOg({
    section: "Using the CLI",
    title: "SSL Manager",
    path: "/docs/ssl",
  });
}
