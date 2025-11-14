# Usage Examples

Complete examples of using `@nuge/ui` components in your apps.

## 📋 Table of Contents

- [Basic Button Usage](#basic-button-usage)
- [LoginForm Component](#loginform-component)
- [Custom Components with Shadcn](#custom-components-with-shadcn)
- [Styling and Theming](#styling-and-theming)

## Basic Button Usage

### Simple Button Example

```tsx
import { Button } from "@nuge/ui";

export default function Page() {
  return (
    <div className="flex gap-4">
      <Button onClick={() => alert("Clicked!")}>Click Me</Button>
    </div>
  );
}
```

### All Button Variants

```tsx
import { Button } from "@nuge/ui";

export default function ButtonShowcase() {
  return (
    <div className="space-y-4 p-8">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex gap-2 items-center">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🎯</Button>
      </div>
    </div>
  );
}
```

### Button with Next.js Link

```tsx
import { Button } from "@nuge/ui";
import Link from "next/link";

export default function Navigation() {
  return (
    <Button asChild>
      <Link href="/dashboard">Go to Dashboard</Link>
    </Button>
  );
}
```

### Button with Loading State

```tsx
"use client";

import { Button } from "@nuge/ui";
import { useState } from "react";

export default function AsyncButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Loading..." : "Fetch Data"}
    </Button>
  );
}
```

## LoginForm Component

### Basic LoginForm

```tsx
"use client";

import { LoginForm } from "@nuge/ui";

export default function LoginPage() {
  const handleLogin = (email: string, password: string) => {
    console.log("Login:", { email, password });
    // Your login logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <LoginForm onLoginSubmit={handleLogin} />
      </div>
    </div>
  );
}
```

### LoginForm with Loading State

```tsx
"use client";

import { LoginForm } from "@nuge/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm onLoginSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
```

## Custom Components with Shadcn

### Creating a Card with Button

```tsx
import { Button, cn } from "@nuge/ui";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  onPurchase: () => void;
}

export function ProductCard({
  title,
  description,
  price,
  onPurchase,
}: ProductCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold">${price}</span>
          <Button onClick={onPurchase}>Purchase</Button>
        </div>
      </div>
    </div>
  );
}
```

### Form with Multiple Buttons

```tsx
"use client";

import { Button } from "@nuge/ui";
import { useState } from "react";

export function ContactForm() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    // Save logic
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Submit"}
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

## Styling and Theming

### Using the `cn()` Utility

```tsx
import { Button, cn } from "@nuge/ui";

interface StatusButtonProps {
  status: "success" | "warning" | "error";
  children: React.ReactNode;
}

export function StatusButton({ status, children }: StatusButtonProps) {
  return (
    <Button
      className={cn(
        // Base styles
        "font-semibold",
        // Conditional styles based on status
        status === "success" && "bg-green-600 hover:bg-green-700",
        status === "warning" && "bg-yellow-600 hover:bg-yellow-700",
        status === "error" && "bg-red-600 hover:bg-red-700"
      )}
    >
      {children}
    </Button>
  );
}
```

### Responsive Button Group

```tsx
import { Button } from "@nuge/ui";

export function ResponsiveActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="default" className="w-full sm:w-auto">
        Primary Action
      </Button>
      <Button variant="outline" className="w-full sm:w-auto">
        Secondary Action
      </Button>
      <Button variant="ghost" className="w-full sm:w-auto">
        Tertiary Action
      </Button>
    </div>
  );
}
```

### Dark Mode Support

All components automatically support dark mode through CSS variables:

```tsx
import { Button } from "@nuge/ui";

export function ThemeDemo() {
  return (
    <div className="space-y-4">
      {/* Light mode (default) */}
      <div className="p-8 bg-background">
        <Button>Light Mode Button</Button>
      </div>

      {/* Dark mode (add 'dark' class to parent) */}
      <div className="dark p-8 bg-background">
        <Button>Dark Mode Button</Button>
      </div>
    </div>
  );
}
```

### Custom Color Button

```tsx
import { Button } from "@nuge/ui";

export function CustomColorButton() {
  return (
    <Button
      variant="outline"
      className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
    >
      Custom Purple
    </Button>
  );
}
```

## Advanced Patterns

### Button with Icon

```tsx
import { Button } from "@nuge/ui";
import { ChevronRight, Download } from "lucide-react";

export function IconButtons() {
  return (
    <div className="flex gap-2">
      <Button>
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>

      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>

      <Button size="icon">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### Button Group

```tsx
import { Button } from "@nuge/ui";

export function ButtonGroup() {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button variant="outline" className="rounded-r-none">
        Left
      </Button>
      <Button variant="outline" className="rounded-none border-x-0">
        Middle
      </Button>
      <Button variant="outline" className="rounded-l-none">
        Right
      </Button>
    </div>
  );
}
```

---

For more examples and component documentation, visit [shadcn/ui](https://ui.shadcn.com).

