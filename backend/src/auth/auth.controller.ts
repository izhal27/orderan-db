import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/local/signup')
  signupLocal(@Body() authDto: AuthDto) {
    return this.authService.signupLocal(authDto);
  }

  @Post('/local/signin')
  signinLocal(@Body() authDto: AuthDto) {
    return this.authService.signinLocal(authDto);
  }

  @Post('/logout')
  @ApiBearerAuth()
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  @ApiBearerAuth()
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
