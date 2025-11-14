"use client";

import * as React from "react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoginSubmit?: (email: string, password: string) => void;
  isLoading?: boolean;
}

export const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(
  ({ className, onLoginSubmit, isLoading, ...props }, ref) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onLoginSubmit?.(email, password);
    };

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Button type="button" variant="outline" disabled={isLoading}>
            Google
          </Button>
          <Button type="button" variant="outline" disabled={isLoading}>
            GitHub
          </Button>
        </div>
      </div>
    );
  }
);

LoginForm.displayName = "LoginForm";
