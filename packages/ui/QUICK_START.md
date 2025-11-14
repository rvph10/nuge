# 🚀 Quick Start - Shadcn in @nuge/ui

Get started with shared shadcn components in 3 minutes.

## ✅ Step 1: Install Dependencies

```bash
# From workspace root
pnpm install
```

## ✅ Step 2: Update Your App's Tailwind Config

**File:** `apps/dashboard/tailwind.config.js` (or `apps/web/tailwind.config.js`)

Add the UI package path to the `content` array:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // ← Add this
  ],
  // ... rest of config
};
```

## ✅ Step 3: Import Shared CSS

**File:** `apps/dashboard/app/globals.css` (or `apps/web/app/globals.css`)

Add at the top:

```css
@import "@nuge/ui/src/globals.css";

/* Your existing styles below */
```

## ✅ Step 4: Use Components

```tsx
import { Button, LoginForm, cn } from "@nuge/ui";

export default function Page() {
  return (
    <div>
      <Button>Click Me</Button>
    </div>
  );
}
```

## 🎨 Add More Shadcn Components

```bash
cd packages/ui
npx shadcn@latest add input      # Add Input component
npx shadcn@latest add card       # Add Card component
npx shadcn@latest add dialog     # Add Dialog component
```

Then export in `packages/ui/src/index.ts`:

```ts
export * from "./components/ui/input";
export * from "./components/ui/card";
export * from "./components/ui/dialog";
```

## 📚 What's Available

```tsx
import {
  // Shadcn Components
  Button,

  // Custom Components
  Logo,
  Avatar,
  HeroWall,
  LoginForm,

  // Utilities
  cn,
} from "@nuge/ui";
```

## 🎯 Common Patterns

### Button with variants

```tsx
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Using cn() for conditional styles

```tsx
<div className={cn("base-class", isActive && "active-class")} />
```

### LoginForm with handler

```tsx
<LoginForm
  onLoginSubmit={(email, password) => {
    console.log({ email, password });
  }}
  isLoading={false}
/>
```

## 🔥 Next Steps

1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. See [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for code examples
3. Check [README.md](./README.md) for complete documentation

---

**Need help?** Check if:

- ✓ You ran `pnpm install`
- ✓ Tailwind config includes UI package path
- ✓ CSS is imported
- ✓ Dev server is restarted

