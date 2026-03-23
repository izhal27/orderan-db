import { CreateRoleDto } from './create-role.dto';
import { hasError, validateDto } from '../../test-utils/validate';

describe('CreateRoleDto', () => {
  it('should fail when name is empty', async () => {
    const errors = await validateDto(CreateRoleDto, { name: '' });
    expect(hasError(errors, 'name')).toBe(true);
  });

  it('should fail when name has spaces', async () => {
    const errors = await validateDto(CreateRoleDto, { name: 'Role Admin' });
    expect(hasError(errors, 'name')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const errors = await validateDto(CreateRoleDto, {
      name: 'Admin',
      description: 'Role for admin',
    });
    expect(errors.length).toBe(0);
  });
});
