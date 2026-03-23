import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  // In production, fetch current price from KV
  const price = "$2.47";

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
          backgroundColor: "#0A0A0A",
          color: "#FAFAFA",
        }}
      >
        <div style={{ fontSize: 32, color: "#FF6B00", marginBottom: 16 }}>
          FuelWatch Australia
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#FF3333" }}>
          {price}/L
        </div>
        <div style={{ fontSize: 24, color: "#888888", marginTop: 16 }}>
          National Average — Unleaded 91
        </div>
        <div style={{ fontSize: 18, color: "#888888", marginTop: 8 }}>
          Live fuel prices. Political satire. National tears.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
