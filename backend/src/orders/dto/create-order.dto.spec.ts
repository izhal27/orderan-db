import { CreateOrderDto } from './create-order.dto';
import { hasError, validateDto } from '../../test-utils/validate';

describe('CreateOrderDto', () => {
  const validOrderDetail = {
    name: 'FLEXY BANNER 280 GSM',
    price: 24000,
    width: 200,
    height: 100,
    qty: 2,
    design: 1,
    eyelets: false,
    shiming: false,
    description: 'Sample description',
  };

  it('should fail when customer is empty', async () => {
    const errors = await validateDto(CreateOrderDto, {
      date: new Date().toISOString(),
      customer: '',
      orderDetails: [validOrderDetail],
    });
    expect(hasError(errors, 'customer')).toBe(true);
  });

  it('should fail when orderDetails is not an array', async () => {
    const errors = await validateDto(CreateOrderDto, {
      date: new Date().toISOString(),
      customer: 'John Doe',
      orderDetails: 'invalid',
    });
    expect(hasError(errors, 'orderDetails')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const errors = await validateDto(CreateOrderDto, {
      date: new Date().toISOString(),
      customer: 'John Doe',
      description: 'Sample order',
      orderDetails: [validOrderDetail],
    });
    expect(errors.length).toBe(0);
  });
});
