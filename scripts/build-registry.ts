import { readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

interface RegistryItem {
  name: string
  type: string
  registryDependencies?: string[]
  files: Array<{
    path: string
    type: string
    target: string
    content: string
  }>
  description?: string
  category?: string
  subcategory?: string
}

interface Registry {
  registry: RegistryItem[]
}

async function buildRegistry() {
  try {
    // Read registry.json
    const registryPath = join(process.cwd(), "registry.json")
    const registryContent = await readFile(registryPath, "utf-8")
    const registry: Registry = JSON.parse(registryContent)

    // Create public/r directory if it doesn't exist
    const publicRDir = join(process.cwd(), "public", "r")
    if (!existsSync(publicRDir)) {
      await mkdir(publicRDir, { recursive: true })
    }

    // Process each registry item
    for (const item of registry.registry) {
      const itemFiles = []

      // Read all files for this item
      for (const file of item.files) {
        try {
          const filePath = join(process.cwd(), file.path)
          if (existsSync(filePath)) {
            const content = await readFile(filePath, "utf-8")
            itemFiles.push({
              ...file,
              content,
            })
          } else {
            console.warn(`File not found: ${file.path}`)
          }
        } catch (error) {
          console.error(`Error reading file ${file.path}:`, error)
        }
      }

      // Create registry item JSON
      const registryItem = {
        name: item.name,
        type: item.type,
        registryDependencies: item.registryDependencies || [],
        files: itemFiles,
        description: item.description,
        category: item.category,
        subcategory: item.subcategory,
      }

      // Write to public/r directory
      const outputPath = join(publicRDir, `${item.name}.json`)
      await writeFile(outputPath, JSON.stringify(registryItem, null, 2), "utf-8")
      console.log(`✓ Generated registry item: ${item.name}.json`)
    }

    // Also copy registry.json to public for MCP support
    const publicRegistryPath = join(process.cwd(), "public", "registry.json")
    await writeFile(publicRegistryPath, registryContent, "utf-8")
    console.log("✓ Copied registry.json to public/")

    console.log("\n✓ Registry build complete!")
  } catch (error) {
    console.error("Error building registry:", error)
    process.exit(1)
  }
}

buildRegistry()

