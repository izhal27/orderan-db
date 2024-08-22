import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_REFRESH, REFRESH_TOKEN_SECRET } from '../../constants/constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
