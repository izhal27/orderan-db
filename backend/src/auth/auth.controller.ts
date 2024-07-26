import { Body, Controller, NotImplementedException, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Tokens } from '../types';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/local/signup')
  @ApiCreatedResponse()
  signupLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(authDto);
  }

  @Post('/local/signin')
  @ApiOkResponse()
  signinLocal(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(authDto);
  }

  @Post('/logout')
  @ApiOkResponse()
  @ApiBearerAuth()
  logout() {
    return this.authService.logout(1);
  }

  @Post('/refresh')
  @ApiOkResponse()
  @ApiBearerAuth()
  refreshTokens(): Promise<Tokens> {
    throw new NotImplementedException();
  }
}
