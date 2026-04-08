import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from './providers/AuthProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // On mount or auth change, redirect to login if not authenticated
    // Delay navigation until after the Root layout has mounted to avoid
    // "Attempted to navigate before mounting the Root Layout component".
    const id = setTimeout(() => {
      if (!user) {
        // if not already on login, go to /login
        router.replace('/login');
      } else {
        // if authenticated, go to the main tabs
        router.replace('/(tabs)');
      }
    }, 50);

    return () => clearTimeout(id);
  }, [user]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
        <AuthRedirect />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
