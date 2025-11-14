# Quick Setup Guide for Shadcn Components in @nuge/ui

This guide will help you integrate the shared shadcn components from `@nuge/ui` into your apps.

## 🎯 Steps to Use Shared Shadcn Components

### Step 1: Install Dependencies

Run from your workspace root:

```bash
pnpm install
```

### Step 2: Import Shared CSS

Choose one of these methods for each app:

#### Method A: Import in your app's CSS (Recommended)

In `apps/dashboard/app/globals.css` or `apps/web/app/globals.css`:

```css
/* Import shared UI styles */
@import "@nuge/ui/src/globals.css";

/* Your existing styles below */
```

#### Method B: Copy CSS Variables

Copy the CSS variables from `packages/ui/src/globals.css` into your app's `globals.css` file.

### Step 3: Update Tailwind Config

In each app's `tailwind.config.js` or `tailwind.config.ts`, add the UI package to the content array:

**For apps/dashboard/tailwind.config.js:**

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add this line:
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};
```

**For apps/web/tailwind.config.js:**

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add this line:
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};
```

### Step 4: Use Components

Now you can import and use components from `@nuge/ui`:

```tsx
import { Button, cn } from "@nuge/ui";

export default function LoginPage() {
  return (
    <div className="flex gap-4">
      <Button variant="default">Sign In</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}
```

## 📦 Adding More Shadcn Components

When you need a new shadcn component:

```bash
# Navigate to the UI package
cd packages/ui

# Add the component (e.g., input, card, dialog, etc.)
npx shadcn@latest add input
```

Then export it in `packages/ui/src/index.ts`:

```ts
export * from "./components/ui/input";
```

## 🎨 Available Components

### From @nuge/ui:

```tsx
import {
  // Shadcn Components
  Button,

  // Custom Components
  Logo,
  Avatar,
  HeroWall,

  // Utilities
  cn,
} from "@nuge/ui";
```

### Button Examples:

```tsx
// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🚀</Button>

// With asChild (for Next.js Link, etc.)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## 🔧 Common Patterns

### Conditional Classes with `cn()`

```tsx
import { cn } from "@nuge/ui";

function MyComponent({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn(
        "base-class p-4 rounded",
        isActive && "bg-blue-500 text-white",
        !isActive && "bg-gray-100"
      )}
    >
      Content
    </div>
  );
}
```

### Extending Button Styles

```tsx
import { Button } from "@nuge/ui";

<Button
  variant="outline"
  className="border-2 border-purple-500 hover:bg-purple-50"
>
  Custom Styled
</Button>;
```

## 🚨 Troubleshooting

### Components not styled properly?

- Make sure you've imported the CSS (Step 2)
- Check that your Tailwind config includes the UI package path (Step 3)
- Run `pnpm install` from workspace root

### TypeScript errors?

- Ensure `@nuge/ui` is in your app's dependencies
- Run `pnpm typecheck` in the UI package
- Check that TypeScript can resolve the import paths

### Hot reload not working?

- Restart your dev server after changing Tailwind config
- Clear Next.js cache: `rm -rf .next`

## 📚 Next Steps

1. **Add more components**: Use `npx shadcn@latest add <component>`
2. **Customize theme**: Edit `packages/ui/src/globals.css` CSS variables
3. **Create custom components**: Add them to `packages/ui/src/components/`
4. **Share utilities**: Add helper functions to `packages/ui/src/lib/`

## 💡 Tips

- Always use the shared `cn()` utility for class merging
- Keep the UI package focused on reusable components
- Document component props with TypeScript
- Test components in both light and dark mode
- Consider creating a Storybook for component preview

---

For more information, see the [main README](./README.md) or visit [shadcn/ui documentation](https://ui.shadcn.com).

