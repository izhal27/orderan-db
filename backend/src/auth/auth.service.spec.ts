import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UsersService, useValue: mockDeep<UsersService>() },
        { provide: JwtService, useValue: mockDeep<JwtService>() },
        { provide: ConfigService, useValue: mockDeep<ConfigService>() },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signupLocal', () => {
    it('should be defined', () => {
      expect(service.signupLocal).toBeDefined();
    });
  });

  describe('signinLocal', () => {
    it('should be defined', () => {
      expect(service.signinLocal).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should be defined', () => {
      expect(service.logout).toBeDefined();
    });
  });

  describe('refreshTokens', () => {
    it('should be defined', () => {
      expect(service.refreshTokens).toBeDefined();
    });
  });
});
