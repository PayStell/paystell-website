"use client"

import type React from "react"

import type { Meta, StoryObj } from "@storybook/react"
import CompleteStep from "./CompleteStep"
import { OnboardingProvider, type BusinessInfo, type PaymentInfo, useOnboarding } from "../onboarding-context"
import { useEffect } from "react"

function StoryWrapper({
  children,
  businessInfo,
  paymentInfo,
}: {
  children: React.ReactNode
  businessInfo: Partial<BusinessInfo>
  paymentInfo: Partial<PaymentInfo>
}) {
  // We need to use the context's methods to set up our test data
  const MockedProvider = ({ children }: { children: React.ReactNode }) => {
    const ContextSetup = () => {
      const { setBusinessInfo, setPaymentInfo, setCurrentStep } = useOnboarding()

      useEffect(() => {
        // Set up our test data when the component mounts
        setBusinessInfo(businessInfo)
        setPaymentInfo(paymentInfo)
        setCurrentStep("complete")
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

// Mock data for the stories
const defaultBusinessInfo: Partial<BusinessInfo> = {
  businessName: "Stellar Coffee Shop",
  description: "A coffee shop that accepts Stellar payments",
  businessType: "Retail",
  website: "https://stellarcoffee.com",
  phoneNumber: "+1 (555) 123-4567",
}

const defaultPaymentInfo: Partial<PaymentInfo> = {
  stellarAddress: "GBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UV",
  acceptedAssets: ["XLM", "USDC", "EURC"],
  paymentTypes: ["online", "in-person"],
}

// This is the Storybook metadata for the component
const meta = {
  title: "Onboarding/CompleteStep",
  component: CompleteStep,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <StoryWrapper businessInfo={defaultBusinessInfo} paymentInfo={defaultPaymentInfo}>
        <Story />
      </StoryWrapper>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof CompleteStep>

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {}

// Story with different business info
export const EcommerceStore: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        businessInfo={{
          ...defaultBusinessInfo,
          businessName: "Crypto Gadgets",
          businessType: "E-commerce",
          description: "Online store selling crypto-themed merchandise",
        }}
        paymentInfo={defaultPaymentInfo}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
}

// Story with different payment info
export const MultipleAssets: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        businessInfo={defaultBusinessInfo}
        paymentInfo={{
          ...defaultPaymentInfo,
          acceptedAssets: ["XLM", "USDC", "EURC", "BTC", "ETH", "AQUA"],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
}

// Story with a very long Stellar address to test truncation
export const LongAddress: Story = {
  decorators: [
    (Story) => (
      <StoryWrapper
        businessInfo={defaultBusinessInfo}
        paymentInfo={{
          ...defaultPaymentInfo,
          stellarAddress:
            "GBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UVGBCXFADJETSVI3FCNMHPKXZPNXVNPFXKD4YZSYNMGZL5PKXRHJQGK3UV",
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
}

// Story with mobile viewport
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

