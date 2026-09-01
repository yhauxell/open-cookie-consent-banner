import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { renderWithConsent, clearMockConsentState } from "../test-utils"
import { CookieBanner } from "../cookie-banner"

describe("CookieBanner", () => {
  beforeEach(() => {
    clearMockConsentState()
    localStorage.clear()
  })

  afterEach(() => {
    clearMockConsentState()
    localStorage.clear()
  })

  it("renders horizontal bar layout for default bottom position", async () => {
    renderWithConsent(<CookieBanner position="bottom" />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /accept all/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /reject all/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /customize/i })).toBeInTheDocument()
  })

  it("renders horizontal bar layout for top position", async () => {
    renderWithConsent(<CookieBanner position="top" />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })
  })

  it("renders vertical card layout for bottom-right position", async () => {
    renderWithConsent(<CookieBanner position="bottom-right" />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /accept all/i })).toBeInTheDocument()
  })

  it("renders vertical card layout for bottom-left position", async () => {
    renderWithConsent(<CookieBanner position="bottom-left" />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /reject all/i })).toBeInTheDocument()
  })

  it("handles acceptAll click correctly", async () => {
    const user = userEvent.setup()
    renderWithConsent(<CookieBanner position="bottom-right" />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /accept all/i })).toBeInTheDocument()
    })

    const acceptBtn = screen.getByRole("button", { name: /accept all/i })
    await user.click(acceptBtn)
  })

  it("handles rejectAll click correctly", async () => {
    const user = userEvent.setup()
    renderWithConsent(<CookieBanner position="bottom-left" />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /reject all/i })).toBeInTheDocument()
    })

    const rejectBtn = screen.getByRole("button", { name: /reject all/i })
    await user.click(rejectBtn)
  })

  it("renders compact size banner correctly", async () => {
    renderWithConsent(<CookieBanner position="bottom-right" size="sm" />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /accept all/i })).toHaveClass("h-7")
  })

  it("renders spacious size banner correctly", async () => {
    renderWithConsent(<CookieBanner position="bottom" size="lg" />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /accept all/i })).toHaveClass("h-9")
  })

  it("propagates buttonClassName correctly to buttons", async () => {
    renderWithConsent(
      <CookieBanner
        position="bottom-left"
        className="rounded-full"
        buttonClassName="rounded-full"
      />
    )

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /accept all/i })).toHaveClass("rounded-full")
    })
  })
})

