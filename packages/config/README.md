# @nuge/config

Centralized configuration package for the Nuge application. Provides type-safe environment variables and application constants.

## Features

- ✅ **Type-safe environment variables** - Full TypeScript support
- ✅ **Browser/Server separation** - Prevents accidental exposure of secrets
- ✅ **Runtime validation** - Fails fast with helpful error messages
- ✅ **Centralized constants** - All app configuration in one place
- ✅ **Zero dependencies** - Pure TypeScript

## Installation

This package is already part of the monorepo. Just import it:

```typescript
import { publicEnv, ROUTES, MAP_CONFIG } from "@nuge/config";
```

## Usage

### Environment Variables

#### Public Environment (Browser-Safe)

Use `publicEnv` for variables that are safe to expose to the browser:

```typescript
import { publicEnv } from "@nuge/config";

// These are safe to use in client components
const supabaseUrl = publicEnv.SUPABASE_URL;
const mapboxToken = publicEnv.MAPBOX_TOKEN;
const siteUrl = publicEnv.SITE_URL;
```

#### Server Environment (Server-Only)

Use `serverEnv` for sensitive variables that must never reach the browser:

```typescript
import { serverEnv } from "@nuge/config";

// ⚠️ ONLY use in server-side code (API routes, server actions)
const serviceRoleKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
const stripeSecret = serverEnv.STRIPE_SECRET_KEY;
```

**Important**: The `serverEnv` object will throw an error if accessed in browser context!

### Application Constants

#### Routes

```typescript
import { ROUTES } from '@nuge/config';

// Static routes
<Link href={ROUTES.MAP}>View Map</Link>
<Link href={ROUTES.VENDORS}>Browse Vendors</Link>

// Dynamic routes
<Link href={ROUTES.VENDOR_DETAIL(vendorId)}>View Vendor</Link>
<Link href={ROUTES.EVENT_EDIT(eventId)}>Edit Event</Link>
```

#### Map Configuration

```typescript
import { MAP_CONFIG } from "@nuge/config";

const initialViewState = {
  latitude: MAP_CONFIG.DEFAULT_CENTER.latitude,
  longitude: MAP_CONFIG.DEFAULT_CENTER.longitude,
  zoom: MAP_CONFIG.DEFAULT_ZOOM,
};

const searchRadius = MAP_CONFIG.DEFAULT_SEARCH_RADIUS; // 5000 meters
```

#### Pagination

```typescript
import { PAGINATION } from "@nuge/config";

const pageSize = PAGINATION.VENDORS_PER_PAGE; // 12
```

#### Cache Configuration

```typescript
import { CACHE_CONFIG } from "@nuge/config";

const { data } = useQuery({
  queryKey: ["vendors"],
  queryFn: fetchVendors,
  refetchInterval: CACHE_CONFIG.VENDOR_LOCATION_REFETCH, // 30 seconds
  staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME, // 1 minute
});
```

#### Validation Limits

```typescript
import { LIMITS } from "@nuge/config";

const schema = z.object({
  name: z.string().max(LIMITS.MAX_VENDOR_NAME_LENGTH),
  description: z.string().max(LIMITS.MAX_DESCRIPTION_LENGTH),
});
```

#### Messages

```typescript
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@nuge/config";

toast.success(SUCCESS_MESSAGES.VENDOR_CREATED);
toast.error(ERROR_MESSAGES.UNAUTHORIZED);
```

### Utility Functions

#### Environment Checks

```typescript
import { isDevelopment, isProduction, isServer } from "@nuge/config";

if (isDevelopment) {
  console.log("Development mode");
}

if (isServer) {
  // Server-only code
}
```

#### URL Helpers

```typescript
import { getBaseUrl, getFullUrl } from "@nuge/config";

const baseUrl = getBaseUrl(); // "http://localhost:3000" or "https://nuge.app"
const fullUrl = getFullUrl("/vendors/123"); // "http://localhost:3000/vendors/123"
```

#### Environment Validation

```typescript
import { validateEnv } from "@nuge/config";

// Call at app startup to validate all required env vars
try {
  validateEnv();
} catch (error) {
  console.error("Environment validation failed:", error.message);
  process.exit(1);
}
```

## Environment Variables Setup

### Required Variables

Create a `.env.local` file in your project root:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mapbox (required)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token

# App Config (required)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your-redis-token
```

### Variable Naming Convention

- `NEXT_PUBLIC_*` - Exposed to browser, available in client components
- No prefix - Server-only, never sent to browser

## Security Best Practices

### ✅ DO

```typescript
// Client component - use publicEnv
'use client';
import { publicEnv } from '@nuge/config';

export function Map() {
  const mapboxToken = publicEnv.MAPBOX_TOKEN; // ✅ Safe
  return <MapView token={mapboxToken} />;
}
```

```typescript
// Server action - use serverEnv
"use server";
import { serverEnv } from "@nuge/config";

export async function createCustomer() {
  const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY); // ✅ Safe
  // ...
}
```

### ❌ DON'T

```typescript
// Client component - DON'T use serverEnv
'use client';
import { serverEnv } from '@nuge/config';

export function BadComponent() {
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY; // ❌ Will throw error!
  return <div>{key}</div>;
}
```

```typescript
// DON'T hardcode secrets
const STRIPE_KEY = "sk_live_..."; // ❌ Never do this!
```

## API Reference

### Types

```typescript
interface PublicEnv {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  MAPBOX_TOKEN: string;
  SITE_URL: string;
  NODE_ENV: "development" | "production" | "test";
}

interface ServerEnv {
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  UPSTASH_REDIS_URL?: string;
  UPSTASH_REDIS_TOKEN?: string;
}
```

### Constants Exports

- `MAP_CONFIG` - Map defaults and limits
- `PAGINATION` - Page sizes for different resources
- `CACHE_CONFIG` - React Query cache timings
- `LIMITS` - Validation limits and file upload constraints
- `TIME_CONFIG` - Timezone and date format settings
- `SUBSCRIPTION` - Subscription tier names and settings
- `ROUTES` - All application routes
- `FEATURES` - Feature flags
- `EXTERNAL_LINKS` - Social media and support links
- `STATUS` - Status constants for listings and subscriptions
- `ERROR_MESSAGES` - Standard error messages
- `SUCCESS_MESSAGES` - Standard success messages

## Contributing

When adding new environment variables:

1. Add to the appropriate interface (`PublicEnv` or `ServerEnv`) in `env.ts`
2. Add validation in `validateEnv()` if required
3. Update `.env.example` in the root
4. Document in this README

When adding new constants:

1. Add to the appropriate section in `constants.ts`
2. Export from `index.ts`
3. Document in this README

## License

Private - Part of Nuge monorepo
