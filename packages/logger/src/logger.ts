// Core logger implementation
import type {
  ILogger,
  LogEntry,
  LoggerConfig,
  LogLevel,
  LogTransport,
} from "./types";
import { LogLevelPriority, LogLevel as LogLevelEnum } from "./types";

/**
 * Core Logger class
 */
export class Logger implements ILogger {
  private config: Required<LoggerConfig>;
  private transports: LogTransport[] = [];
  private childContext: Record<string, unknown> = {};

  constructor(config: LoggerConfig = {}) {
    // Detect environment
    const env = config.environment || this.detectEnvironment();
    const isDev = env === "development";

    // Set defaults based on environment
    this.config = {
      minLevel:
        config.minLevel || (isDev ? LogLevelEnum.DEBUG : LogLevelEnum.INFO),
      pretty: config.pretty ?? isDev,
      includeStackTrace: config.includeStackTrace ?? true,
      globalContext: config.globalContext || {},
      globalMetadata: config.globalMetadata || {},
      enabled: config.enabled ?? true,
      environment: env,
    };
  }

  /**
   * Detect the current environment
   */
  private detectEnvironment(): "development" | "production" | "test" {
    if (typeof process !== "undefined") {
      const nodeEnv = process.env.NODE_ENV;
      if (nodeEnv === "test") return "test";
      if (nodeEnv === "production") return "production";
      return "development";
    }
    // Browser fallback
    return "production";
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LogLevelPriority[level] >= LogLevelPriority[this.config.minLevel];
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...this.config.globalContext,
        ...this.childContext,
        ...context,
      },
      metadata: {
        ...this.config.globalMetadata,
      },
    };

    if (error) {
      entry.error = error;
      if (this.config.includeStackTrace && error.stack) {
        entry.context = {
          ...entry.context,
          stack: error.stack,
        };
      }
    }

    return entry;
  }

  /**
   * Write log entry to all transports
   */
  private async write(entry: LogEntry): Promise<void> {
    if (this.transports.length === 0) {
      // No transports, use default console output
      this.defaultConsoleLog(entry);
      return;
    }

    // Write to all transports
    await Promise.all(this.transports.map((transport) => transport.log(entry)));
  }

  /**
   * Default console logging
   */
  private defaultConsoleLog(entry: LogEntry): void {
    if (this.config.pretty) {
      // Pretty print for development
      this.prettyPrint(entry);
    } else {
      // JSON output for production
      console.log(JSON.stringify(entry));
    }
  }

  /**
   * Pretty print log entry (development mode)
   */
  private prettyPrint(entry: LogEntry): void {
    const { level, message, timestamp, context, error } = entry;

    // Color codes
    const colors = {
      debug: "\x1b[36m", // Cyan
      info: "\x1b[32m", // Green
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      reset: "\x1b[0m",
      dim: "\x1b[2m",
      bold: "\x1b[1m",
    };

    const color = colors[level];
    const time = new Date(timestamp).toLocaleTimeString();

    // Format: [HH:MM:SS] LEVEL: message
    console.log(
      `${colors.dim}[${time}]${colors.reset} ${color}${level.toUpperCase()}${colors.reset}: ${message}`
    );

    // Print context if present
    if (context && Object.keys(context).length > 0) {
      console.log(`${colors.dim}Context:${colors.reset}`, context);
    }

    // Print error if present
    if (error) {
      console.error(
        `${colors.error}${colors.bold}Error:${colors.reset}`,
        error
      );
    }
  }

  /**
   * Add a transport
   */
  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Remove a transport by name
   */
  removeTransport(name: string): void {
    this.transports = this.transports.filter((t) => t.name !== name);
  }

  // ===================================
  // Logging Methods
  // ===================================

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevelEnum.DEBUG)) return;
    const entry = this.createLogEntry(LogLevelEnum.DEBUG, message, context);
    void this.write(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevelEnum.INFO)) return;
    const entry = this.createLogEntry(LogLevelEnum.INFO, message, context);
    void this.write(entry);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevelEnum.WARN)) return;
    const entry = this.createLogEntry(LogLevelEnum.WARN, message, context);
    void this.write(entry);
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevelEnum.ERROR)) return;
    const entry = this.createLogEntry(
      LogLevelEnum.ERROR,
      message,
      context,
      error
    );
    void this.write(entry);
  }

  // ===================================
  // Child Logger
  // ===================================

  child(context: Record<string, unknown>): ILogger {
    const childLogger = new Logger(this.config);
    childLogger.transports = this.transports;
    childLogger.childContext = {
      ...this.childContext,
      ...context,
    };
    return childLogger;
  }

  // ===================================
  // Metadata Management
  // ===================================

  setMetadata(metadata: Record<string, unknown>): void {
    this.config.globalMetadata = {
      ...this.config.globalMetadata,
      ...metadata,
    };
  }

  // ===================================
  // Flush
  // ===================================

  async flush(): Promise<void> {
    await Promise.all(this.transports.map((transport) => transport.flush?.()));
  }
}

/**
 * Create a logger instance
 */
export function createLogger(config?: LoggerConfig): ILogger {
  return new Logger(config);
}
