"use client"

import type React from "react"

import type { Meta, StoryObj } from "@storybook/react"
import { userEvent, within } from "@storybook/testing-library"
import PaymentDetailsStep from "./PaymentDetailsStep"
import { OnboardingProvider, useOnboarding, type OnboardingStep } from "../onboarding-context"
import { useEffect } from "react"

function StoryWrapper({
  children,
  paymentInfo = {},
  currentStep = "payment-details" as OnboardingStep,
}: {
  children: React.ReactNode
  paymentInfo?: any
  currentStep?: OnboardingStep
}) {
  const MockedProvider = ({ children }: { children: React.ReactNode }) => {
    const ContextSetup = () => {
      const { setPaymentInfo, setCurrentStep } = useOnboarding()

      useEffect(() => {
        setPaymentInfo(paymentInfo)
        setCurrentStep(currentStep)
      }, [])

      return null
    }

    return (
      <OnboardingProvider>
        <ContextSetup />
        {children}
      </OnboardingProvider>
    )
  }

  return (
    <MockedProvider>
      <div className="max-w-md w-full p-6 bg-background border rounded-lg shadow-sm">{children}</div>
    </MockedProvider>
  )
}

const meta = {
  title: "Onboarding/PaymentDetailsStep",
  component: PaymentDetailsStep,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <StoryWrapper
        paymentInfo={{
          stellarAddress: "",
          acceptedAssets: ["XLM"],
          paymentTypes: ["online"],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentDetailsStep>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Prefilled: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        paymentInfo={{
          stellarAddress: "GBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UV",
          acceptedAssets: ["XLM", "USDC", "ETH"],
          paymentTypes: ["online", "pos", "invoice"],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
}

export const AllOptionsSelected: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        paymentInfo={{
          stellarAddress: "GBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UV",
          acceptedAssets: ["XLM", "USDC", "BTC", "ETH", "EUR"],
          paymentTypes: ["online", "pos", "invoice", "subscription"],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
}

export const NoOptionsSelected: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        paymentInfo={{
          stellarAddress: "",
          acceptedAssets: [],
          paymentTypes: [],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

// Story that tests filling out the form
export const FillForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fill in the Stellar address
    const addressInput = canvas.getByLabelText("Stellar Address", { exact: false })
    await userEvent.type(addressInput, "GBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UV")

    // Select some assets
    const usdcCheckbox = canvas.getByLabelText("USD Coin (USDC)", { exact: false })
    await userEvent.click(usdcCheckbox)

    const btcCheckbox = canvas.getByLabelText("Bitcoin (BTC)", { exact: false })
    await userEvent.click(btcCheckbox)

    // Select some payment types
    const posCheckbox = canvas.getByLabelText("Point of Sale", { exact: false })
    await userEvent.click(posCheckbox)

    // Verify the Complete Setup button is enabled
    const completeButton = canvas.getByText("Complete Setup")
    if (completeButton.hasAttribute("disabled")) {
      throw new Error("Complete Setup button should be enabled")
    }
  },
}

// Story that tests tooltip functionality
export const TooltipInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Find the first tooltip trigger (Stellar Address help icon)
    const tooltipTrigger = canvas.getAllByRole("button")[0]

    // Hover over the tooltip trigger
    await userEvent.hover(tooltipTrigger)

    // Wait for the tooltip to appear
    await new Promise((resolve) => setTimeout(resolve, 300))
  },
}

// Story that tests navigation buttons
export const NavigationButtons: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        paymentInfo={{
          stellarAddress: "GBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UV",
          acceptedAssets: ["XLM"],
          paymentTypes: ["online"],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Click the Back button
    const backButton = canvas.getByText("Back")
    await userEvent.click(backButton)

    // Click the Complete Setup button
    const completeButton = canvas.getByText("Complete Setup")
    await userEvent.click(completeButton)
  },
}

