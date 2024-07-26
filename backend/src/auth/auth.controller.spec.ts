import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { Tokens } from '../types';
import { AuthDto } from './dto/auth.dto';

const tokens: Tokens = {
  access_token: 'access',
  refresh_token: 'refresh',
};

const authDto: AuthDto = {
  username: 'user',
  password: 'pass',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [AuthController],
      providers: [AuthService, JwtService, ConfigService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('signup - should return tokens', async () => {
    jest.spyOn(authService, 'signupLocal').mockResolvedValue(tokens);

    const result = await authController.signupLocal(authDto);

    await expect(authService.signupLocal).toHaveBeenCalledWith(authDto);
    await expect(result).toEqual(tokens);
  });

  it('signin - should return tokens', async () => {
    jest.spyOn(authService, 'signinLocal').mockResolvedValue(tokens);

    const result = await authController.signinLocal(authDto);

    await expect(authService.signinLocal).toHaveBeenCalledWith(authDto);
    await expect(result).toEqual(tokens);
  });

  it('logout', async () => {
    jest.spyOn(authService, 'logout').mockResolvedValue();

    const result = await authController.logout(1);

    await expect(authService.logout).toHaveBeenCalledWith(1);
    await expect(result).toEqual(undefined);
  });

  it('refresh', async () => {
    jest.spyOn(authService, 'refreshTokens').mockResolvedValue(tokens);

    const result = await authController.refreshTokens(
      authDto.username,
      tokens.refresh_token,
    );

    await expect(authService.refreshTokens).toHaveBeenCalledWith(
      authDto.username,
      tokens.refresh_token,
    );
    await expect(result).toEqual(tokens);
  });
});
