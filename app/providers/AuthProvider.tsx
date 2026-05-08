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
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Тестові облікові записи для демонстрації
const TEST_USERS = [
  { email: 'user@example.com', password: 'password123', name: 'Test User' },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Робимо реальний HTTP запит до JSONPlaceholder для демонстрації
      // Це імітує перевірку користувача через API
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');

      if (!response.ok) {
        throw new Error('API unavailable');
      }

      // Імітуємо затримку мережі
      await new Promise(resolve => setTimeout(resolve, 800));

      // Перевіряємо локально (для навчальних цілей)
      const found = TEST_USERS.find(
          u => u.email === email && u.password === password
      );

      if (found) {
        setUser({
          username: email.split('@')[0],
          name: found.name,
          email: email,
        });
        return true;
      } else {
        setError('Невірний email або пароль');
        return false;
      }
    } catch (err) {
      setError('Помилка з\'єднання. Перевірте інтернет.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
  };

  return (
      <AuthContext.Provider value={{ user, isLoading, signIn, signOut, error }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};