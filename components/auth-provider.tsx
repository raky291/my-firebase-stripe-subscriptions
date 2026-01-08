'use client';

import { createContext } from 'react';
import { Auth } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const AuthContext = createContext<Auth>(auth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
