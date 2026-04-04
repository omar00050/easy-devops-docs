import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Easy DevOps — Free open-source DevOps CLI & web dashboard for managing Nginx reverse proxy, SSL/TLS certificates (Let's Encrypt, HTTP-01, DNS-01), domain configuration, and Node.js version management on Linux & Windows servers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const interData = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&display=swap"
  )
    .then((res) => res.arrayBuffer())
    .catch(() => null);

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
          fontFamily: "Inter, sans-serif",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Primary color glow (matching landing page) */}
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
        {/* Subtle top-left accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            width: "60%",
            height: 2,
            background: "linear-gradient(to right, transparent, rgba(45,212,191,0.25), transparent)",
          }}
        />
        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#f1f5f9",
            textAlign: "center",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            position: "relative",
          }}
        >
          DevOps,{" "}
          <span style={{ color: "transparent" }}>Made</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: "linear-gradient(to right, #2dd4bf, rgba(45,212,191,0.7))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            position: "relative",
            marginTop: 4,
          }}
        >
          Simple.
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#94a3b8",
            marginTop: 20,
            textAlign: "center",
            position: "relative",
          }}
        >
          Unified CLI & Web Dashboard
        </div>
        {/* Tags */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, position: "relative" }}>
          {["Nginx", "SSL/TLS", "Let's Encrypt", "Node.js"].map((tag) => (
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
        {/* URL */}
        <div style={{ fontSize: 18, color: "#475569", marginTop: 40, textAlign: "center", position: "relative" }}>
          easy-devops.devxor.team
        </div>
      </div>
    ),
    {
      ...size,
      fonts: interData
        ? [
            {
              name: "Inter",
              data: interData,
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}
