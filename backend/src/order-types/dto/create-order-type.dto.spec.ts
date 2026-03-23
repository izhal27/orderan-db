import { CreateOrderTypeDto } from './create-order-type.dto';
import { hasError, validateDto } from '../../test-utils/validate';

describe('CreateOrderTypeDto', () => {
  it('should fail when name is too short', async () => {
    const errors = await validateDto(CreateOrderTypeDto, { name: 'ABCD' });
    expect(hasError(errors, 'name')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const errors = await validateDto(CreateOrderTypeDto, {
      name: 'FLEXY BANNER',
      price: 12000,
      description: 'Sample description',
    });
    expect(errors.length).toBe(0);
  });
});
