export class Logger {
  constructor(
    private readonly logManager: LogManager,
    private readonly name: string,
  ) {}

  log(message: string): void {
    this.logManager.emitLog(`[${this.name}]: ${message}`);
  }
}

class LogManager {
  private onLog?: (message: string) => void;

  createLogger(name: string): Logger {
    const logger = new Logger(this, name);
    return logger;
  }

  emitLog(message: string): void {
    if (this.onLog) {
      this.onLog(message);
    }
  }

  onLogMessage(handler: (message: string) => void): void {
    this.onLog = handler;
  }
}

export const logging = new LogManager();
