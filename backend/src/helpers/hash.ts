import * as bcrypt from 'bcrypt';

export const hashValue = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const compareValue = (
  data: string,
  encrypted: string,
): Promise<boolean> => {
  return bcrypt.compare(data, encrypted);
};
