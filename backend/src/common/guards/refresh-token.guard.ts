import { AuthGuard } from '@nestjs/passport';

import { JWT_REFRESH } from '../../types/constants';

export class RefreshTokenGuard extends AuthGuard(JWT_REFRESH) {
  constructor() {
    super();
  }
}
