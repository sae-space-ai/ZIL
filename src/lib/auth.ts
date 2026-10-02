// EU Grant Submission Engine - User Module (No Authentication Required)

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'member' | 'viewer';
  organization?: string;
  avatar?: string;
  createdAt: string;
}

// Default user for free access
export const defaultUser: User = {
  id: 'usr_default',
  email: 'user@eugrant.eu',
  name: 'EU Grant User',
  role: 'admin',
  organization: 'European Research Institute',
  createdAt: new Date().toISOString(),
};

export function getCurrentUser(): User {
  return defaultUser;
}

export function isAuthenticated(): boolean {
  return true; // Always authenticated
}
