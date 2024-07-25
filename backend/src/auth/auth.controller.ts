import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/local/signup')
  signupLocal() {
    return this.authService.signupLocal();
  }

  @Post('/local/signin')
  signinLocal() {
    return this.authService.signinLocal();
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
