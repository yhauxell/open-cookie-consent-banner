import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const nameWithoutExt = name.replace(/\.json$/, "")

  // Check if the file exists in public/r directory
  const publicPath = join(process.cwd(), "public", "r", `${nameWithoutExt}.json`)

  if (existsSync(publicPath)) {
    try {
      const fileContent = await readFile(publicPath, "utf-8")
      const json = JSON.parse(fileContent)
      return NextResponse.json(json, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate",
        },
      })
    } catch (error) {
      console.error(`Error reading registry file ${nameWithoutExt}:`, error)
      return NextResponse.json({ error: "Failed to read registry file" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Registry item not found" }, { status: 404 })
}

