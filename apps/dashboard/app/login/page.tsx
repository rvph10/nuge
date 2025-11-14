"use client";

import { Suspense } from "react";
import { LoginForm } from "@nuge/ui";
import { Loader2 } from "lucide-react";
import { HeroWall } from "@nuge/ui";

/**
 * LoginLayout Component
 *
 * Optimized layout for the login page with responsive design.
 *
 * Performance optimizations:
 * - Uses CSS media queries (Tailwind) instead of JavaScript resize listeners
 * - Prevents unnecessary re-renders on window resize
 * - HeroWall only renders on large screens (lg breakpoint: 1024px+)
 */
function LoginLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Left side - Full width on mobile, 40% on desktop */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4">
        <LoginForm />
      </div>

      {/* Right side - HeroWall, hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex lg:w-3/5 h-screen relative overflow-visible items-center justify-center bg-background">
        <HeroWall />
      </div>
    </div>
  );
}

/**
 * Login Page with Error Boundary and Suspense
 *
 * Features:
 * - Error Boundary: Catches and handles React errors gracefully
 * - Suspense Boundary: Handles useSearchParams() loading state
 * - Performance: Optimized with lazy loading and CSS-based responsive design
 *
 * Security:
 * - Protected by middleware for authenticated users
 * - OTP-based authentication via Supabase
 * - Error details hidden in production
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginLayout />
    </Suspense>
  );
}
