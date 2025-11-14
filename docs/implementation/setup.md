# Development Setup Guide

## Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 10.0.0
- **Git**: For version control
- **Supabase Account**: Database already created (ID: `yynydcuzvqlniyqwafqo`)

---

## Initial Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd nuge
npm install
```

This will install all dependencies for the monorepo and all packages.

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Supabase - Get from https://supabase.com/dashboard/project/yynydcuzvqlniyqwafqo/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://yynydcuzvqlniyqwafqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# Upstash Redis - Create at https://console.upstash.com
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token

# Mapbox - Get from https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** Copy `.env.local` to `apps/web/.env.local` so Next.js can read it:

```bash
cp .env.local apps/web/.env.local
```

---

## Project Structure

```
nuge/
├── apps/
│   └── web/              # Next.js 16 web application
│       ├── app/          # App router pages & layouts
│       ├── public/       # Static assets
│       └── package.json
│
├── packages/
│   ├── api/              # @nuge/api - Supabase client & React Query hooks
│   ├── types/            # @nuge/types - Shared TypeScript types
│   ├── validation/       # @nuge/validation - Zod schemas
│   └── config/           # @nuge/config - Shared configs
│
├── docs/                 # Project documentation
├── turbo.json            # Turborepo configuration
└── package.json          # Root workspace config
```

---

## Development Commands

All commands run from the **root directory**:

### Start Development Server

```bash
npm run dev
```

This starts:

- Web app at `http://localhost:3000`
- (Future) Mobile app when set up

### Type Checking

```bash
npm run typecheck
```

Checks TypeScript across all packages.

### Linting

```bash
npm run lint
```

Runs ESLint on all packages.

### Build for Production

```bash
npm run build
```

Builds all apps and packages.

### Clean Everything

```bash
npm run clean
```

Removes all `node_modules` and build artifacts.

---

## Working with Packages

### Adding Dependencies

**To a specific app/package:**

```bash
npm install <package> -w @nuge/web
npm install <package> -w @nuge/api
```

**To root (devDependencies):**

```bash
npm install -D <package>
```

### Using Shared Packages

In `apps/web/app/page.tsx`:

```typescript
import { useNearbyVendors } from "@nuge/api";
import { vendorSchema } from "@nuge/validation";
import type { Vendor } from "@nuge/types";

export default function Home() {
  const { data: vendors } = useNearbyVendors(40.7128, -74.006, 5000);
  // Use vendors...
}
```

---

## Setting Up Supabase

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Link to Your Project

```bash
supabase link --project-ref yynydcuzvqlniyqwafqo
```

### 3. Pull Current Schema (if exists)

```bash
supabase db pull
```

This creates migration files in `supabase/migrations/`.

### 4. Generate TypeScript Types

```bash
supabase gen types typescript --project-id yynydcuzvqlniyqwafqo > packages/types/src/supabase.ts
```

Now update `packages/api/src/supabase.ts` to use these types instead of `any`.

---

### Push Migration to Supabase

```bash
supabase db push
```

---

## Setting Up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database (select region closest to your Supabase instance)
3. Copy the REST URL and token
4. Add to your `.env.local`:
   ```
   UPSTASH_REDIS_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_TOKEN=your_token_here
   ```

---

## Setting Up Mapbox

1. Go to [Mapbox Account](https://account.mapbox.com/)
2. Create access token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
   ```

---

## Testing Setup (Coming Soon)

### Web Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom -w @nuge/web
npm install -D @playwright/test -w @nuge/web
```

### Run Tests

```bash
npm run test           # All tests
npm run test:watch     # Watch mode
npm run test:e2e       # Playwright E2E tests
```

---

## Common Issues & Solutions

### Issue: `Cannot find module '@nuge/types'`

**Solution:** Make sure you ran `npm install` from the root directory.

### Issue: Supabase client throws error

**Solution:** Ensure `.env.local` exists in both root AND `apps/web/` directory.

### Issue: TypeScript errors in packages

**Solution:** Run `npm run typecheck` to see all errors. Make sure all package dependencies are installed.

### Issue: Turbo cache issues

**Solution:** Clear turbo cache:

```bash
rm -rf .turbo
npm run clean
npm install
```

---

## Next Steps

1. ✅ Set up Supabase credentials
2. ✅ Run database migrations
3. ✅ Set up Upstash Redis
4. ✅ Get Mapbox token
5. 🔲 Install additional dependencies (TanStack Query, Zustand, etc.)
6. 🔲 Build authentication flow
7. 🔲 Implement map view
8. 🔲 Create vendor profile pages
9. 🔲 Set up mobile app (Expo)

---

## Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/yynydcuzvqlniyqwafqo
- **Architecture Docs**: [docs/project/architecture.md](../project/architecture.md)
- **Turborepo Docs**: https://turbo.build/repo/docs
- **Next.js 16 Docs**: https://nextjs.org/docs

---

**Last Updated**: 2025-11-12
