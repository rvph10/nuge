# Adding Shadcn Components - Fixed Guide

This guide explains the proper way to add shadcn components to the `@nuge/ui` package after fixing the configuration.

## ✅ Configuration Fixed

The `components.json` and `tsconfig.json` files have been properly configured:

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### tsconfig.json

Added path mappings:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🚀 How to Add Components

### Step 1: Navigate to UI Package

```bash
cd packages/ui
```

### Step 2: Add Component with shadcn CLI

```bash
npx shadcn@latest add <component-name>
```

Examples:

```bash
npx shadcn@latest add dialog      ✅ Working!
npx shadcn@latest add input       ✅ Should work
npx shadcn@latest add card        ✅ Should work
npx shadcn@latest add dropdown-menu  ✅ Should work
```

### Step 3: Fix Imports (Important!)

After adding a component, open the generated file and replace `@/` imports with relative paths:

**Before:**

```tsx
import { cn } from "@/lib/utils";
```

**After:**

```tsx
import { cn } from "../../lib/utils";
```

### Step 4: Export the Component

Add the export to `src/index.ts`:

```ts
export * from "./components/ui/dialog";
```

### Step 5: Install Dependencies (if needed)

Check if new dependencies were added to `package.json` and run:

```bash
pnpm install
```

## 📦 Currently Available Components

### Shadcn Components

- ✅ **Button** - `src/components/ui/button.tsx`
- ✅ **InputOTP** - `src/components/ui/input-otp.tsx`
- ✅ **Dialog** - `src/components/ui/dialog.tsx`

### Usage

```tsx
import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nuge/ui";
```

## 📝 Example: Dialog Component

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@nuge/ui";

export function AlertDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
```

## 🐛 Troubleshooting

### Problem: Component goes to wrong directory (like `@nuge/`)

**Solution:** This was caused by incorrect path configuration in `components.json`. It's now fixed!

### Problem: Validation error "resolvedPaths: Required"

**Solution:** Added proper path mappings to `tsconfig.json` with `baseUrl` and `paths`.

### Problem: Import errors in generated components

**Solution:** Manually change `@/lib/utils` to `../../lib/utils` in the generated files.

### Problem: Missing dependencies

**Solution:** Run `pnpm install` from workspace root after adding new components.

## 🎯 Best Practices

1. **Always navigate to `packages/ui`** before running shadcn commands
2. **Check generated imports** and fix `@/` paths to relative paths
3. **Export new components** in `src/index.ts`
4. **Run `pnpm install`** to install new dependencies
5. **Test the component** in one of your apps before moving on

## 📚 Popular Components to Add

```bash
# Forms
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add label

# Layout
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add tabs

# Feedback
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add progress

# Overlays
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add sheet

# Data Display
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add avatar
```

## ✨ Quick Reference

```bash
# Add component
cd packages/ui
npx shadcn@latest add <component>

# Fix imports (change @/ to ../../)
# Edit src/components/ui/<component>.tsx

# Export component
# Add to src/index.ts

# Install dependencies
cd ../..
pnpm install

# Use in your app
import { Component } from "@nuge/ui";
```

---

**All set!** Your shadcn integration is now properly configured. 🎉

