import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtService } from './jwt.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [UsersModule],
  exports: [JwtService],
})
export class AuthModule {}
