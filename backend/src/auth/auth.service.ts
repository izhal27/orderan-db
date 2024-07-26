import { REFRESH_TOKEN_SECRET } from './../types/constants';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JWT_EXPIRES, JWT_SECRET, REFRESH_TOKEN_EXPIRES } from '../types/constants';
import { compareValue, hashValue } from '../helpers/hash';

@Injectable()
export class AuthService {
  constructor
    (private readonly userService: UsersService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService) { }

  async signupLocal({ username, password }: AuthDto) {
    const hashPassword = await hashValue(password);
    const user = await this.userService.create({
      username,
      password: hashPassword
    });
    const tokens = await this.getTokens(user.id, user.username);
    this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal({ username, password }: AuthDto) {
    const user = await this.userService.findOne({ username });

    if (!user) {
      throw new ForbiddenException('Access denied')
    }

    const isValid = await compareValue(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Username or password is incorect');
    }

    if (user.blocked || user.roleId) {
      throw new UnauthorizedException('User has been blocked or does not have any roles')
    }
    return user;
  }

  logout(userId: number) {
    this.userService.update({
      where: {
        id: userId,
        refreshToken: {
          not: null
        }
      }, data: {
        refreshToken: null
      }
    })
  }

  refreshTokens() {
    throw new Error('Method not implemented.');
  }

  async getTokens(userId: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        username
      },
        {
          secret: this.configService.get(JWT_SECRET),
          expiresIn: this.configService.get(JWT_EXPIRES
          )
        }),
      this.jwtService.signAsync({
        sub: userId,
        username
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

  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await hashValue(refreshToken);
    this.userService.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: hash
      }
    });
  }
}
