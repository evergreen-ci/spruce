import { deleteNestedKey } from "./deleteNestedKey";

export const omit = <T extends object, K extends [...(keyof T)[]]>(
  obj: T,
  params: K,
) => {
  const newObj = { ...obj };
  params.forEach((param) => deleteNestedKey(newObj, param as string));
  return newObj as Omit<T, K[number]>;
};
