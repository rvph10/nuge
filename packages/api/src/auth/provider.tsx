// Auth Context Provider for React apps
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import type { User } from "@nuge/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabase";
import * as authService from "./auth-service";

// ===================================
// Types
// ===================================

export interface AuthContextValue {
  // Auth state
  user: SupabaseUser | null;
  session: Session | null;
  profile: User | null;
  roles: string[];

  // Loading states
  isLoading: boolean;
  isAuthenticated: boolean;

  // Helper methods
  hasRole: (role: string) => boolean;
  canAccessFeature: (featureName: string) => Promise<boolean>;

  // Auth methods (optional - you can also use hooks directly)
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ===================================
// Context
// ===================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ===================================
// Provider Props
// ===================================

export interface AuthProviderProps {
  children: ReactNode;
  /**
   * Optional QueryClient for TanStack Query
   * If not provided, a default one will be created
   */
  queryClient?: QueryClient;
}

// ===================================
// Auth Provider
// ===================================

export function AuthProvider({
  children,
  queryClient: providedQueryClient,
}: AuthProviderProps) {
  // State
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create QueryClient if not provided
  const [queryClient] = useState(
    () =>
      providedQueryClient ||
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  // ===================================
  // Initialize auth state
  // ===================================

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Get initial session
        const { session: currentSession } = await authService.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Fetch profile and roles
          await Promise.all([
            fetchProfile(currentSession.user.id),
            fetchRoles(currentSession.user.id),
          ]);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================
  // Listen to auth changes
  // ===================================

  useEffect(() => {
    const supabase = getSupabaseClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);

      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        // User signed in - fetch profile and roles
        await Promise.all([
          fetchProfile(newSession.user.id),
          fetchRoles(newSession.user.id),
        ]);
      } else {
        // User signed out - clear state
        setProfile(null);
        setRoles([]);
      }

      // Handle specific events
      if (event === "SIGNED_OUT") {
        // Clear query cache on sign out
        queryClient.clear();
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // ===================================
  // Helper functions
  // ===================================

  async function fetchProfile(userId: string) {
    try {
      const { profile: userProfile } = await authService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function fetchRoles(userId: string) {
    try {
      const { roles: userRoles } = await authService.getUserRoles(userId);
      setRoles(userRoles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const canAccessFeature = async (featureName: string): Promise<boolean> => {
    if (!user) return false;
    const { canAccess } = await authService.canAccessFeature(
      user.id,
      featureName
    );
    return canAccess;
  };

  const handleSignOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
    // State will be cleared by onAuthStateChange listener
  };

  const handleRefreshSession = async () => {
    const { session: newSession } = await authService.refreshSession();
    if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
    }
  };

  // ===================================
  // Context value
  // ===================================

  const value: AuthContextValue = {
    user,
    session,
    profile,
    roles,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    canAccessFeature,
    signOut: handleSignOut,
    refreshSession: handleRefreshSession,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
}

// ===================================
// Hook to use auth context
// ===================================
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}

// ===================================
// Convenience exports
// ===================================

export { AuthContext };
