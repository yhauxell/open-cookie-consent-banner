import { ImageResponse } from "@vercel/og";

export const alt = "Open Cookie Consent Banner - GDPR Compliant Cookie Consent";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            🍪 Open Cookie Consent Banner
          </div>
          <div
            style={{
              fontSize: 36,
              marginTop: 20,
              opacity: 0.9,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            GDPR & CCPA Compliant Cookie Consent Solution
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 40,
              opacity: 0.8,
              display: "flex",
              gap: 30,
              alignItems: "center",
            }}
          >
            <span>React</span>
            <span>•</span>
            <span>Next.js</span>
            <span>•</span>
            <span>shadcn/ui</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
