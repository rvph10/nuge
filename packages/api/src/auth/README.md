# Authentication with OTP

This module provides a complete authentication system using Supabase with OTP (One-Time Password) support.

## Features

- ✅ **OTP Authentication** (Magic Links & 6-digit codes)
- ✅ **Password Authentication** (Optional)
- ✅ **Session Management**
- ✅ **User Profiles** (Extended data in `users` table)
- ✅ **Role Management** (customer, vendor, organizer, admin)
- ✅ **Feature Access Control** (Based on subscription tier)
- ✅ **React Hooks** (TanStack Query integration)
- ✅ **Context Provider** (Global auth state)

---

## Quick Start

### 1. Wrap your app with AuthProvider

```tsx
// app/layout.tsx or _app.tsx
import { AuthProvider } from "@nuge/api";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Use the auth context in components

```tsx
"use client";

import { useAuthContext } from "@nuge/api";

export function UserMenu() {
  const { user, profile, isAuthenticated, signOut } = useAuthContext();

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <div>
      <p>Welcome, {profile?.display_name || user?.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

---

## OTP Authentication Flow

### Sign In with OTP (Recommended)

```tsx
"use client";

import { useState } from "react";
import { useSignInWithOTP, useVerifyOTP } from "@nuge/api";
import { requestOTPSchema, verifyOTPSchema } from "@nuge/validation";

export function OTPSignIn() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");

  const signInMutation = useSignInWithOTP();
  const verifyMutation = useVerifyOTP();

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    const result = requestOTPSchema.safeParse({ email });
    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    // Request OTP
    const { error } = await signInMutation.mutateAsync({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      setStep("verify");
      alert("Check your email for the 6-digit code!");
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    const result = verifyOTPSchema.safeParse({ email, token: otp });
    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    // Verify OTP
    const { error } = await verifyMutation.mutateAsync({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Successfully signed in!");
      // User will be redirected automatically
    }
  }

  if (step === "verify") {
    return (
      <form onSubmit={handleVerifyOTP}>
        <h2>Enter Code</h2>
        <p>We sent a 6-digit code to {email}</p>
        <input
          type="text"
          placeholder="000000"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" disabled={verifyMutation.isPending}>
          Verify
        </button>
        <button type="button" onClick={() => setStep("email")}>
          Back
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequestOTP}>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={signInMutation.isPending}>
        Send Code
      </button>
    </form>
  );
}
```

---

## Using Auth Hooks

### Get current user

```tsx
import { useUser, useUserProfile } from "@nuge/api";

export function ProfilePage() {
  const { data: user } = useUser();
  const { data: profile } = useUserProfile(user?.id);

  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <h1>{profile?.display_name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Check user roles

```tsx
import { useUserRoles, useHasRole } from "@nuge/api";

export function VendorDashboard() {
  const { data: user } = useUser();
  const { data: isVendor } = useHasRole(user?.id, "vendor");

  if (!isVendor) {
    return <div>You need to be a vendor to access this page</div>;
  }

  return <div>Vendor Dashboard Content</div>;
}
```

### Update profile

```tsx
import { useUpdateProfile } from "@nuge/api";

export function EditProfile() {
  const { data: user } = useUser();
  const updateMutation = useUpdateProfile();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    await updateMutation.mutateAsync({
      userId: user!.id,
      updates: {
        display_name: formData.get("name") as string,
        bio: formData.get("bio") as string,
      },
    });

    alert("Profile updated!");
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

### Become a creator

```tsx
import { useBecomeCreator } from "@nuge/api";

export function BecomeCreatorButton() {
  const mutation = useBecomeCreator();

  async function handleClick() {
    const { error } = await mutation.mutateAsync();
    if (error) {
      alert(error.message);
    } else {
      alert("You are now a creator! You can create vendors and events.");
    }
  }

  return (
    <button onClick={handleClick} disabled={mutation.isPending}>
      Become a Creator
    </button>
  );
}
```

---

## Direct Service Usage (Without Hooks)

If you need to call auth functions outside of React components:

```ts
import * as authService from "@nuge/api";

// Sign in with OTP
const { error } = await authService.signInWithOTP({
  email: "user@example.com",
});

// Verify OTP
const {
  user,
  session,
  error: verifyError,
} = await authService.verifyOTP({
  email: "user@example.com",
  token: "123456",
  type: "email",
});

// Get current session
const { session } = await authService.getSession();

// Sign out
await authService.signOut();
```

---

## Environment Variables

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Supabase Configuration

### Enable OTP in Supabase Dashboard

1. Go to **Authentication** → **Email Templates**
2. Choose **Magic Link** template
3. Customize the email content
4. Enable **"Enable email confirmations"** if needed

### OTP Code Settings

By default, Supabase sends a 6-digit code. You can configure:

- Code expiration time (default: 1 hour)
- Email template styling
- Magic link vs. OTP code preference

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Set proper CORS policies** in Supabase dashboard
3. **Enable RLS (Row Level Security)** on all tables
4. **Never expose service role key** to client
5. **Use short-lived tokens** (refresh regularly)
6. **Validate user input** with Zod schemas

---

## Troubleshooting

### OTP not received?

- Check spam folder
- Verify email is correct
- Check Supabase logs in dashboard
- Ensure email provider is configured

### Session not persisting?

- Check browser localStorage
- Verify `persistSession: true` in client config
- Check cookie settings for server-side

### Type errors?

- Ensure `@nuge/types` is up to date
- Run `npx supabase gen types typescript` to regenerate types
- Clear TypeScript cache: `rm -rf node_modules/.cache`

---

## Next Steps

- Create protected route components
- Implement role-based access control
- Add social auth providers (Google, GitHub, etc.)
- Set up email templates in Supabase
- Add phone number authentication
