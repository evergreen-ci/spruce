export const validateEmail = (v: string): boolean => v.match(".+@.+") !== null;
