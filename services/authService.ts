import { User } from '../types';

const STORAGE_KEY_USER = 'omnimind_user';
const STORAGE_KEY_USERS_DB = 'omnimind_users_db';

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY_USER);
  return stored ? JSON.parse(stored) : null;
};

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const db = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
  const user = db.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const sessionUser = { id: user.id, email: user.email, name: user.name };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
  return sessionUser;
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const db = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
  
  if (db.find((u: any) => u.email === email)) {
    throw new Error('Email already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password // In a real app, never store plain text passwords!
  };

  db.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));

  const sessionUser = { id: newUser.id, email: newUser.email, name: newUser.name };
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
  return sessionUser;
};

export const logout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem(STORAGE_KEY_USER);
};