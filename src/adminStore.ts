const ADMIN_KEY = 'gavyansh-admin-unlocked';

export function isAdminUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_KEY) === 'true';
}

export function unlockAdmin(): void {
  sessionStorage.setItem(ADMIN_KEY, 'true');
}

export function lockAdmin(): void {
  sessionStorage.removeItem(ADMIN_KEY);
}
