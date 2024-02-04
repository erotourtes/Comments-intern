import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private _context = '';
  private logger = new ConsoleLogger();

  debug(message: string) {
    this.logger.debug(message, this._context);
  }

  log(message: string) {
    this.logger.log(message, this._context);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace, this._context);
  }

  static withContext(module: { name: string }) {
    const logger = new LoggerService();
    logger._context = module.name;
    return logger;
  }
}
