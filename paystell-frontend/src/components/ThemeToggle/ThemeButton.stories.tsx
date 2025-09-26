import { Meta, StoryObj } from '@storybook/react';
import { ButtonTheme } from './ThemeButton';

const meta: Meta<typeof ButtonTheme> = {
  title: 'Components/ButtonTheme',
  component: ButtonTheme,
};

export default meta;

const Template: StoryObj<typeof ButtonTheme> = {
  render: (args) => <ButtonTheme {...args} />,
};

export const LightMode: StoryObj<typeof ButtonTheme> = {
  ...Template,
  args: {
    theme: 'light',
    onClick: () => {},
  },
};

export const DarkMode: StoryObj<typeof ButtonTheme> = {
  ...Template,
  args: {
    theme: 'dark',
    onClick: () => {},
  },
};
