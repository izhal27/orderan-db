import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { JWT, JWT_SECRET } from '../../types/constants';
import { JwtPayload } from '../../types';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.usersService.findUnique({
      username,
      refreshToken: {
        not: null,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Access denied');
    }
    return payload;
  }
}
