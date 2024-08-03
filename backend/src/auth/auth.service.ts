import { REFRESH_TOKEN_SECRET } from '../types/constants';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import {
  JWT_EXPIRES,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES,
} from '../types/constants';
import { compareValue, hashValue } from '../helpers/hash';
import { Tokens } from '../types';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async signupLocal({ username, password }: AuthDto) {
    const user = await this.userService.create({
      username,
      password,
    });
    return this.generateTokens(user);
  }

  async signinLocal({ username, password }: AuthDto): Promise<Tokens> {
    const user = await this.userService.findUnique({ username }, true);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid = await compareValue(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Username or password is incorect');
    }
    if (user.blocked || !user.roleId) {
      throw new UnauthorizedException(
        'User has been blocked or does not have any roles',
      );
    }
    return this.generateTokens(user);
  }

  async logout(userId: number) {
    const user = await this.userService.findUnique({
      id: userId,
      refreshToken: {
        not: null,
      },
    });
    if (user) {
      this.userService.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
        },
      });
    }
  }

  async refreshTokens(username: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findUnique({ username }, true);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }
    const isValid = await compareValue(refreshToken, user.refreshToken!);
    if (!isValid) {
      throw new ForbiddenException('Access denied');
    }
    return this.generateTokens(user);
  }

  private async generateTokens(user: UserEntity): Promise<Tokens> {
    const tokens = await this.getTokens(user.id, user.username, user.role?.name);
    await this.updateRefreshTokenHash(user.username, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: number, username: string, role: string | undefined) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get(JWT_SECRET),
          expiresIn: this.configService.get(JWT_EXPIRES),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get(REFRESH_TOKEN_SECRET),
          expiresIn: this.configService.get(REFRESH_TOKEN_EXPIRES),
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  private async updateRefreshTokenHash(username: string, refreshToken: string) {
    const hash = await hashValue(refreshToken);
    this.userService.update({
      where: {
        username,
      },
      data: {
        refreshToken: hash,
      },
    });
  }
}
