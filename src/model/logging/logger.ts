export interface DrawrLog {
  message: string;
  level: DrawrLogLevel;
  name: string;
}

export type DrawrLogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

export class Logger {
  constructor(
    private readonly logManager: LogManager,
    private readonly name: string,
  ) {}

  log(level: DrawrLogLevel, message: string): void {
    this.logManager.emitLog({
      name: this.name,
      message,
      level,
    });
  }

  warning(message: string): void {
    this.log('WARNING', message);
  }

  debug(message: string): void {
    this.log('DEBUG', message);
  }

  info(message: string): void {
    this.log('INFO', message);
  }

  error(message: string): void {
    this.log('ERROR', message);
  }
}

class LogManager {
  private logHandler?: (log: DrawrLog) => void;
  private level: DrawrLogLevel = 'INFO';

  private readonly lookup: Record<DrawrLogLevel, number> = {
    DEBUG: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
  };

  createLogger(name: string): Logger {
    const logger = new Logger(this, name);
    return logger;
  }

  emitLog(log: DrawrLog): void {
    if (this.logHandler) {
      if (this.lookup[log.level] < this.lookup[this.level]) return;
      this.logHandler(log);
    }
  }

  configureLogging(level: DrawrLogLevel): void {
    this.level = level;
  }

  onLog(handler: (log: DrawrLog) => void): void {
    this.logHandler = handler;
  }
}

export const logging = new LogManager();
