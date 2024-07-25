import { Injectable } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) { }

  signupLocal(authDto: AuthDto) {
    return this.userService.signupLocal(authDto);
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
}
