import { CreateUserDto } from './create-user.dto';
import { hasError, validateDto } from '../../test-utils/validate';

describe('CreateUserDto', () => {
  it('should fail when username is empty', async () => {
    const errors = await validateDto(CreateUserDto, { username: '' });
    expect(hasError(errors, 'username')).toBe(true);
  });

  it('should fail when username has spaces', async () => {
    const errors = await validateDto(CreateUserDto, { username: 'user name' });
    expect(hasError(errors, 'username')).toBe(true);
  });

  it('should fail when email is invalid', async () => {
    const errors = await validateDto(CreateUserDto, {
      username: 'user123',
      email: 'invalid',
    });
    expect(hasError(errors, 'email')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const errors = await validateDto(CreateUserDto, {
      username: 'user123',
      password: '12345',
      email: 'user@email.com',
      name: 'User Name',
      image: '/image/path',
      blocked: false,
      roleId: 1,
    });
    expect(errors.length).toBe(0);
  });
});
