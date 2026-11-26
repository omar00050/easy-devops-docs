import { OG_CONTENT_TYPE, OG_SIZE, renderDocOg } from "@/lib/docOg";

export const alt = "Easy DevOps docs — PM2 on Windows Server";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderDocOg({
    section: "Operations",
    title: "PM2 on Windows Server",
    path: "/docs/pm2-windows-server",
  });
}
