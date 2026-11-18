import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const SITE_HOST = "easy-devops.devxor.team";

/**
 * One share card per docs page: the page name is the headline, so every link
 * someone sends carries the page it points at. Shared by the per-route
 * `opengraph-image.tsx` files under app/docs; no network fetches, so a build
 * machine without Google Fonts still renders it.
 */
export function renderDocOg({
  section,
  title,
  path,
}: {
  section: string;
  title: string;
  path: string;
}) {
  const titleSize = title.length > 24 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0b0f1a 0%, #0f172a 50%, #0b1a1a 100%)",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(45,212,191,0.18)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(45,212,191,0.10)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            width: "60%",
            height: 2,
            background:
              "linear-gradient(to right, transparent, rgba(45,212,191,0.25), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#2dd4bf",
            marginBottom: 22,
          }}
        >
          {`Easy DevOps · ${section}`}
        </div>

        <div
          style={{
            fontSize: titleSize,
            fontWeight: 900,
            color: "#f1f5f9",
            textAlign: "center",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#94a3b8",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Docs — nginx, SSL, deployments and the Hub
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
          }}
        >
          {["CLI", "Web dashboard", "Open source"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#2dd4bf",
                border: "1px solid rgba(45,212,191,0.2)",
                borderRadius: 8,
                padding: "8px 16px",
                background: "rgba(45,212,191,0.06)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ fontSize: 18, color: "#475569", marginTop: 40, textAlign: "center" }}>
          {`${SITE_HOST}${path}`}
        </div>
      </div>
    ),
    OG_SIZE
  );
}
