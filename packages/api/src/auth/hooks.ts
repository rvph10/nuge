// React hooks for authentication
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@nuge/types";
import * as authService from "./auth-service";

// ===================================
// Query Keys
// ===================================

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: (userId: string) => [...authKeys.all, "profile", userId] as const,
  roles: (userId: string) => [...authKeys.all, "roles", userId] as const,
};

// ===================================
// Session & User Queries
// ===================================

/**
 * Get current session
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { session, error } = await authService.getSession();
      if (error) throw error;
      return session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Get current authenticated user
 */
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const { user, error } = await authService.getCurrentUser();
      if (error) throw error;
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Get user profile (extended data from users table)
 */
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: authKeys.profile(userId || ""),
    queryFn: async () => {
      if (!userId) return null;
      const { profile, error } = await authService.getUserProfile(userId);
      if (error) throw error;
      return profile;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get user roles
 */
export function useUserRoles(userId?: string) {
  return useQuery({
    queryKey: authKeys.roles(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      const { roles, error } = await authService.getUserRoles(userId);
      if (error) throw error;
      return roles;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// ===================================
// OTP Authentication Mutations
// ===================================

/**
 * Sign in with OTP (magic link or code)
 */
export function useSignInWithOTP() {
  return useMutation({
    mutationFn: authService.signInWithOTP,
    onError: (error) => {
      console.error("OTP sign in error:", error);
    },
  });
}

/**
 * Verify OTP code
 */
export function useVerifyOTP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: (data) => {
      if (data.user && data.session) {
        // Invalidate auth queries to refetch with new session
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    },
    onError: (error) => {
      console.error("OTP verification error:", error);
    },
  });
}

/**
 * Resend OTP code
 */
export function useResendOTP() {
  return useMutation({
    mutationFn: authService.resendOTP,
  });
}

// ===================================
// Password Authentication Mutations
// ===================================

/**
 * Sign in with email and password
 */
export function useSignInWithPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signInWithPassword,
    onSuccess: (data) => {
      if (data.user && data.session) {
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    },
    onError: (error) => {
      console.error("Password sign in error:", error);
    },
  });
}

/**
 * Sign up with email and password
 */
export function useSignUpWithPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signUpWithPassword,
    onSuccess: (data) => {
      if (data.user && data.session) {
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    },
    onError: (error) => {
      console.error("Password sign up error:", error);
    },
  });
}

// ===================================
// Session Management Mutations
// ===================================

/**
 * Sign out
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      // Clear all cached queries on sign out
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });
}

/**
 * Refresh session
 */
export function useRefreshSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.refreshSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

// ===================================
// Profile Management Mutations
// ===================================

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: authService.UpdateProfileParams;
    }) => authService.updateUserProfile(userId, updates),
    onSuccess: (data, variables) => {
      if (data.profile) {
        queryClient.invalidateQueries({
          queryKey: authKeys.profile(variables.userId),
        });
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
    },
  });
}

/**
 * Update email
 */
export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}

// ===================================
// Password Reset Mutations
// ===================================

/**
 * Send password reset email
 */
export function useSendPasswordReset() {
  return useMutation({
    mutationFn: authService.sendPasswordResetEmail,
  });
}

/**
 * Update password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: authService.updatePassword,
  });
}

// ===================================
// Role Management Mutations
// ===================================

/**
 * Become a creator (add vendor/organizer role)
 */
export function useBecomeCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.becomeCreator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Check if user has a specific role
 */
export function useHasRole(userId?: string, role?: string) {
  return useQuery({
    queryKey: [...authKeys.roles(userId || ""), role],
    queryFn: async () => {
      if (!userId || !role) return false;
      const { hasRole, error } = await authService.userHasRole(userId, role);
      if (error) throw error;
      return hasRole;
    },
    enabled: !!userId && !!role,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Check if user can access a feature
 */
export function useCanAccessFeature(userId?: string, featureName?: string) {
  return useQuery({
    queryKey: [...authKeys.all, "feature", userId, featureName],
    queryFn: async () => {
      if (!userId || !featureName) return false;
      const { canAccess, error } = await authService.canAccessFeature(
        userId,
        featureName
      );
      if (error) throw error;
      return canAccess;
    },
    enabled: !!userId && !!featureName,
    staleTime: 5 * 60 * 1000,
  });
}

// ===================================
// Convenience Hooks
// ===================================

/**
 * Get complete auth state (user + profile + roles)
 */
export function useAuth() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile(
    user?.id
  );
  const { data: roles, isLoading: isRolesLoading } = useUserRoles(user?.id);

  return {
    user,
    profile,
    roles,
    isLoading: isUserLoading || isProfileLoading || isRolesLoading,
    isAuthenticated: !!user,
  };
}
