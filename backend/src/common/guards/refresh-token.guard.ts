import { AuthGuard } from '@nestjs/passport';

import { JWT_REFRESH } from '../../constants/constants';

export class RefreshTokenGuard extends AuthGuard(JWT_REFRESH) {
  constructor() {
    super();
  }
}
