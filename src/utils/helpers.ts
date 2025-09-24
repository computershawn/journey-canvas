import { Logger } from '../types';

// Easing functions
export const easeInCubic = (t: number) => {
  return t * t * t;
};
export const easeInQuad = (t: number) => {
  return t * t;
};

// Take a value and output a random new value within +/- range
export const wobble = (val: number, range: number) => {
  const dir = Math.random() > 0.5 ? 1 : -1;
  const variance = 1.0 + dir * Math.random() * range;
  const wob = variance * val;
  if (wob < 0 || wob > 1.0) {
    return val;
  }

  return wob;
};

// Get random index of item in array
export const getRandomIndex = (len: number) => {
  return Math.floor(Math.random() * len);
};

// Map a number from one range to a different range
export const mapTo = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number => {
  const amount = value / (fromMax - fromMin);

  return toMin + amount * (toMax - toMin);
};

// Log information to console, but only in development mode
export const loggy: Logger = {
  info: (...args: unknown[]) => {
    // Explicitly check for 'development' and 'test' to be safe…
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      console.info(...args);
    }
  },
  log: (...args: unknown[]) => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Errors are often crucial, so they're always logged regardless of the environment.
    console.error(...args);
  },
};

