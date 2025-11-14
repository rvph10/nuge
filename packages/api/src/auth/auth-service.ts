// Authentication service with OTP support
import type {
  User as SupabaseUser,
  Session,
  AuthError,
} from "@supabase/supabase-js";
import type { User } from "@nuge/types";
import { getSupabaseClient } from "../supabase";

// ===================================
// Types
// ===================================

export interface AuthResponse {
  user: SupabaseUser | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignInWithOTPParams {
  email: string;
  options?: {
    shouldCreateUser?: boolean; // Create user if doesn't exist
    data?: {
      display_name?: string;
    };
  };
}

export interface VerifyOTPParams {
  email: string;
  token: string;
  type: "email";
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface SignUpWithPasswordParams {
  email: string;
  password: string;
  display_name: string;
}

export interface UpdateProfileParams {
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
}

// ===================================
// OTP Authentication
// ===================================

/**
 * Send a magic link / OTP code to user's email
 * User will receive an email with a link or 6-digit code
 */
export async function signInWithOTP(
  params: SignInWithOTPParams
): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: params.email,
    options: {
      shouldCreateUser: params.options?.shouldCreateUser ?? true,
      data: params.options?.data,
      // Email redirect URL (for magic links)
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  return { error };
}

/**
 * Verify OTP code sent to user's email
 * @param params - Email, token (6-digit code), and type
 */
export async function verifyOTP(
  params: VerifyOTPParams
): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email: params.email,
    token: params.token,
    type: params.type,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Resend OTP code to user's email
 */
export async function resendOTP(
  email: string
): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  return { error };
}

// ===================================
// Password Authentication (Optional)
// ===================================

/**
 * Sign in with email and password
 * Note: You may want to use OTP exclusively for better UX
 */
export async function signInWithPassword(
  params: SignInWithPasswordParams
): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign up with email and password
 */
export async function signUpWithPassword(
  params: SignUpWithPasswordParams
): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        display_name: params.display_name,
      },
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

// ===================================
// Session Management
// ===================================

/**
 * Get current session
 */
export async function getSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  return {
    session: data.session,
    error,
  };
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<{
  user: SupabaseUser | null;
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  return {
    user: data.user,
    error,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  return { error };
}

/**
 * Refresh the current session
 */
export async function refreshSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.refreshSession();

  return {
    session: data.session,
    error,
  };
}

// ===================================
// User Profile Management
// ===================================

/**
 * Get user profile from users table
 * This fetches the extended profile data beyond auth.users
 */
export async function getUserProfile(
  userId: string
): Promise<{ profile: User | null; error: Error | null }> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error as Error };
  }
}

/**
 * Update user profile in users table
 */
export async function updateUserProfile(
  userId: string,
  updates: UpdateProfileParams
): Promise<{ profile: User | null; error: Error | null }> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error as Error };
  }
}

/**
 * Update user email
 */
export async function updateEmail(
  newEmail: string
): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  return { error };
}

// ===================================
// Password Reset (if using password auth)
// ===================================

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  return { error };
}

/**
 * Update password (must be called when user is authenticated)
 */
export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error };
}

// ===================================
// Auth State Listener
// ===================================

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
): () => void {
  const supabase = getSupabaseClient();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  return () => {
    subscription.unsubscribe();
  };
}

// ===================================
// Role Management
// ===================================

/**
 * Get user roles from database
 */
export async function getUserRoles(
  userId: string
): Promise<{ roles: string[]; error: Error | null }> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.rpc("get_user_roles", {
      p_user_id: userId,
    });

    if (error) throw error;

    return { roles: data || [], error: null };
  } catch (error) {
    return { roles: [], error: error as Error };
  }
}

/**
 * Check if user has a specific role
 */
export async function userHasRole(
  userId: string,
  role: string
): Promise<{ hasRole: boolean; error: Error | null }> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.rpc("user_has_role", {
      p_user_id: userId,
      p_role: role,
    });

    if (error) throw error;

    return { hasRole: data || false, error: null };
  } catch (error) {
    return { hasRole: false, error: error as Error };
  }
}

/**
 * Become a creator (vendor or organizer)
 * This calls the database function to add the role
 */
export async function becomeCreator(): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.rpc("become_creator");

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

// ===================================
// Feature Access
// ===================================

/**
 * Check if user can access a feature based on their subscription
 */
export async function canAccessFeature(
  userId: string,
  featureName: string
): Promise<{ canAccess: boolean; error: Error | null }> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.rpc("can_user_access_feature", {
      p_user_id: userId,
      p_feature_name: featureName,
    });

    if (error) throw error;

    return { canAccess: data || false, error: null };
  } catch (error) {
    return { canAccess: false, error: error as Error };
  }
}
