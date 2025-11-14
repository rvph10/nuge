// Logger utilities and helpers
import type { ILogger } from "./types";

/**
 * Safely serialize an object for logging
 * Handles circular references and errors
 */
export function safeSerialize(obj: unknown): Record<string, unknown> | unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Error) {
    const errorObj: Record<string, unknown> = {
      errorName: obj.name,
      errorMessage: obj.message,
      stack: obj.stack,
    };
    // Add any custom properties
    Object.keys(obj).forEach((key) => {
      errorObj[key] = (obj as any)[key];
    });
    return errorObj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  try {
    // Handle circular references
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        return value;
      })
    );
  } catch {
    return "[Unserializable]";
  }
}

/**
 * Extract useful metadata from browser environment
 */
export function getBrowserMetadata(): Record<string, unknown> {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
  };
}

/**
 * Extract useful metadata from Node.js environment
 */
export function getServerMetadata(): Record<string, unknown> {
  if (typeof process === "undefined") {
    return {};
  }

  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    memory: process.memoryUsage(),
  };
}

/**
 * Create a logger with request context middleware
 */
export function createRequestLogger(
  logger: ILogger,
  requestId?: string
): ILogger {
  return logger.child({
    requestId: requestId || generateRequestId(),
  });
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Measure execution time of a function
 */
export async function withTiming<T>(
  logger: ILogger,
  label: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.debug(`${label} completed`, {
      duration: `${duration.toFixed(2)}ms`,
    });
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${label} failed`, error as Error, {
      duration: `${duration.toFixed(2)}ms`,
    });
    throw error;
  }
}

/**
 * Create a logger decorator for class methods
 */
export function LogMethod(logger: ILogger, level: "debug" | "info" = "debug") {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = `${className}.${propertyKey}`;

      logger[level](`Calling ${methodName}`, {
        args: safeSerialize(args),
      });

      try {
        const result = await originalMethod.apply(this, args);
        logger[level](`${methodName} completed`);
        return result;
      } catch (error) {
        logger.error(`${methodName} failed`, error as Error);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Redact sensitive information from logs
 */
export function redact(
  obj: Record<string, unknown>,
  keys: string[] = ["password", "token", "secret", "apiKey", "authorization"]
): Record<string, unknown> {
  const redacted = { ...obj };

  for (const key of keys) {
    if (key in redacted) {
      redacted[key] = "[REDACTED]";
    }
  }

  // Check nested objects
  for (const [key, value] of Object.entries(redacted)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      redacted[key] = redact(value as Record<string, unknown>, keys);
    }
  }

  return redacted;
}

/**
 * Format error for logging
 */
export function formatError(error: unknown): {
  message: string;
  stack?: string;
  code?: string;
  [key: string]: unknown;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(error as any), // Include any custom properties
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return {
    message: "Unknown error",
    value: safeSerialize(error),
  };
}
