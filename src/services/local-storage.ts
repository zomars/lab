export function getItem(key: string): string | null {
  return window.localStorage.getItem(key);
}

export function setItem(key: string, value: string): void {
  return window.localStorage.setItem(key, value);
}

export function removeItem(key: string): void {
  return window.localStorage.removeItem(key);
}
