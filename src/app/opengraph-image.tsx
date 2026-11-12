import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Spot the Event — Hyderabad tech events from the reels";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(145deg, #12151C 0%, #1C2230 50%, #1A3D34 100%)",
          color: "#EEF1F4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#1FA97A",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700 }}>Spot the Event</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Find the event from the reel.
          </div>
          <div style={{ fontSize: 28, color: "rgba(238,241,244,0.72)", maxWidth: 820 }}>
            Hyderabad hackathons, meetups, and workshops — official registration links. No AutoDM.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#1FA97A" }}>
          <span>@buildwithshashankk</span>
          <span>spot.venlix.tech</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
