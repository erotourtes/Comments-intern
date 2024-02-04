import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  logger = LoggerService.withContext(AuthGuard);

  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(PrismaService) private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.jwtService.getJwtFromCookie(request);
    this.logger.debug(`Token: ${token}`);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyJWTToken(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
      this.logger.debug(`User ${user.email} authenticated`);
      request['user'] = user;
    } catch (e) {
      this.logger.error(`Error: ${e}`, e['stack']);
      if (e instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expired');
      throw new UnauthorizedException();
    }

    return true;
  }
}
