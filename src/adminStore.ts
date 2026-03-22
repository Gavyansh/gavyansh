const ADMIN_KEY = 'gavyansh-admin-unlocked';
const ADMIN_PIN_KEY = 'gavyansh-admin-pin';

/** Default PIN; override with VITE_ADMIN_PIN if needed */
const DEFAULT_ADMIN_PIN = '7781';

export function getAdminPin(): string {
  return import.meta.env.VITE_ADMIN_PIN || DEFAULT_ADMIN_PIN;
}

export function isAdminUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_KEY) === 'true';
}

export function isAdminPinVerified(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_PIN_KEY) === 'true';
}

export function unlockAdmin(): void {
  sessionStorage.setItem(ADMIN_KEY, 'true');
}

/** Returns true if PIN matches */
export function submitAdminPin(pin: string): boolean {
  const expected = getAdminPin();
  if (pin.trim() === expected) {
    sessionStorage.setItem(ADMIN_PIN_KEY, 'true');
    return true;
  }
  return false;
}

export function lockAdmin(): void {
  sessionStorage.removeItem(ADMIN_KEY);
  sessionStorage.removeItem(ADMIN_PIN_KEY);
}
