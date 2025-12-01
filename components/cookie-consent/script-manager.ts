// Script management utilities for consent-based script loading

import type { ConsentCategories, ConsentCategory, ScriptConfig } from "./types"

interface ManagedScript extends ScriptConfig {
  element?: HTMLScriptElement
  loaded: boolean
}

// Registry of all managed scripts
const scriptRegistry = new Map<string, ManagedScript>()

// Track cleanup functions for each script
const cleanupRegistry = new Map<string, () => void>()

/**
 * Register a script to be managed by the consent system
 */
export function registerScript(config: ScriptConfig): void {
  if (scriptRegistry.has(config.id)) {
    console.warn(`[CookieConsent] Script with id "${config.id}" is already registered`)
    return
  }

  scriptRegistry.set(config.id, {
    ...config,
    loaded: false,
  })
}

/**
 * Unregister a script and clean it up
 */
export function unregisterScript(id: string): void {
  const script = scriptRegistry.get(id)
  if (script) {
    unloadScript(id)
    scriptRegistry.delete(id)
  }
}

/**
 * Load a script into the DOM
 */
export function loadScript(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const managed = scriptRegistry.get(id)
    if (!managed) {
      reject(new Error(`Script "${id}" is not registered`))
      return
    }

    if (managed.loaded && managed.element) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.id = `consent-script-${id}`
    script.async = true

    if (managed.src) {
      script.src = managed.src
    } else if (managed.content) {
      script.textContent = managed.content
    } else {
      reject(new Error(`Script "${id}" has no src or content`))
      return
    }

    // Apply custom attributes
    if (managed.attributes) {
      Object.entries(managed.attributes).forEach(([key, value]) => {
        script.setAttribute(key, value)
      })
    }

    script.onload = () => {
      managed.loaded = true
      managed.element = script
      managed.onLoad?.()
      resolve()
    }

    script.onerror = () => {
      const error = new Error(`Failed to load script "${id}"`)
      managed.onError?.(error)
      reject(error)
    }

    // Append based on strategy
    if (managed.strategy === "beforeInteractive") {
      document.head.appendChild(script)
    } else {
      document.body.appendChild(script)
    }
  })
}

/**
 * Unload a script from the DOM and run cleanup
 */
export function unloadScript(id: string): void {
  const managed = scriptRegistry.get(id)
  if (!managed) return

  // Remove the script element
  if (managed.element) {
    managed.element.remove()
    managed.element = undefined
  }

  // Also try to find by ID in case element reference is stale
  const existingScript = document.getElementById(`consent-script-${id}`)
  if (existingScript) {
    existingScript.remove()
  }

  // Run the revoke callback
  managed.onRevoke?.()

  // Run any registered cleanup
  const cleanup = cleanupRegistry.get(id)
  if (cleanup) {
    cleanup()
    cleanupRegistry.delete(id)
  }

  managed.loaded = false
}

/**
 * Register a cleanup function for a script
 */
export function registerCleanup(id: string, cleanup: () => void): void {
  cleanupRegistry.set(id, cleanup)
}

/**
 * Load all scripts for consented categories
 */
export function loadConsentedScripts(categories: ConsentCategories): void {
  scriptRegistry.forEach((script, id) => {
    if (categories[script.category] && !script.loaded) {
      loadScript(id).catch((error) => {
        console.error(`[CookieConsent] Failed to load script "${id}":`, error)
      })
    }
  })
}

/**
 * Unload all scripts for revoked categories
 */
export function unloadRevokedScripts(
  previousCategories: ConsentCategories,
  currentCategories: ConsentCategories,
): ConsentCategory[] {
  const revokedCategories: ConsentCategory[] = []

  // Find revoked categories
  ;(Object.keys(previousCategories) as ConsentCategory[]).forEach((category) => {
    if (previousCategories[category] && !currentCategories[category]) {
      revokedCategories.push(category)
    }
  })

  // Unload scripts for revoked categories
  scriptRegistry.forEach((script, id) => {
    if (revokedCategories.includes(script.category) && script.loaded) {
      unloadScript(id)
    }
  })

  return revokedCategories
}

/**
 * Get all loaded script IDs
 */
export function getLoadedScripts(): string[] {
  const loaded: string[] = []
  scriptRegistry.forEach((script, id) => {
    if (script.loaded) {
      loaded.push(id)
    }
  })
  return loaded
}

/**
 * Get all registered scripts
 */
export function getRegisteredScripts(): Map<string, ManagedScript> {
  return new Map(scriptRegistry)
}

/**
 * Clear all scripts (useful for testing)
 */
export function clearAllScripts(): void {
  scriptRegistry.forEach((_, id) => {
    unloadScript(id)
  })
  scriptRegistry.clear()
  cleanupRegistry.clear()
}

/**
 * Common third-party script cleanup helpers
 */
export const scriptCleanupHelpers = {
  // Google Analytics cleanup
  googleAnalytics: () => {
    // Remove GA cookies
    const cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      if (name.startsWith("_ga") || name.startsWith("_gid") || name.startsWith("_gat")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
      }
    })
    // Clear GA global
    if (typeof window !== "undefined") {
      ;(window as Record<string, unknown>).ga = undefined
      ;(window as Record<string, unknown>).gtag = undefined
      ;(window as Record<string, unknown>).dataLayer = undefined
    }
  },

  // Facebook Pixel cleanup
  facebookPixel: () => {
    const cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      if (name.startsWith("_fbp") || name.startsWith("_fbc")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
      }
    })
    if (typeof window !== "undefined") {
      ;(window as Record<string, unknown>).fbq = undefined
    }
  },

  // Generic cookie cleanup by prefix
  clearCookiesByPrefix: (prefix: string) => {
    const cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      if (name.startsWith(prefix)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
      }
    })
  },
}
