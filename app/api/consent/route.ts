import { NextResponse } from "next/server"
import type { ConsentRecord } from "@/components/cookie-consent"

// In-memory storage for demo purposes
// In production, replace with your database
const consentRecords: ConsentRecord[] = []

export async function POST(request: Request) {
  try {
    const record: ConsentRecord = await request.json()

    // Validate required fields
    if (!record.visitorId || !record.consentId || !record.categories) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store the record (replace with your database logic)
    consentRecords.push({
      ...record,
      timestamp: record.timestamp || new Date().toISOString(),
    })

    console.log("[Consent API] Stored consent record:", {
      visitorId: record.visitorId,
      consentId: record.consentId,
      action: record.action,
      categories: record.categories,
    })

    return NextResponse.json({
      success: true,
      consentId: record.consentId,
    })
  } catch (error) {
    console.error("[Consent API] Error:", error)
    return NextResponse.json({ error: "Failed to store consent" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const visitorId = searchParams.get("visitorId")

  if (visitorId) {
    const records = consentRecords.filter((r) => r.visitorId === visitorId)
    return NextResponse.json({ records })
  }

  // Return all records (for admin purposes)
  return NextResponse.json({
    total: consentRecords.length,
    records: consentRecords,
  })
}
