# Architecture Documentation

## Overview

Nuge is a real-time location platform connecting mobile vendors and event organizers with their community. Built as a monorepo with shared code between web and mobile applications.

## Tech Stack at a Glance

| Layer        | Technology                      | Why                                                  |
| ------------ | ------------------------------- | ---------------------------------------------------- |
| **Web**      | Next.js 16 (LTS)                | Server components, API routes, SEO, stability        |
| **Mobile**   | Expo (React Native)             | Fast development, OTA updates, native features       |
| **Database** | Supabase (PostgreSQL + PostGIS) | Geospatial queries, auth, realtime, storage built-in |
| **Caching**  | Upstash Redis                   | Serverless Redis, perfect for Vercel edge            |
| **Monorepo** | Turborepo                       | Share code between web/mobile, faster builds         |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
├──────────────────────┬──────────────────────────────────┤
│   Web (Next.js 16)   │   Mobile (Expo/React Native)    │
│  - Mapbox GL JS      │   - React Native Mapbox         │
│  - TanStack Query    │   - TanStack Query              │
│  - Zustand           │   - Zustand                     │
└──────────────────────┴──────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Shared Packages (@nuge/*)                   │
│  - types: TypeScript definitions                        │
│  - validation: Zod schemas                              │
│  - api: Supabase client & queries                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend Services                        │
├──────────────────────┬──────────────────────────────────┤
│  Next.js API Routes  │   Supabase Cloud                 │
│  - Custom logic      │   - PostgreSQL + PostGIS         │
│  - Redis caching     │   - Auth (email, OAuth)          │
│  - Webhooks          │   - Storage (images)             │
│                      │   - Realtime subscriptions       │
└──────────────────────┴──────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Infrastructure                            │
│  - Vercel (web hosting)                                 │
│  - Upstash Redis (caching)                              │
│  - Supabase (database: yynydcuzvqlniyqwafqo)           │
│  - Expo EAS (mobile builds & OTA updates)               │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Web (Next.js 16)

**Key Features:**

- App Router with Server Components (default)
- API Routes for custom backend logic
- SEO-optimized pages for vendor/event discovery
- Progressive Web App (PWA) capabilities

**Dependencies:**

```json
{
  "core": ["next@16", "react@19", "typescript"],
  "styling": ["tailwindcss@4"],
  "maps": ["mapbox-gl", "react-map-gl"],
  "state": ["zustand"],
  "data": ["@tanstack/react-query", "@supabase/supabase-js"],
  "forms": ["react-hook-form", "zod"],
  "testing": ["vitest", "@playwright/test"]
}
```

### Mobile (Expo)

**Key Features:**

- Expo Router for navigation
- Native GPS access for vendor location updates
- Push notifications for nearby vendors/events
- OTA updates without app store approval

**Dependencies:**

```json
{
  "core": ["expo", "react-native"],
  "navigation": ["expo-router"],
  "maps": ["react-native-mapbox-gl"],
  "state": ["zustand"],
  "data": ["@tanstack/react-query", "@supabase/supabase-js"],
  "native": ["expo-location", "expo-notifications"],
  "testing": ["jest", "@testing-library/react-native"]
}
```

---

## Backend Architecture

### Supabase (Primary Backend)

**Database: PostgreSQL + PostGIS**

- PostGIS for geospatial queries (find vendors within X km)
- Row Level Security (RLS) for data access control
- Real-time subscriptions for live location updates

**Authentication:**

- Email/password
- Magic links
- OAuth (Google, Apple for mobile)

**Storage:**

- Vendor profile images
- Event photos
- Image transformations via Supabase CDN

**Realtime:**

- Live vendor location updates
- Event status changes
- Chat/notifications (future)

### Next.js API Routes (Custom Logic)

Use when you need:

- Complex business logic
- Third-party API integrations (payment, SMS, etc.)
- Redis caching layer
- Webhook handlers
- Rate limiting

**Example structure:**

```
app/api/
├── vendors/
│   └── nearby/route.ts        # Custom geospatial query + cache
├── webhooks/
│   └── supabase/route.ts      # Database change webhooks
└── cron/
    └── cleanup/route.ts        # Scheduled tasks (Vercel Cron)
```

### Redis (Upstash) - Caching Layer

**Use cases:**

- Cache frequently accessed vendor lists
- Rate limiting API requests
- Session storage (if needed)
- Real-time pub/sub (alternative to Supabase)

**Key patterns:**

```typescript
// Cache nearby vendors for 2 minutes
const cacheKey = `vendors:nearby:${lat}:${lng}:${radius}`;
await redis.setex(cacheKey, 120, JSON.stringify(vendors));
```

---

## Data Architecture

### Core Entities

```typescript
// Simplified schema overview

User {
  id: uuid
  email: string
  role: 'customer' | 'vendor' | 'organizer'
  profile: Profile
}

Profile {
  id: uuid
  user_id: uuid
  display_name: string
  avatar_url: string
  phone?: string
}

Vendor {
  id: uuid
  profile_id: uuid
  business_name: string
  type: 'food_truck' | 'coffee_cart' | 'other'
  description: string
  current_location?: Point  // PostGIS geography point
  is_active: boolean
  operating_hours: json
}

Event {
  id: uuid
  organizer_id: uuid
  title: string
  type: 'farmers_market' | 'flea_market' | 'carnival' | 'fair' | 'other'
  location: Point  // PostGIS geography point
  start_time: timestamp
  end_time: timestamp
  description: string
  is_active: boolean
}

Location {
  id: uuid
  vendor_id?: uuid
  event_id?: uuid
  coordinates: Point  // PostGIS geography point
  address: string
  created_at: timestamp
}
```

### Geospatial Queries

**Find nearby vendors (PostGIS):**

```sql
SELECT *
FROM vendors v
WHERE v.is_active = true
  AND ST_DWithin(
    v.current_location::geography,
    ST_SetSRID(ST_MakePoint($longitude, $latitude), 4326)::geography,
    $radius_in_meters
  )
ORDER BY v.current_location <-> ST_SetSRID(ST_MakePoint($longitude, $latitude), 4326)
LIMIT 50;
```

---

## Shared Code Strategy

### Monorepo Structure

```
nuge/
├── apps/
│   ├── web/              # Next.js 16 app
│   └── mobile/           # Expo app
├── packages/
│   ├── api/              # @nuge/api - Supabase queries
│   ├── types/            # @nuge/types - Shared types
│   ├── validation/       # @nuge/validation - Zod schemas
│   └── config/           # @nuge/config - ESLint, TS config
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seed.sql          # Seed data
├── docs/                 # Documentation
├── turbo.json            # Turborepo config
└── package.json          # Root workspace
```

### What Gets Shared

1. **Types** (`@nuge/types`)
   - Database schema types (Supabase auto-generated)
   - API request/response types
   - Business logic types

2. **Validation** (`@nuge/validation`)
   - Zod schemas for forms
   - API request validation
   - Shared across client and API routes

3. **API Client** (`@nuge/api`)
   - Supabase client setup
   - Reusable query functions
   - TanStack Query hooks

---

## State Management Strategy

### Zustand (Global State)

**When to use:**

- User authentication state
- Current user location
- Map viewport state
- UI state (filters, modals)

**Example store:**

```typescript
// packages/api/src/stores/auth.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null, session: null }),
}));
```

### TanStack Query (Server State)

**When to use:**

- Fetching vendors/events
- Real-time data subscriptions
- Optimistic updates
- Background refetching

**Example query:**

```typescript
// packages/api/src/queries/vendors.ts
export const useNearbyVendors = (lat: number, lng: number) => {
  return useQuery({
    queryKey: ["vendors", "nearby", lat, lng],
    queryFn: () => getNearbyVendors(lat, lng, 5000), // 5km radius
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
```

---

## Real-time Updates

### Supabase Realtime

**Use cases:**

- Vendor location updates (every 30s when active)
- Event status changes (started, ended, cancelled)
- New vendors/events appearing on map

**Example subscription:**

```typescript
const channel = supabase
  .channel("vendor-locations")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "vendors" },
    (payload) => {
      // Update React Query cache
      queryClient.invalidateQueries(["vendors"]);
    }
  )
  .subscribe();
```

---

## Performance Optimizations

### Caching Strategy

1. **Browser/App Level** (TanStack Query)
   - 2 min stale time for vendor lists
   - 5 min stale time for event details
   - Infinite stale time for static data (categories, types)

2. **CDN Level** (Vercel Edge)
   - Static assets cached at edge
   - ISR for vendor/event pages (revalidate: 60s)

3. **Redis Level** (Upstash)
   - Frequently accessed queries (2 min TTL)
   - Rate limiting counters
   - API response caching

### Map Performance

- Cluster markers when zoomed out (50+ vendors → clusters)
- Only load visible markers in viewport + 10% buffer
- Lazy load marker images
- Use GeoJSON for efficient data transfer

---

## Security Considerations

### Authentication & Authorization

- **Supabase RLS** enforces data access at database level
- **Row policies:**
  - Customers: Read all active vendors/events
  - Vendors: Update only their own vendor data
  - Organizers: Update only their own events
  - Admins: Full access (managed via custom claims)

### Data Privacy

- Location data anonymized in analytics
- Vendor locations only shown when "active"
- User emails never exposed to other users
- GDPR compliance: data export & deletion APIs

### API Security

- Rate limiting (Upstash Redis)
- Input validation (Zod schemas)
- CORS properly configured
- Environment variables for secrets

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start all apps (web + mobile)
npm run dev

# Run tests
npm run test

# Type check entire monorepo
npm run typecheck

# Lint all packages
npm run lint
```

### Testing Strategy

**Unit Tests** (Vitest/Jest)

- Shared utility functions
- Validation schemas
- API client functions

**Integration Tests** (Vitest)

- API route handlers
- Supabase query functions
- Form submissions

**E2E Tests** (Playwright - web only)

- Critical user flows:
  - User registration
  - Vendor creates profile
  - Vendor updates location
  - Customer searches vendors

**Mobile Testing**

- Manual testing via Expo Go
- E2E with Detox (future, if needed)

---

## Deployment Strategy

### Web (Vercel)

```bash
# Automatic deployment on push to main
git push origin main

# Preview deployments on PRs
# Environment variables in Vercel dashboard
```

**Environment Variables:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `UPSTASH_REDIS_URL`
- `UPSTASH_REDIS_TOKEN`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

### Mobile (Expo EAS)

```bash
# Build for iOS/Android
eas build --platform all

# Submit to app stores
eas submit

# Push OTA update (no app store review needed)
eas update --branch production
```

---

## Monitoring & Observability

### Error Tracking

- **Sentry** for both web and mobile
- Source maps for production debugging
- User context attached to errors

### Analytics

- **PostHog** or **Mixpanel** for product analytics
- Track key events:
  - Vendor location updates
  - Search queries
  - Profile views
  - Map interactions

### Performance

- Vercel Analytics (web)
- React Native Performance (Expo)
- Database query performance (Supabase dashboard)

---

## Future Considerations

### Scalability

**When you hit limits:**

- **10K+ concurrent users**: Consider read replicas (Supabase Pro)
- **Complex queries slow**: Materialized views + Redis caching
- **Mobile app bundle size**: Code splitting, lazy loading

### Feature Additions

**Phase 2:**

- In-app chat between customers and vendors
- Payment integration (Stripe)
- Booking/reservation system
- Push notifications for favorite vendors

**Phase 3:**

- Admin dashboard
- Analytics for vendors (views, visitors)
- Multi-language support
- Dark mode

---

## Key Decisions & Rationale

### Why Next.js 16 (LTS)?

- Long-term stability (18 months support)
- Server components reduce client bundle
- Built-in API routes (no separate backend needed initially)
- Excellent DX and community support

### Why Expo over Bare React Native?

- Faster development (managed native dependencies)
- OTA updates (fix bugs without app store review)
- Consistent build environment (EAS)
- Easy access to native features (location, notifications)

### Why Supabase?

- PostgreSQL + PostGIS (geospatial queries essential)
- Auth, storage, realtime in one service
- Great DX, generous free tier
- Can self-host later if needed

### Why Turborepo?

- Share types/validation between web and mobile
- Build only changed packages (faster CI)
- Single source of truth for business logic
- Industry standard (maintained by Vercel)

### Why Upstash Redis?

- Serverless (perfect for Vercel)
- Pay-per-request (cost-effective at low scale)
- No connection pooling issues
- Global edge caching

---

## Quick Reference

### Project Info

- **Database ID**: `yynydcuzvqlniyqwafqo`
- **Primary Developer**: Solo developer
- **Version Control**: Git
- **Documentation**: `/docs`

### Key Commands

```bash
# Development
npm run dev          # Start all apps
npm run test         # Run all tests
npm run typecheck    # Check types

# Deployment
git push             # Deploy web (Vercel auto-deploy)
eas update           # Push mobile OTA update
```

### Important Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/yynydcuzvqlniyqwafqo)
- [Vercel Dashboard](#) (add after deployment)
- [Expo Dashboard](#) (add after setup)
- [Upstash Console](#) (add after setup)

---

**Last Updated**: 2025-11-12
**Version**: 1.0.0
