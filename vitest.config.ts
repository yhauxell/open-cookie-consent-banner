import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // CI-specific settings
    ...(process.env.CI && {
      reporters: ["verbose"],
      // Increase timeout for CI environments
      testTimeout: 10000,
      hookTimeout: 10000,
    }),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
