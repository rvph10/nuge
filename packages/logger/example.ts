// Example usage of @nuge/logger

import {
  createLogger,
  LogLevel,
  HTTPTransport,
  redact,
  withTiming,
} from "./src";

// ===================================
// Example 1: Basic Usage
// ===================================
console.log("\n=== Example 1: Basic Usage ===\n");

const logger = createLogger({
  minLevel: LogLevel.DEBUG,
  pretty: true,
});

logger.debug("This is a debug message", { userId: "123" });
logger.info("User signed in", { email: "user@example.com" });
logger.warn("Rate limit approaching", { remaining: 10, limit: 100 });
logger.error("Payment failed", new Error("Card declined"), { orderId: "456" });

// ===================================
// Example 2: Child Logger
// ===================================
console.log("\n=== Example 2: Child Logger ===\n");

const requestLogger = logger.child({ requestId: "req_123", userId: "789" });

requestLogger.info("Processing request");
requestLogger.info("Database query completed", { duration: "45ms" });

// ===================================
// Example 3: Sensitive Data Redaction
// ===================================
console.log("\n=== Example 3: Redacting Sensitive Data ===\n");

const user = {
  email: "user@example.com",
  password: "secret123",
  token: "abc123xyz",
  name: "John Doe",
};

logger.info("User data", redact(user));

// ===================================
// Example 4: Performance Timing
// ===================================
console.log("\n=== Example 4: Performance Timing ===\n");

await withTiming(logger, "Simulated database query", async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { users: [] };
});

// ===================================
// Example 5: Production Configuration
// ===================================
console.log("\n=== Example 5: Production Logger ===\n");

const prodLogger = createLogger({
  minLevel: LogLevel.INFO,
  pretty: false, // JSON output
  globalContext: {
    app: "nuge-web",
    version: "1.0.0",
    environment: "production",
  },
});

prodLogger.info("Application started");
prodLogger.error("Critical error", new Error("Database connection failed"));

console.log("\n✅ Logger examples completed!\n");
