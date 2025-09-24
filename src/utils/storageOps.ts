export const saveToLocalStorage = (key: string, value: unknown) => {
  const canUseLocalStorage = typeof window !== 'undefined';

  if (canUseLocalStorage) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = (key: string) => {
  const canUseLocalStorage = typeof window !== 'undefined';
  const u = canUseLocalStorage
    ? JSON.parse(localStorage.getItem(key) as string)
    : null;

  return u;
};

export const removeFromLocalStorage = (key: string) => {
  const canUseLocalStorage = typeof window !== 'undefined';
  if (canUseLocalStorage) {
    localStorage.removeItem(key);
  }
};
