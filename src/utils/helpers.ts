// EASING FUNCTIONS
export const easeInCubic = (t: number) => {
  return t * t * t;
};
export const easeInQuad = (t: number) => {
  return t * t;
};

// TAKE A VALUE AND OUTPUT A RANDOM NEW VALUE WITHIN +/- RANGE
export const wobble = (val: number, range: number) => {
  const dir = Math.random() > 0.5 ? 1 : -1;
  const variance = 1.0 + dir * Math.random() * range;
  const wob = variance * val;
  if (wob < 0 || wob > 1.0) {
    return val;
  }

  return wob;
};

// GET RANDOM INDEX OF ITEM IN ARRAY
export const getRandomIndex = (len: number) => {
  return Math.floor(Math.random() * len);
};

// MAP A NUMBER FROM ONE RANGE TO A DIFFERENT RANGE
export const mapTo = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  const amount = value / (fromMax - fromMin);

  return toMin + amount * (toMax - toMin);
};
