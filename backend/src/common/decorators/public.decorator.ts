import { SetMetadata } from '@nestjs/common';

import { IS_PUBLIC } from '../../types/constants';

export const Public = () => SetMetadata(IS_PUBLIC, true);
