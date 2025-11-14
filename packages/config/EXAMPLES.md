# @nuge/config Usage Examples

## Table of Contents

- [Client Components](#client-components)
- [Server Components](#server-components)
- [API Routes](#api-routes)
- [Server Actions](#server-actions)
- [Common Patterns](#common-patterns)

---

## Client Components

### Using Public Environment Variables

```typescript
'use client';

import { publicEnv, MAP_CONFIG } from '@nuge/config';
import { useState } from 'react';

export function VendorMap() {
  const [viewport, setViewport] = useState({
    latitude: MAP_CONFIG.DEFAULT_CENTER.latitude,
    longitude: MAP_CONFIG.DEFAULT_CENTER.longitude,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
  });

  return (
    <Map
      mapboxAccessToken={publicEnv.MAPBOX_TOKEN}
      {...viewport}
      onMove={(evt) => setViewport(evt.viewState)}
    />
  );
}
```

### Using Routes

```typescript
'use client';

import { ROUTES } from '@nuge/config';
import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href={ROUTES.HOME}>Home</Link>
      <Link href={ROUTES.MAP}>Map</Link>
      <Link href={ROUTES.VENDORS}>Vendors</Link>
      <Link href={ROUTES.EVENTS}>Events</Link>
    </nav>
  );
}

export function VendorCard({ vendor }) {
  return (
    <Card>
      <h3>{vendor.name}</h3>
      <Link href={ROUTES.VENDOR_DETAIL(vendor.id)}>View Details</Link>
    </Card>
  );
}
```

### Using Pagination

```typescript
'use client';

import { PAGINATION } from '@nuge/config';
import { useQuery } from '@tanstack/react-query';

export function VendorList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', page],
    queryFn: () => fetchVendors({
      page,
      limit: PAGINATION.VENDORS_PER_PAGE,
    }),
  });

  return (
    <div>
      {data?.vendors.map(vendor => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
      <Pagination
        currentPage={page}
        pageSize={PAGINATION.VENDORS_PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Using Cache Configuration

```typescript
'use client';

import { CACHE_CONFIG } from '@nuge/config';
import { useQuery } from '@tanstack/react-query';

export function LiveVendorLocations() {
  const { data } = useQuery({
    queryKey: ['vendor-locations'],
    queryFn: fetchVendorLocations,
    // Refetch every 30 seconds to get live location updates
    refetchInterval: CACHE_CONFIG.VENDOR_LOCATION_REFETCH,
    staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
  });

  return <VendorMarkers vendors={data} />;
}
```

### Using Messages

```typescript
'use client';

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@nuge/config';
import { toast } from 'sonner';

export function VendorForm() {
  const handleSubmit = async (data) => {
    try {
      await createVendor(data);
      toast.success(SUCCESS_MESSAGES.VENDOR_CREATED);
    } catch (error) {
      toast.error(ERROR_MESSAGES.GENERIC);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

---

## Server Components

### Accessing Public Config

```typescript
import { publicEnv, getBaseUrl } from '@nuge/config';

export default async function VendorPage({ params }) {
  const { id } = params;
  const vendor = await fetchVendor(id);

  // Generate OpenGraph metadata
  const imageUrl = vendor.image_url;
  const canonicalUrl = `${getBaseUrl()}/vendors/${id}`;

  return (
    <>
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <h1>{vendor.name}</h1>
    </>
  );
}
```

---

## API Routes

### Using Server Environment

```typescript
// app/api/vendors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@nuge/api";

export async function POST(request: NextRequest) {
  // Server client automatically uses serverEnv.SUPABASE_SERVICE_ROLE_KEY
  const supabase = getSupabaseServerClient();

  const data = await request.json();

  const { data: vendor, error } = await supabase
    .from("vendors")
    .insert(data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(vendor);
}
```

### Stripe Webhook

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@nuge/config";
import Stripe from "stripe";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
        // Handle subscription created
        break;
      // ...
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
```

---

## Server Actions

### Creating a Vendor (Server Action)

```typescript
"use server";

import { getSupabaseServerClient } from "@nuge/api";
import { SUCCESS_MESSAGES } from "@nuge/config";
import { revalidatePath } from "next/cache";

export async function createVendorAction(formData: FormData) {
  const supabase = getSupabaseServerClient();

  const vendorData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category_id: formData.get("category_id") as string,
  };

  const { data, error } = await supabase
    .from("vendors")
    .insert(vendorData)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/vendors");
  return { success: true, message: SUCCESS_MESSAGES.VENDOR_CREATED, data };
}
```

### Uploading Files

```typescript
"use server";

import { getSupabaseServerClient } from "@nuge/api";
import { LIMITS } from "@nuge/config";

export async function uploadVendorImage(formData: FormData) {
  const file = formData.get("file") as File;

  // Validate file size
  if (file.size > LIMITS.MAX_FILE_SIZE) {
    return { error: "File too large (max 5MB)" };
  }

  // Validate file type
  if (!LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Invalid file type" };
  }

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("vendor-images")
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) {
    return { error: error.message };
  }

  return { success: true, path: data.path };
}
```

---

## Common Patterns

### Environment Check Pattern

```typescript
import { isDevelopment, isProduction } from '@nuge/config';

export function Analytics() {
  // Only load analytics in production
  if (!isProduction) {
    return null;
  }

  return <Script src="https://analytics.example.com/script.js" />;
}

export function DebugPanel() {
  // Only show debug panel in development
  if (!isDevelopment) {
    return null;
  }

  return <div className="debug-panel">{/* Debug info */}</div>;
}
```

### Feature Flag Pattern

```typescript
import { FEATURES } from '@nuge/config';

export function NotificationBell() {
  if (!FEATURES.PUSH_NOTIFICATIONS_ENABLED) {
    return null;
  }

  return <Bell onClick={handleNotifications} />;
}

export function ThemeToggle() {
  if (!FEATURES.DARK_MODE_ENABLED) {
    return null;
  }

  return <DarkModeToggle />;
}
```

### URL Building Pattern

```typescript
import { getFullUrl, ROUTES } from '@nuge/config';

export function VendorShareButton({ vendorId }) {
  const shareUrl = getFullUrl(ROUTES.VENDOR_DETAIL(vendorId));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this vendor!',
        url: shareUrl,
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return <Button onClick={handleShare}>Share</Button>;
}
```

### Validation with Limits

```typescript
import { LIMITS } from "@nuge/config";
import { z } from "zod";

export const vendorSchema = z.object({
  name: z
    .string()
    .min(2, "Name too short")
    .max(LIMITS.MAX_VENDOR_NAME_LENGTH, "Name too long"),
  description: z
    .string()
    .max(LIMITS.MAX_DESCRIPTION_LENGTH, "Description too long")
    .optional(),
  bio: z.string().max(LIMITS.MAX_BIO_LENGTH, "Bio too long").optional(),
});
```

### Status Checks

```typescript
import { STATUS } from '@nuge/config';

export function VendorStatusBadge({ vendor }) {
  const isActive = vendor.status === STATUS.LISTING.ACTIVE;
  const isPending = vendor.status === STATUS.LISTING.PENDING;

  return (
    <Badge variant={isActive ? 'success' : isPending ? 'warning' : 'default'}>
      {vendor.status}
    </Badge>
  );
}

export function SubscriptionStatus({ user }) {
  const isActive = user.subscription_status === STATUS.SUBSCRIPTION.ACTIVE;
  const isCanceled = user.subscription_status === STATUS.SUBSCRIPTION.CANCELED;

  return (
    <div>
      <span>Status: {user.subscription_status}</span>
      {isCanceled && <Alert>Your subscription will end soon</Alert>}
    </div>
  );
}
```

### Error Boundary with Standard Messages

```typescript
'use client';

import { ERROR_MESSAGES } from '@nuge/config';
import { useEffect } from 'react';

export function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{ERROR_MESSAGES.GENERIC}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Testing

### Mocking Config in Tests

```typescript
// __tests__/vendor.test.tsx
import { vi } from "vitest";

vi.mock("@nuge/config", () => ({
  publicEnv: {
    SUPABASE_URL: "http://localhost:54321",
    SUPABASE_ANON_KEY: "test-key",
    MAPBOX_TOKEN: "test-token",
    SITE_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
  ROUTES: {
    VENDORS: "/vendors",
    VENDOR_DETAIL: (id) => `/vendors/${id}`,
  },
}));
```
