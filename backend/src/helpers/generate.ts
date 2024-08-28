import * as randomstring from 'randomstring';

export const orderNumber = (preFix: string, length: number = 3): string => {
  const now = new Date();
  const year = now.getFullYear().toString().substring(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const randomStr = randomstring.generate({
    charset: 'alphabetic',
    length,
    capitalization: 'uppercase',
  });
  // preFix = 'DB-'
  // length = 4
  // result => DB-240801xxxx
  const number = preFix + year + month + date + randomStr;
  return number;
};
