"use client"

import type React from "react"

import type { Meta, StoryObj } from "@storybook/react"
import { userEvent, within } from "@storybook/testing-library"
import WelcomeStep from "./WelcomeStep"
import { OnboardingProvider, useOnboarding, type OnboardingStep } from "../onboarding-context"
import { useEffect } from "react"

function StoryWrapper({
  children,
  currentStep = "welcome" as OnboardingStep,
}: {
  children: React.ReactNode
  currentStep?: OnboardingStep
}) {
  const MockedProvider = ({ children }: { children: React.ReactNode }) => {
    const ContextSetup = () => {
      const { setCurrentStep } = useOnboarding()

      useEffect(() => {
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
  title: "Onboarding/WelcomeStep",
  component: WelcomeStep,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof WelcomeStep>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
}

export const GetStartedButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const getStartedButton = canvas.getByText("Get Started")

    await userEvent.click(getStartedButton)
  },
}

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      </div>
    ),
  ],
}

