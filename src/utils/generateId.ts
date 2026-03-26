import { customAlphabet } from 'nanoid';

// Define your alphabet (no lookalikes like 'l' and '1' or 'O' and '0' if you want)
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const generateId = customAlphabet(alphabet, 8);
