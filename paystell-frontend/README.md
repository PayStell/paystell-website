# Project Frontend

## Requirements

- Node.js
- npm or yarn

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies

- Next.js 14
- TypeScript
- TailwindCSS
- Shadcn/UI (Radix UI integration)
- Class Variance Authority
- Lucide Icons

## Dark Mode Usage and Implementation

This guide explains how to implement dark mode in your project using Tailwind CSS and how to add new colors that adapt to both light and dark themes.

---

### Adding a New Color

#### 1. Define a Color in `globals.css`

In `src/app/globals.css`, define the colors for both light (`:root`) and dark (`.dark`) modes.

Example for the `background` color:

```css
:root {
    --background: 210,8.33%,95.29%;
...
}

.dark {
   --background: 224 28.3% 10.39%;
...
}
```

The color background is `210,8.33%,95.29%` in **light mode**, and `224 28.3% 10.39%` in **dark mode**

---

#### 2. Add the Color to `tailwind.config.ts`

To use the new color in Tailwind, add it inside the `colors` section:

```ts
theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
      }
    }
}
```

---

### Applying Colors to Elements

You can now use the `background` color dynamically based on the selected theme.

```jsx
<div className="bg-background">This div has a dynamic background</div>
<div className="text-background">This text adapts to the theme</div>
```

The `background` color will automatically switch between light and dark mode.

---

### Storybook Dark Mode Support

To view components in different themes within Storybook use the global theme switcher in Storybook to toggle between light and dark mode.
You can also preview your components with different background colors. To customize the available backgrounds, modify the background options in `.storybook/preview.ts` if needed:

```ts
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
```

---

#### Video Demonstration

Watch this video to see the global theme switcher and background options in the storybook:

---
