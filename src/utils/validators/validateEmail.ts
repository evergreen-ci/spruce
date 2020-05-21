export const validateEmail = (v: string): boolean => /\S+@\S+\.\S+/.test(v);
