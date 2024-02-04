import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import { comparePassword } from '../utils/hash';

@Injectable()
export class AuthService {
  private readonly logger = LoggerService.withContext(AuthService);

  constructor(private readonly userService: UsersService) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username, true);
    if (!user.password) return null;

    const isPasswordValid = this.validatePasswordFor(user.password, password);
    if (!isPasswordValid) return null;

    return user;
  }

  async validatePasswordFor(hashed: string, password: string) {
    return comparePassword(password, hashed);
  }
}
