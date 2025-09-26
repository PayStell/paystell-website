import '../src/app/globals.css';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'background',
      values: [
        {
          name: 'card background',
          value: 'hsl(var(--card))',
        },
        {
          name: 'background',
          value: 'hsl(var(--background))',
        },
      ],
    },
  },

  tags: ['autodocs'],
};

export default preview;
