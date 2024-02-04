import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

type JwtPayload = { id: number };

@Injectable()
export class JwtService {
  private secret: string;
  private expiresIn: number;
  private expiresInDays: string;
  constructor() {
    this.secret = process.env.JWT_SECRET;
    if (!this.secret) throw new Error('JWT_SECRET is not set');

    const expires = process.env.JWT_EXPIRES_IN;
    if (!expires || !expires.endsWith('d'))
      throw new Error('JWT_EXPIRES_IN is not set, or is not in days format');

    this.expiresInDays = expires;
    this.expiresIn = +expires.split('d')[0];
  }

  async getJWTToken(id: number) {
    const { expiresInDays, secret } = this;
    return await this.sign({ id }, secret, { expiresIn: expiresInDays });
  }

  async verifyJWTToken(token: string): Promise<JwtPayload> {
    const payload = (await this.verify(token)) as JwtPayload;
    if (!payload || !payload.id) throw new Error('Invalid token');
    return payload;
  }

  getExpiryJWTDate() {
    const expires = new Date();
    expires.setDate(new Date().getDate() + this.expiresIn);

    return expires;
  }

  setJwtToCookie(res: Response, token: string) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: this.getExpiryJWTDate(),
    });
  }

  getJwtFromCookie(req: Request) {
    return req.cookies['jwt'];
  }

  private sign(
    payload: JwtPayload,
    secret: string,
    options: jwt.SignOptions,
  ): Promise<string> {
    return new Promise((res, rej) => {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return void rej(err);
        res(token);
      });
    });
  }

  private async verify(token: string) {
    return new Promise((res, rej) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) return void rej(err);
        res(decoded);
      });
    });
  }
}
