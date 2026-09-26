import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: free WAEC practice questions`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f766e",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.85 }}>{site.name}</div>
        <div style={{ fontSize: 80, fontWeight: 700, marginTop: 16 }}>{site.tagline}</div>
        <div style={{ fontSize: 36, marginTop: 24, opacity: 0.9 }}>
          Free WAEC practice questions with instant explanations
        </div>
      </div>
    ),
    size,
  );
}
