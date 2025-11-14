// Supabase client configuration
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@nuge/types";
import { publicEnv, serverEnv, isServer } from "@nuge/config";

// Export Database type for use in other files
export type { Database };

// Typed Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>;

let supabaseInstance: TypedSupabaseClient | null = null;

/**
 * Get the Supabase client instance (singleton pattern)
 * This is safe to use in browser environments
 */
export function getSupabaseClient(): TypedSupabaseClient {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance using config
  const url = publicEnv.SUPABASE_URL;
  const key = publicEnv.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  supabaseInstance = createClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
}

/**
 * For server-side usage (Next.js API routes, Server Actions, etc.)
 * Uses service role key for admin operations
 * WARNING: Never expose this client to the browser!
 */
export function getSupabaseServerClient(): TypedSupabaseClient {
  if (!isServer) {
    throw new Error(
      "getSupabaseServerClient() called in browser context. " +
        "This client uses the service role key and must only be used on the server."
    );
  }

  const url = publicEnv.SUPABASE_URL;
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase server configuration");
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Create a Supabase client for Server Components (App Router)
 * This should be used in Next.js Server Components
 */
export function createServerComponentClient(): TypedSupabaseClient {
  // For now, just use the anon key client
  // In production, you'd use cookies() to maintain session
  return getSupabaseClient();
}
