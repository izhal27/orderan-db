export const isContain = (value: string, search: string) => {
  const regex = new RegExp(`\\b${search}\\b`, 'i');
  return regex.test(value);
}