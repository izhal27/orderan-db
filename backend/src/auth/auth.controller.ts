import { Tokens } from './../types/tokens.type';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';

class TokensEntity {
  access_token: string;
  refresh_token: string;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @ApiCreatedResponse({
    type: TokensEntity,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI...',
    },
    description: 'Signup with username and password',
  })
  signupLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(authDto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokensEntity,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI...',
    },
    description: 'Signin with username and password',
  })
  signinLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBearerAuth()
  logout(@GetCurrentUserId() userId: number) {
    this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @ApiOkResponse()
  @ApiBearerAuth()
  refreshTokens(
    @GetCurrentUser('username') username: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(username, refreshToken);
  }
}
