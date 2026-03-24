import { CreateCustomerDto } from './create-customer.dto';
import { hasError, validateDto } from '../../test-utils/validate';

describe('CreateCustomerDto', () => {
  it('should fail when name is empty', async () => {
    const errors = await validateDto(CreateCustomerDto, { name: '' });
    expect(hasError(errors, 'name')).toBe(true);
  });

  it('should fail when email is invalid', async () => {
    const errors = await validateDto(CreateCustomerDto, {
      name: 'John Doe',
      email: 'invalid',
    });
    expect(hasError(errors, 'email')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const errors = await validateDto(CreateCustomerDto, {
      name: 'John Doe',
      address: '27th Street',
      contact: '+6212345',
      email: 'customer@email.com',
      description: 'Regular customer',
    });
    expect(errors.length).toBe(0);
  });

  it('should pass when only name is provided', async () => {
    const errors = await validateDto(CreateCustomerDto, {
      name: 'John Doe',
    });
    expect(errors.length).toBe(0);
  });

  it('should pass when email is empty string', async () => {
    const errors = await validateDto(CreateCustomerDto, {
      name: 'John Doe',
      email: '',
    });
    expect(errors.length).toBe(0);
  });
});
