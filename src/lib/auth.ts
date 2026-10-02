// EU Grant Submission Engine - Authentication Module
// Uses localStorage for demo; Supabase integration ready for production

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'member' | 'viewer';
  organization?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_KEY = 'eu_grant_auth';
const USERS_KEY = 'eu_grant_users';

// Default demo users
const defaultUsers: User[] = [
  {
    id: 'usr_001',
    email: 'admin@eugrant.eu',
    name: 'Dr. Elena Martínez',
    role: 'admin',
    organization: 'European Research Institute',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'usr_002',
    email: 'coordinator@eugrant.eu',
    name: 'Prof. Hans Weber',
    role: 'coordinator',
    organization: 'Technical University of Munich',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'usr_003',
    email: 'member@eugrant.eu',
    name: 'Dr. Sophie Laurent',
    role: 'member',
    organization: 'CNRS France',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

export function initializeUsers(): void {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

export function getUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : defaultUsers;
}

export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email === email);
      
      // Demo: any password works for existing users
      if (user) {
        const authData = { user, token: `demo_token_${user.id}_${Date.now()}` };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials. Use: admin@eugrant.eu, coordinator@eugrant.eu, or member@eugrant.eu'));
      }
    }, 800);
  });
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    const { user } = JSON.parse(stored);
    return user;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function register(name: string, email: string, organization: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getUsers();
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name,
        role: 'member',
        organization,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const authData = { user: newUser, token: `demo_token_${newUser.id}_${Date.now()}` };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      resolve(newUser);
    }, 500);
  });
}
