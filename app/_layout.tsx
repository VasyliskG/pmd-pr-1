// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from './providers/AuthProvider';

function AuthGuard() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/') return;

        const isAuthRoute = pathname === '/login';

        if (!user && !isAuthRoute) {
            router.replace('/login');
        } else if (user && isAuthRoute) {
            router.replace('/(tabs)');
        }
    }, [user, pathname]);

    return null;
}

function RootLayoutNav() {
    const { user } = useAuth();
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                {!user ? (
                    <Stack.Screen
                        name="login"
                        options={{
                            headerShown: false,
                            title: 'Вхід'
                        }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false,
                                title: 'Головна'
                            }}
                        />
                        <Stack.Screen
                            name="post-details"
                            options={{
                                title: 'Деталі поста',
                            }}
                        />
                        <Stack.Screen
                            name="modal"
                            options={{
                                presentation: 'modal',
                                title: 'Modal'
                            }}
                        />
                    </>
                )}
            </Stack>
            <AuthGuard />
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

function LoadingScreen() {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" />
        </View>
    );
}

export default function Root() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsReady(true), 100);
    }, []);

    if (!isReady) {
        return <LoadingScreen />;
    }

    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});