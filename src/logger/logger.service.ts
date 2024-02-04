import { ConsoleLogger, Injectable } from '@nestjs/common';

const logger = new ConsoleLogger();

@Injectable()
export class LoggerService {
  private _context = '';

  debug(...message: any[]) {
    const msg = message.join(' ');
    logger.debug(msg, this._context);
  }

  log(message: string) {
    logger.log(message, this._context);
  }

  error(message: string, trace: string) {
    logger.error(message, trace, this._context);
  }

  static withContext(module: { name: string }) {
    const logger = new LoggerService();
    logger._context = module.name;
    return logger;
  }
}
