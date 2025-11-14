# @nuge/ui

Shared UI component library for Nuge applications, built with shadcn/ui components.

## 📦 What's Inside

- **Shadcn UI Components**: Pre-configured shadcn components ready to use
- **Custom Components**: Your custom-built components (Logo, Avatar, HeroWall, etc.)
- **Utilities**: Shared utility functions like `cn()` for class merging
- **Tailwind Configuration**: Pre-configured theme with CSS variables

## 🚀 Setup

### 1. Install Dependencies

From the workspace root:

```bash
pnpm install
```

### 2. Import the CSS in Your Apps

In your app's `globals.css` or main CSS file, import the UI package styles:

```css
@import "@nuge/ui/src/globals.css";

/* Your app-specific styles */
```

Or if you prefer, you can copy the CSS variables from `packages/ui/src/globals.css` to your app's CSS file.

### 3. Configure Tailwind in Your Apps

Update your app's `tailwind.config.js` to include the UI package in the content array:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add this line to scan UI package components
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of config
};
```

## 📖 Usage

### Using Shadcn Components

Import and use shadcn components directly from the UI package:

```tsx
import { Button } from "@nuge/ui";

export default function MyComponent() {
  return <Button variant="default">Click me</Button>;
}
```

### Using Custom Components

```tsx
import { Logo, Avatar, HeroWall } from "@nuge/ui";
```

### Using Utilities

```tsx
import { cn } from "@nuge/ui";

// Merge classes intelligently
const className = cn("base-class", condition && "conditional-class");
```

## 🎨 Adding More Shadcn Components

To add new shadcn components to the UI package:

```bash
cd packages/ui
npx shadcn@latest add <component-name>
```

For example, to add the Input component:

```bash
npx shadcn@latest add input
```

This will:

- Install the component in `src/components/ui/`
- Add any necessary dependencies
- Follow the configuration in `components.json`

After adding a new component, remember to export it in `src/index.ts`:

```ts
export * from "./components/ui/input";
```

## 🛠️ Available Components

### Shadcn Components

- ✅ **Button** - Enhanced with icon-sm, icon-lg sizes
- ✅ **InputOTP** - OTP input component
- ✅ **Dialog** - Modal/Dialog component
- ✅ **Toaster** - Toast notifications with theme support

### Custom Components

- ✅ Logo
- ✅ Avatar
- ✅ HeroWall
- ✅ LoginForm

## 📝 Component Examples

### Button Variants

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes

```tsx
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## 🎯 Best Practices

1. **Always use the `cn()` utility** for conditional class names
2. **Keep components framework-agnostic** where possible
3. **Export all public components** from `src/index.ts`
4. **Document new components** with TypeScript types
5. **Follow shadcn conventions** for UI components

## 🔧 Development

Build the package:

```bash
pnpm build
```

Type check:

```bash
pnpm typecheck
```

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
