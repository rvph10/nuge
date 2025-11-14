/**
 * Environment Configuration
 *
 * This module provides type-safe access to environment variables.
 * It validates required variables at runtime and provides helpful error messages.
 *
 * IMPORTANT:
 * - Variables prefixed with NEXT_PUBLIC_ are exposed to the browser
 * - Other variables are server-only and must never be sent to the client
 */

// ===================================
// Environment Variable Schema
// ===================================

interface PublicEnv {
  /** Supabase project URL - safe to expose to browser */
  SUPABASE_URL: string;
  /** Supabase anonymous key - safe to expose to browser */
  SUPABASE_ANON_KEY: string;
  /** Mapbox access token - safe to expose to browser */
  MAPBOX_TOKEN: string;
  /** Site URL for redirects and canonical URLs */
  SITE_URL: string;
  /** Current environment */
  NODE_ENV: "development" | "production" | "test";
}

interface ServerEnv {
  /** Supabase service role key - NEVER expose to browser */
  SUPABASE_SERVICE_ROLE_KEY: string;
  /** Stripe secret key - NEVER expose to browser */
  STRIPE_SECRET_KEY?: string;
  /** Stripe webhook secret - NEVER expose to browser */
  STRIPE_WEBHOOK_SECRET?: string;
  /** Upstash Redis REST URL - server-only */
  UPSTASH_REDIS_URL?: string;
  /** Upstash Redis REST token - server-only */
  UPSTASH_REDIS_TOKEN?: string;
}

// ===================================
// Environment Validation
// ===================================

class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvError";
  }
}

// Explicit client-side env mapping so Next.js can statically inject values.
// NOTE: These must use direct property access so Next can replace them at build time.
const clientPublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
} as const;

function getEnvVar(key: string, defaultValue?: string): string {
  const isBrowser = typeof window !== "undefined";

  // In browser, only allow NEXT_PUBLIC_ prefixed variables
  if (isBrowser && !key.startsWith("NEXT_PUBLIC_")) {
    throw new EnvError(
      `Attempted to access server-only environment variable "${key}" in browser context. ` +
        "This is a security risk. Use public environment variables instead."
    );
  }

  // Use a statically analyzable map in the browser so Next.js includes the vars
  const value = isBrowser
    ? (clientPublicEnv as Record<string, string | undefined>)[key] ||
      defaultValue
    : process.env[key] || defaultValue;

  if (!value) {
    throw new EnvError(
      `Missing required environment variable: ${key}\n` +
        `Please add it to your .env.local file.`
    );
  }

  return value;
}

function getOptionalEnvVar(
  key: string,
  defaultValue?: string
): string | undefined {
  try {
    return getEnvVar(key, defaultValue);
  } catch {
    return undefined;
  }
}

// ===================================
// Public Environment (Browser-safe)
// ===================================

/**
 * Public environment variables that are safe to expose to the browser.
 * These are injected at build time and can be accessed in client components.
 * Using getters to ensure environment variables are read lazily, after Next.js has loaded them.
 */
export const publicEnv: PublicEnv = {
  get SUPABASE_URL() {
    return getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  },
  get SUPABASE_ANON_KEY() {
    return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get MAPBOX_TOKEN() {
    return getEnvVar("NEXT_PUBLIC_MAPBOX_TOKEN");
  },
  get SITE_URL() {
    return getEnvVar("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  },
  get NODE_ENV() {
    return (process.env.NODE_ENV || "development") as PublicEnv["NODE_ENV"];
  },
};

// ===================================
// Server Environment (Server-only)
// ===================================

/**
 * Server-only environment variables.
 * These contain sensitive data and must NEVER be sent to the browser.
 *
 * Usage: Import this only in server-side code (API routes, server actions, etc.)
 * DO NOT import in client components!
 * Using getters to ensure environment variables are read lazily, after Next.js has loaded them.
 */
export const serverEnv: ServerEnv = {
  get SUPABASE_SERVICE_ROLE_KEY() {
    return getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
  },
  get STRIPE_SECRET_KEY() {
    return getOptionalEnvVar("STRIPE_SECRET_KEY");
  },
  get STRIPE_WEBHOOK_SECRET() {
    return getOptionalEnvVar("STRIPE_WEBHOOK_SECRET");
  },
  get UPSTASH_REDIS_URL() {
    return getOptionalEnvVar("UPSTASH_REDIS_URL");
  },
  get UPSTASH_REDIS_TOKEN() {
    return getOptionalEnvVar("UPSTASH_REDIS_TOKEN");
  },
};

// ===================================
// Utility Functions
// ===================================

/**
 * Check if we're running on the server
 */
export const isServer = typeof window === "undefined";

/**
 * Check if we're in development mode
 */
export const isDevelopment = publicEnv.NODE_ENV === "development";

/**
 * Check if we're in production mode
 */
export const isProduction = publicEnv.NODE_ENV === "production";

/**
 * Check if we're in test mode
 */
export const isTest = publicEnv.NODE_ENV === "test";

/**
 * Get the base URL for the application
 */
export const getBaseUrl = (): string => {
  return publicEnv.SITE_URL;
};

/**
 * Get the full URL for a given path
 */
export const getFullUrl = (path: string): string => {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// ===================================
// Environment Validation
// ===================================

/**
 * Validate all required environment variables are present.
 * Call this at application startup to fail fast if config is missing.
 */
export function validateEnv(): void {
  const errors: string[] = [];

  // Validate public env
  try {
    if (!publicEnv.SUPABASE_URL) {
      errors.push("NEXT_PUBLIC_SUPABASE_URL is required");
    }
    if (!publicEnv.SUPABASE_ANON_KEY) {
      errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
    }
    if (!publicEnv.MAPBOX_TOKEN) {
      errors.push("NEXT_PUBLIC_MAPBOX_TOKEN is required");
    }
  } catch (error) {
    if (error instanceof EnvError) {
      errors.push(error.message);
    }
  }

  // Validate server env (only on server)
  if (isServer) {
    try {
      if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
        errors.push(
          "SUPABASE_SERVICE_ROLE_KEY is required for server operations"
        );
      }
    } catch (error) {
      if (error instanceof EnvError) {
        errors.push(error.message);
      }
    }
  }

  if (errors.length > 0) {
    throw new EnvError(
      "Environment validation failed:\n" +
        errors.map((e) => `  - ${e}`).join("\n") +
        "\n\nPlease check your .env.local file."
    );
  }
}

// ===================================
// Type Exports
// ===================================

export type { PublicEnv, ServerEnv };
