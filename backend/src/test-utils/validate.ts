import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDto<T extends object>(
  cls: new () => T,
  payload: Record<string, unknown>,
) {
  const instance = plainToInstance(cls, payload);
  return validate(instance);
}

export function hasError(errors, property: string): boolean {
  return errors.some((error) => error.property === property);
}
