# @nuge/logger

Production-ready structured logging system for the Nuge monorepo.

## Features

- 📝 **Structured Logging** - JSON output in production, pretty print in development
- 🎯 **Log Levels** - debug, info, warn, error with filtering
- 🔗 **Context Support** - Add context to logs, create child loggers
- 🚀 **Transports** - Console, Buffer, HTTP, and custom transports
- 🔒 **Sensitive Data Redaction** - Automatically redact passwords, tokens, etc.
- ⏱️ **Performance Timing** - Measure function execution time
- 🌍 **Universal** - Works in browser and Node.js

---

## Quick Start

### Basic Usage

```typescript
import { info, warn, error, debug } from "@nuge/logger";

// Simple logging
info("User signed in", { userId: "123" });
warn("Rate limit approaching", { remaining: 10 });
error("Payment failed", new Error("Card declined"), { orderId: "456" });
debug("Cache hit", { key: "user:123" });
```

### Create Custom Logger

```typescript
import { createLogger, LogLevel } from "@nuge/logger";

const logger = createLogger({
  minLevel: LogLevel.INFO,
  pretty: false, // JSON output
  globalContext: {
    app: "nuge-web",
    version: "1.0.0",
  },
});

logger.info("Application started");
```

### Child Loggers (Scoped Context)

```typescript
import { getLogger } from "@nuge/logger";

const logger = getLogger();

// Create a child logger with additional context
const userLogger = logger.child({ userId: "123", sessionId: "abc" });

userLogger.info("User action"); // Includes userId and sessionId
userLogger.error("User error", new Error("Something went wrong"));
```

---

## Configuration

### Log Levels

```typescript
import { createLogger, LogLevel } from "@nuge/logger";

const logger = createLogger({
  minLevel: LogLevel.WARN, // Only log warnings and errors
});
```

Available levels (least to most severe):

- `LogLevel.DEBUG` - Detailed debugging information
- `LogLevel.INFO` - General information
- `LogLevel.WARN` - Warning messages
- `LogLevel.ERROR` - Error messages

### Environment-Specific Config

```typescript
const logger = createLogger({
  environment: "production",
  pretty: false, // JSON output in production
  minLevel: LogLevel.INFO,
});
```

### Global Context & Metadata

```typescript
const logger = createLogger({
  globalContext: {
    app: "nuge-web",
    version: "1.0.0",
    environment: "production",
  },
  globalMetadata: {
    region: "us-east-1",
    instanceId: "i-1234567890",
  },
});

// All logs will include this context
logger.info("Something happened");
// Output includes: app, version, environment, region, instanceId
```

---

## Transports

### Console Transport (Default)

```typescript
import { createLogger, ConsoleTransport } from "@nuge/logger";

const logger = createLogger();
logger.addTransport(new ConsoleTransport());
```

### HTTP Transport (Send to External Service)

```typescript
import { createLogger, HTTPTransport } from "@nuge/logger";

const logger = createLogger();

logger.addTransport(
  new HTTPTransport({
    endpoint: "https://logs.example.com/api/logs",
    headers: {
      Authorization: "Bearer YOUR_TOKEN",
    },
    flushInterval: 5000, // Batch logs every 5 seconds
    maxBufferSize: 100, // Or when 100 logs accumulated
  })
);
```

### Buffer Transport (Custom Handler)

```typescript
import { createLogger, BufferTransport } from "@nuge/logger";

const logger = createLogger();

logger.addTransport(
  new BufferTransport({
    flushInterval: 10000,
    maxBufferSize: 50,
    onFlush: async (entries) => {
      // Send to your logging service
      await fetch("/api/logs", {
        method: "POST",
        body: JSON.stringify(entries),
      });
    },
  })
);
```

### Filter Transport

```typescript
import { createLogger, ConsoleTransport, FilterTransport } from "@nuge/logger";

const logger = createLogger();

// Only log errors to console
logger.addTransport(
  new FilterTransport(
    new ConsoleTransport(),
    (entry) => entry.level === "error"
  )
);
```

---

## Utilities

### Redact Sensitive Data

```typescript
import { redact } from "@nuge/logger";

const user = {
  email: "user@example.com",
  password: "secret123",
  token: "abc123",
};

const safe = redact(user);
// { email: 'user@example.com', password: '[REDACTED]', token: '[REDACTED]' }

logger.info("User data", safe);
```

### Measure Performance

```typescript
import { withTiming } from "@nuge/logger";

await withTiming(logger, "Fetch user data", async () => {
  return await db.users.findOne({ id: "123" });
});
// Logs: "Fetch user data completed { duration: '45.23ms' }"
```

### Request Logging

```typescript
import { createRequestLogger, generateRequestId } from "@nuge/logger";

// In your API route handler
app.use((req, res, next) => {
  req.logger = createRequestLogger(logger, generateRequestId());
  next();
});

// Use in routes
app.get("/api/users", (req, res) => {
  req.logger.info("Fetching users"); // Includes requestId
});
```

### Safe Serialization

```typescript
import { safeSerialize } from "@nuge/logger";

const obj = { a: 1 };
obj.self = obj; // Circular reference

const safe = safeSerialize(obj);
// { a: 1, self: '[Circular]' }
```

### Browser/Server Metadata

```typescript
import { getBrowserMetadata, getServerMetadata } from "@nuge/logger";

const logger = createLogger({
  globalMetadata:
    typeof window !== "undefined" ? getBrowserMetadata() : getServerMetadata(),
});
```

---

## Integration with Nuge App

### App Startup Configuration

```typescript
// apps/web/app/layout.tsx or app.tsx
import { configureLogger, createLogger, LogLevel } from "@nuge/logger";

const logger = createLogger({
  minLevel:
    process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  globalContext: {
    app: "nuge-web",
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  },
});

configureLogger(logger);
```

### Usage in Components

```typescript
import { getLogger } from "@nuge/logger";

export function VendorList() {
  const logger = getLogger();

  useEffect(() => {
    logger.info("VendorList mounted");

    return () => {
      logger.info("VendorList unmounted");
    };
  }, []);

  // ...
}
```

### Usage in API Routes

```typescript
import { getLogger } from "@nuge/logger";

export async function GET(request: Request) {
  const logger = getLogger();

  try {
    logger.info("Fetching vendors");
    const vendors = await getVendors();
    return Response.json(vendors);
  } catch (error) {
    logger.error("Failed to fetch vendors", error as Error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## Production Setup

### With Error Tracking (Sentry)

```typescript
import { createLogger, BufferTransport } from "@nuge/logger";
import * as Sentry from "@sentry/nextjs";

const logger = createLogger({
  minLevel: LogLevel.INFO,
});

// Send errors to Sentry
logger.addTransport(
  new BufferTransport({
    flushInterval: 1000,
    maxBufferSize: 10,
    onFlush: async (entries) => {
      entries
        .filter((e) => e.level === "error")
        .forEach((entry) => {
          Sentry.captureException(entry.error || new Error(entry.message), {
            contexts: {
              log: entry.context,
            },
          });
        });
    },
  })
);
```

### With Cloud Logging

```typescript
const logger = createLogger();

logger.addTransport(
  new HTTPTransport({
    endpoint: process.env.LOG_ENDPOINT!,
    headers: {
      "X-API-Key": process.env.LOG_API_KEY!,
    },
  })
);
```

---

## Best Practices

1. **Use appropriate log levels**
   - `debug`: Detailed debugging info (disabled in production)
   - `info`: General information about app behavior
   - `warn`: Something unexpected but not an error
   - `error`: Errors that need attention

2. **Add context, not just messages**

   ```typescript
   // Good
   logger.info("User created vendor", { userId, vendorId, vendorName });

   // Bad
   logger.info("User created vendor");
   ```

3. **Redact sensitive data**

   ```typescript
   logger.info("User signed in", redact({ email, password }));
   ```

4. **Use child loggers for scoped context**

   ```typescript
   const requestLogger = logger.child({ requestId });
   ```

5. **Log errors with context**
   ```typescript
   logger.error("Payment failed", error, { userId, amount, currency });
   ```

---

## Troubleshooting

### Logs not appearing?

Check if logging is enabled and log level is set correctly:

```typescript
const logger = createLogger({
  enabled: true,
  minLevel: LogLevel.DEBUG,
});
```

### Performance concerns?

Use buffered transports to batch log writes:

```typescript
logger.addTransport(
  new BufferTransport({
    flushInterval: 10000,
    maxBufferSize: 200,
  })
);
```

### Need structured logs in production?

Disable pretty printing:

```typescript
const logger = createLogger({
  pretty: false, // JSON output
});
```
