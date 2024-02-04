import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signInDto';
import { JwtService } from './jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const user = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    const token = await this.jwtService.getJWTToken(user.id);
    this.jwtService.setJwtToCookie(res, token);
    res.json(user);
  }
}
