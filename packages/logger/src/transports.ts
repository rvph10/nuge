// Log transports for different destinations
import type { LogEntry, LogTransport } from "./types";

/**
 * Console transport (default)
 */
export class ConsoleTransport implements LogTransport {
  name = "console";

  log(entry: LogEntry): void {
    const { level } = entry;

    switch (level) {
      case "debug":
        console.debug(JSON.stringify(entry));
        break;
      case "info":
        console.info(JSON.stringify(entry));
        break;
      case "warn":
        console.warn(JSON.stringify(entry));
        break;
      case "error":
        console.error(JSON.stringify(entry));
        break;
    }
  }
}

/**
 * Buffer transport - buffers logs for batch sending
 * Useful for sending logs to external services
 */
export class BufferTransport implements LogTransport {
  name = "buffer";
  private buffer: LogEntry[] = [];
  private flushInterval: number;
  private maxBufferSize: number;
  private timer?: NodeJS.Timeout | number;
  private onFlush: (entries: LogEntry[]) => void | Promise<void>;

  constructor(options: {
    flushInterval?: number; // ms
    maxBufferSize?: number;
    onFlush: (entries: LogEntry[]) => void | Promise<void>;
  }) {
    this.flushInterval = options.flushInterval || 5000; // 5 seconds default
    this.maxBufferSize = options.maxBufferSize || 100;
    this.onFlush = options.onFlush;

    // Start auto-flush timer
    this.startTimer();
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      void this.flush();
    }, this.flushInterval);
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry);

    // Flush if buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      void this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.buffer = [];

    try {
      await this.onFlush(entries);
    } catch (error) {
      console.error("[BufferTransport] Failed to flush logs:", error);
      // Re-add failed entries to buffer
      this.buffer.unshift(...entries);
    }
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer as NodeJS.Timeout);
    }
    void this.flush();
  }
}

/**
 * HTTP transport - sends logs to an HTTP endpoint
 */
export class HTTPTransport implements LogTransport {
  name = "http";
  private buffer: BufferTransport;

  constructor(options: {
    endpoint: string;
    headers?: Record<string, string>;
    flushInterval?: number;
    maxBufferSize?: number;
  }) {
    this.buffer = new BufferTransport({
      flushInterval: options.flushInterval,
      maxBufferSize: options.maxBufferSize,
      onFlush: async (entries) => {
        await fetch(options.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          body: JSON.stringify({ logs: entries }),
        });
      },
    });
  }

  log(entry: LogEntry): void {
    this.buffer.log(entry);
  }

  async flush(): Promise<void> {
    await this.buffer.flush();
  }
}

/**
 * Filter transport - wraps another transport with filtering logic
 */
export class FilterTransport implements LogTransport {
  name: string;
  private transport: LogTransport;
  private filter: (entry: LogEntry) => boolean;

  constructor(
    transport: LogTransport,
    filter: (entry: LogEntry) => boolean,
    name?: string
  ) {
    this.transport = transport;
    this.filter = filter;
    this.name = name || `filter:${transport.name}`;
  }

  log(entry: LogEntry): void {
    if (this.filter(entry)) {
      this.transport.log(entry);
    }
  }

  async flush(): Promise<void> {
    await this.transport.flush?.();
  }
}

/**
 * Multi transport - logs to multiple transports
 */
export class MultiTransport implements LogTransport {
  name = "multi";
  private transports: LogTransport[];

  constructor(transports: LogTransport[]) {
    this.transports = transports;
  }

  log(entry: LogEntry): void {
    this.transports.forEach((transport) => transport.log(entry));
  }

  async flush(): Promise<void> {
    await Promise.all(this.transports.map((transport) => transport.flush?.()));
  }
}
