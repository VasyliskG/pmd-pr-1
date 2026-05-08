// app/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  username: string;
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const hardcodedUsers = [
  { username: 'alice', password: 'password', name: 'Alice', email: 'alice@example.com' },
  { username: 'bob', password: '123456', name: 'Bob', email: 'bob@example.com' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    // Імітуємо мережевий запит
    await new Promise(resolve => setTimeout(resolve, 500));

    const found = hardcodedUsers.find(
        u => u.username === username && u.password === password
    );

    if (found) {
      setUser({
        username: found.username,
        name: found.name,
        email: found.email
      });
    }

    setIsLoading(false);
    return !!found;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};