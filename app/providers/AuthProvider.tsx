import React, { createContext, useContext, useState } from 'react';

type User = {
  username: string;
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  users: { username: string; password: string; name?: string; email?: string }[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const hardcodedUsers = [
  { username: 'alice', password: 'password', name: 'Alice', email: 'alice@example.com' },
  { username: 'bob', password: '123456', name: 'Bob', email: 'bob@example.com' },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (username: string, password: string) => {
    // naive check against hardcoded users
    const found = hardcodedUsers.find(u => u.username === username && u.password === password);
    if (found) {
      setUser({ username: found.username, name: found.name, email: found.email });
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, users: hardcodedUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthProvider;
