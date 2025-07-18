// utils/validators.ts
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@gmail\.com$/i.test(email);

export const validatePassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password);
