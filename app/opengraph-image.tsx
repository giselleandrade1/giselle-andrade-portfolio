import { ImageResponse } from "next/og";

export const alt = "Giselle Andrade — Full Stack Developer portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "76px 82px",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#f7faff",
          background: "#030711",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-240px",
            right: "-130px",
            width: "650px",
            height: "650px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,91,255,.48), transparent 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "0",
            opacity: 0.16,
            backgroundImage:
              "linear-gradient(#385573 1px, transparent 1px), linear-gradient(90deg, #385573 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: 25, color: "#64d8ff" }}>
          <span>&lt;GA /&gt;</span>
          <span style={{ color: "#8f9eb3" }}>Giselle.dev</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontSize: 78, fontWeight: 750, letterSpacing: "-5px", lineHeight: 0.92 }}>
            Giselle Andrade
          </div>
          <div style={{ maxWidth: "870px", color: "#b8c4d6", fontSize: 35, lineHeight: 1.2 }}>
            Full Stack Developer building reliable software and thoughtful digital experiences.
          </div>
        </div>
        <div style={{ display: "flex", gap: "18px", color: "#64d8ff", fontSize: 21 }}>
          <span>Backend</span><span>·</span><span>Java</span><span>·</span><span>TypeScript</span><span>·</span><span>React</span><span>·</span><span>Next.js</span>
        </div>
      </div>
    ),
    size,
  );
}
