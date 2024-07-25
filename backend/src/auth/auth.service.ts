import { REFRESH_TOKEN_SECRET } from './../types/constants';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { Tokens } from './../types';
import { JWT_EXPIRES, JWT_REFRESH, JWT_SECRET, REFRESH_TOKEN_EXPIRES } from 'src/types/constants';

@Injectable()
export class AuthService {
  constructor
    (private readonly userService: UsersService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService) { }

  async signupLocal(authDto: AuthDto) {
    console.log(authDto);

    const user = await this.userService.signupLocal(authDto);
    return this.getTokens(user!.id, user!.email!);
  }

  signinLocal(authDto: AuthDto) {
    return this.userService.signinLocal(authDto)
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  refreshTokens() {
    throw new Error('Method not implemented.');
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        email
      },
        {
          secret: this.configService.get(JWT_SECRET),
          expiresIn: this.configService.get(JWT_EXPIRES
          )
        }),
      this.jwtService.signAsync({
        sub: userId,
        email
      },
        {
          secret: this.configService.get(REFRESH_TOKEN_SECRET),
          expiresIn: this.configService.get(REFRESH_TOKEN_EXPIRES
          )
        }),
    ]);

    return {
      access_token: at,
      refresh_token: rt
    }
  }
}
