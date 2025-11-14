# API Design Guide

## Creating API Routes in Next.js 16

### File Structure

```
apps/web/app/api/
├── hello/
│   └── route.ts              # /api/hello
├── vendors/
│   ├── nearby/
│   │   └── route.ts          # /api/vendors/nearby
│   ├── location/
│   │   └── route.ts          # /api/vendors/location
│   └── [id]/
│       └── route.ts          # /api/vendors/:id (dynamic)
└── events/
    └── route.ts              # /api/events
```

---

## Basic Pattern

### Simple GET Route

```typescript
// apps/web/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello" }, { status: 200 });
}
```

**Access at:** `http://localhost:3000/api/example`

---

## Query Parameters

```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name"); // ?name=John

  return NextResponse.json({ message: `Hello ${name}` });
}
```

**Usage:** `GET /api/example?name=John`

---

## POST Request with Body

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate with Zod
  const result = mySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.issues },
      { status: 400 }
    );
  }

  // Process data...
  return NextResponse.json({ success: true });
}
```

---

## Dynamic Routes

```typescript
// apps/web/app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id; // From URL: /api/users/123

  return NextResponse.json({ userId });
}
```

---

## Authentication

### Check Auth Token

```typescript
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  // Verify with Supabase
  const supabase = getSupabaseServerClient(
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // User is authenticated, proceed...
}
```

---

## Error Handling

### Standard Pattern

```typescript
export async function GET(request: NextRequest) {
  try {
    // Your logic here

    return NextResponse.json({ data: "success" });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

---

## Validation with Zod

```typescript
import { mySchema } from "@nuge/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = mySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validation.error.issues,
      },
      { status: 400 }
    );
  }

  const validData = validation.data;
  // Use validData (type-safe!)
}
```

---

## Working with Supabase

### Server-Side Query

```typescript
import { getSupabaseServerClient } from "@nuge/api";

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient(
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ vendors: data });
}
```

---

## Caching Responses

### Client-Side Caching (CDN)

```typescript
return NextResponse.json(
  { data: "your data" },
  {
    status: 200,
    headers: {
      // Cache for 60s, serve stale for up to 120s while revalidating
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  }
);
```

### Server-Side Caching (Redis - Coming Soon)

```typescript
// Check cache
const cacheKey = `vendors:nearby:${lat}:${lng}`;
const cached = await redis.get(cacheKey);
if (cached) {
  return NextResponse.json(JSON.parse(cached));
}

// Query database
const data = await fetchFromDatabase();

// Store in cache (2 min TTL)
await redis.setex(cacheKey, 120, JSON.stringify(data));

return NextResponse.json(data);
```

---

## HTTP Methods

```typescript
export async function GET(request: NextRequest) {
  /* ... */
}
export async function POST(request: NextRequest) {
  /* ... */
}
export async function PUT(request: NextRequest) {
  /* ... */
}
export async function PATCH(request: NextRequest) {
  /* ... */
}
export async function DELETE(request: NextRequest) {
  /* ... */
}
export async function OPTIONS(request: NextRequest) {
  /* ... */
}
```

---

## CORS (if needed)

```typescript
export async function GET(request: NextRequest) {
  const data = { message: "Hello" };

  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

---

## Rate Limiting (with Redis - Coming Soon)

```typescript
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const key = `ratelimit:${ip}`;

  const requests = await redis.incr(key);
  if (requests === 1) {
    await redis.expire(key, 60); // 1 minute window
  }

  if (requests > 10) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Continue processing...
}
```

---

## Environment Variables

### Server-Only Variables

```typescript
// These are only available on the server (API routes)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const redisUrl = process.env.UPSTASH_REDIS_URL;
```

### Public Variables (Available Client-Side)

```typescript
// These are available everywhere (use NEXT_PUBLIC_ prefix)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
```

---

## Testing API Routes

### Using curl

```bash
# GET request
curl http://localhost:3000/api/hello

# GET with query params
curl "http://localhost:3000/api/vendors/nearby?lat=40.7128&lng=-74.0060&radius=5000"

# POST with JSON body
curl -X POST http://localhost:3000/api/vendors/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"vendor_id":"123","latitude":40.7128,"longitude":-74.0060}'

# DELETE request
curl -X DELETE http://localhost:3000/api/vendors/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using JavaScript/TypeScript

```typescript
// GET request
const response = await fetch("/api/vendors/nearby?lat=40.7128&lng=-74.0060");
const data = await response.json();

// POST request
const response = await fetch("/api/vendors/location", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    vendor_id: "123",
    latitude: 40.7128,
    longitude: -74.006,
  }),
});
```

---

## Best Practices

1. **Always validate input** - Use Zod schemas from `@nuge/validation`
2. **Handle errors gracefully** - Wrap in try/catch, return proper status codes
3. **Use proper HTTP methods** - GET for reading, POST for creating, PUT/PATCH for updating, DELETE for removing
4. **Return consistent responses** - Same structure for success and errors
5. **Add appropriate caching** - Use Cache-Control headers for public data
6. **Protect sensitive routes** - Check authentication for user-specific actions
7. **Log errors** - Use console.error for debugging
8. **Use environment variables** - Never hardcode secrets
9. **Add TypeScript types** - Import from `@nuge/types` for type safety
10. **Document your APIs** - Add comments explaining complex logic

---

## Example Response Structures

### Success Response

```json
{
  "success": true,
  "data": {
    /* your data */
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [
    /* validation errors or additional info */
  ]
}
```

### Paginated Response

```json
{
  "data": [
    /* array of items */
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

## Common Status Codes

- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (auth valid but no permission)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Next Steps

1. Implement Redis caching layer
2. Add rate limiting
3. Set up API documentation (Swagger/OpenAPI)
4. Add integration tests for API routes
5. Monitor API performance and errors with Sentry

---

**Last Updated**: 2025-11-12
