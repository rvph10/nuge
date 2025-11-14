// Logger package main export
export * from "./types";
export * from "./logger";
export * from "./transports";
export * from "./utils";

import { createLogger } from "./logger";
import type { ILogger } from "./types";

/**
 * Default logger instance (singleton)
 * Can be configured once at app startup
 */
let defaultLogger: ILogger | null = null;

/**
 * Get the default logger instance
 */
export function getLogger(): ILogger {
  if (!defaultLogger) {
    defaultLogger = createLogger({
      // Auto-detect environment
      environment:
        typeof process !== "undefined"
          ? (process.env.NODE_ENV as any)
          : "production",
    });
  }
  return defaultLogger;
}

/**
 * Configure the default logger
 * Should be called once at app startup
 */
export function configureLogger(logger: ILogger): void {
  defaultLogger = logger;
}

/**
 * Re-export default instance methods for convenience
 */
const logger = getLogger();

export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);

// Re-export as default
export default logger;
