import { NextResponse } from "next/server";

// Fetch only on request, no automatic revalidation
export const dynamic = "force-dynamic";
export const revalidate = false;

const GITHUB_API_URL =
  "https://api.github.com/repos/yhauxell/open-cookie-consent-banner";

export async function GET() {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Optional: Add GitHub token for higher rate limits
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: false }, // No automatic revalidation - fetch only when requested
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400", // Cache 1 hour, stale for 1 day
        },
      }
    );
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    // Return 0 stars on error so the button still works
    return NextResponse.json(
      { stars: 0, forks: 0 },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60", // Short cache for errors
        },
      }
    );
  }
}
