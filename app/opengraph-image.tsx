import { ImageResponse } from "@vercel/og";

export const alt =
  "Open Cookie Consent Banner - GDPR Compliant Cookie Consent for React & Next.js";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://open-cookie-consent-banner.vercel.app";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#f4f4f5",
            borderRadius: "9999px",
            padding: "8px 16px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#71717a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span style={{ fontSize: "14px", color: "#3f3f46", fontWeight: 500 }}>
            shadcn/ui Registry Compatible
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#18181b",
              lineHeight: 1.2,
            }}
          >
            Cookie Consent
          </span>
          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.2,
              paddingBottom: "8px",
            }}
          >
            <span style={{ color: "#facc15", fontWeight: 700 }}>D</span>
            <span style={{ color: "#f9a825", fontWeight: 700 }}>o</span>
            <span style={{ color: "#f97316", fontWeight: 700 }}>n</span>
            <span style={{ color: "#f97316", fontWeight: 700 }}>e</span>
            <span style={{ color: "#fb7185", fontWeight: 700 }}>&nbsp;</span>
            <span style={{ color: "#ec4899", fontWeight: 700 }}>R</span>
            <span style={{ color: "#db2777", fontWeight: 700 }}>i</span>
            <span style={{ color: "#c026d3", fontWeight: 700 }}>g</span>
            <span style={{ color: "#a855f7", fontWeight: 700 }}>h</span>
            <span style={{ color: "#9333ea", fontWeight: 700 }}>t</span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "22px",
            color: "#71717a",
            textAlign: "center",
            maxWidth: "650px",
            marginTop: "24px",
            lineHeight: 1.4,
          }}
        >
          A full-featured, GDPR-compliant cookie consent solution for React and
          Next.js. Install via shadcn/ui registry in seconds.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#18181b",
              color: "#fafafa",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Get Started
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ffffff",
              color: "#18181b",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 500,
              border: "1px solid #e4e4e7",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            View Demo
          </div>
        </div>

        {/* Terminal Command */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            backgroundColor: "#18181b",
            color: "#fafafa",
            padding: "16px 24px",
            borderRadius: "10px",
            marginTop: "32px",
            width: "680px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#71717a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <code style={{ fontSize: "14px", fontFamily: "monospace" }}>
              npx shadcn@latest add {baseUrl}/r/cookie-consent.json
            </code>
          </div>
          {/* Copy icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#71717a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
