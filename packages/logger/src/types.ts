// Logger types and interfaces

/**
 * Log levels from least to most severe
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Log level numeric values for comparison
 */
export const LogLevelPriority: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * Structured log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    url?: string;
    userAgent?: string;
    [key: string]: unknown;
  };
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /**
   * Minimum log level to output
   * @default LogLevel.INFO in production, LogLevel.DEBUG in development
   */
  minLevel?: LogLevel;

  /**
   * Whether to enable pretty printing (development mode)
   * @default true in development, false in production
   */
  pretty?: boolean;

  /**
   * Whether to include stack traces for errors
   * @default true
   */
  includeStackTrace?: boolean;

  /**
   * Global context to include in all logs
   */
  globalContext?: Record<string, unknown>;

  /**
   * Custom metadata to include in all logs
   */
  globalMetadata?: Record<string, unknown>;

  /**
   * Whether logging is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Environment (auto-detected if not provided)
   */
  environment?: "development" | "production" | "test";
}

/**
 * Logger transport interface for custom log destinations
 */
export interface LogTransport {
  name: string;
  log: (entry: LogEntry) => void | Promise<void>;
  flush?: () => void | Promise<void>;
}

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void;

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, unknown>): ILogger;

  /**
   * Update global metadata
   */
  setMetadata(metadata: Record<string, unknown>): void;

  /**
   * Flush all transports (useful before app shutdown)
   */
  flush(): Promise<void>;
}
