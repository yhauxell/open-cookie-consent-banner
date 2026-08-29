import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  renderWithConsent,
  clearMockConsentState,
} from "../test-utils"
import { CookieTrigger } from "../cookie-trigger"

describe("CookieTrigger", () => {
  beforeEach(() => {
    clearMockConsentState()
  })

  afterEach(() => {
    clearMockConsentState()
  })

  it("should not render default trigger when consent has not been given", () => {
    renderWithConsent(<CookieTrigger />, {
      initialConsent: {
        hasConsented: false,
      },
    })

    expect(screen.queryByText("Cookie Settings")).not.toBeInTheDocument()
  })

  it("should render default trigger when consent has been given", () => {
    renderWithConsent(<CookieTrigger />, {
      initialConsent: {
        hasConsented: true,
      },
    })

    expect(screen.getByText("Cookie Settings")).toBeInTheDocument()
  })

  it("should render custom children regardless of initial banner consent state", async () => {
    const user = userEvent.setup()
    renderWithConsent(
      <CookieTrigger>
        <span data-testid="custom-trigger">Manage My Cookies</span>
      </CookieTrigger>,
      {
        initialConsent: {
          hasConsented: false,
        },
      }
    )

    const customButton = screen.getByTestId("custom-trigger")
    expect(customButton).toBeInTheDocument()
    expect(customButton).toHaveTextContent("Manage My Cookies")

    await user.click(customButton)
  })

  it("should render icon variant", () => {
    renderWithConsent(<CookieTrigger variant="icon" />, {
      initialConsent: {
        hasConsented: true,
      },
    })

    expect(screen.getByLabelText("Cookie settings")).toBeInTheDocument()
  })

  it("should render full variant", () => {
    renderWithConsent(<CookieTrigger variant="full" />, {
      initialConsent: {
        hasConsented: true,
      },
    })

    expect(screen.getByText("Cookie Settings")).toBeInTheDocument()
  })
})
