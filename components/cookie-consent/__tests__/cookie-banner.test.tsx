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

  it("applies correct position and width classes for bottom-right floating banner", async () => {
    const { container } = renderWithConsent(<CookieBanner position="bottom-right" isEmbedded />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })

    const wrapper = container.querySelector(".inset-x-0.bottom-0")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("inset-x-0", "bottom-0", "sm:bottom-4", "sm:right-4", "sm:max-w-md", "absolute")
  })

  it("applies correct position and width classes for bottom-left floating banner", async () => {
    const { container } = renderWithConsent(<CookieBanner position="bottom-left" isEmbedded />)

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })

    const wrapper = container.querySelector(".inset-x-0.bottom-0")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("inset-x-0", "bottom-0", "sm:bottom-4", "sm:left-4", "sm:max-w-md", "absolute")
  })

  it("centers floating banner at bottom when isMobile is true for bottom-left", async () => {
    const { container } = renderWithConsent(
      <CookieBanner position="bottom-left" isEmbedded isMobile />
    )

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })

    const wrapper = container.querySelector(".inset-x-0.bottom-0")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("inset-x-0", "bottom-0", "p-3")
    expect(wrapper).not.toHaveClass("sm:left-4")
    expect(wrapper).not.toHaveClass("sm:bottom-4")
  })

  it("centers floating banner at bottom when isMobile is true for bottom-right", async () => {
    const { container } = renderWithConsent(
      <CookieBanner position="bottom-right" isEmbedded isMobile />
    )

    await waitFor(() => {
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })

    const wrapper = container.querySelector(".inset-x-0.bottom-0")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("inset-x-0", "bottom-0", "p-3")
    expect(wrapper).not.toHaveClass("sm:right-4")
    expect(wrapper).not.toHaveClass("sm:bottom-4")
  })
})

