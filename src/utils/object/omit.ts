export const omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  params: K,
) => {
  const newObj = { ...obj };
  params.forEach((param) => delete newObj[param]);
  return newObj as Omit<T, K[number]>;
};
