# Storybook Documentation

## What is Storybook?

Storybook is an open-source tool that allows developers to build UI components and pages in isolation. It provides a development environment where components can be tested, documented, and shared without needing to run the entire application.

![Screenshot 2025-01-20 at 3 48 33 PM](https://github.com/user-attachments/assets/0647bc0d-aeea-48dc-b741-dce8a3f1c063)

Storybook is particularly useful for:

- Developing components in isolation.

- Testing UI edge cases.

- Sharing a living style guide with designers and stakeholders.

- Writing documentation alongside components.

- With Storybook, you can build UI components independently of business logic and backend, which enhances development efficiency and consistency.

## How to Start Storybook

To run Storybook in the project, follow these steps:

Running Storybook

To start Storybook locally, run the following command:
```bash
npm run storybook
```

This will start a local development server at http://localhost:6006 where you can view and test your components.

## How to Create a Story

To add a new component story to Storybook, follow these steps:

Navigate to the components directory where the component is located.

Create a new file with the .stories.tsx extension next to your component file.

Write your story using the following example structure:

### Example Story

Assume you have a component named Button.tsx in the components directory.

#### Button.tsx
```bash
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {label}
    </button>
  );
};
```

#### Button.stories.tsx
```bash
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
  },
};
```

## Running the Story

After creating the story, start Storybook using:

```bash
npm run storybook
```

You should see the Button component listed in the Storybook UI under Components.


## Typography

If you want to apply one of this typographies, use the className text-

For example: h2 is text-h2 or button2 is text-button2


### Viewing Typography in Storybook

To preview the typography styles in Storybook, run the following command:

npm run storybook

Navigate to the Typography section to see all available text styles or visit the following link directly:

http://localhost:6006/?path=/docs/config-typography--docs