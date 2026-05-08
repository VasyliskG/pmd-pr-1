// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAppStore } from './store/appStore';
import { useColorScheme } from '@/hooks/use-color-scheme';

function AuthGuard() {
    const { user } = useAppStore();
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
    const { user, theme } = useAppStore();
    const colorScheme = useColorScheme();

    // Використовуємо тему з магазину або системну
    const effectiveTheme = theme || colorScheme;

    return (
        <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
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
    const initializeStore = useAppStore((state) => state.initializeStore);

    useEffect(() => {
        // Ініціалізуємо магазин при запуску
        initializeStore().then(() => {
            setIsReady(true);
        });
    }, []);

    if (!isReady) {
        return <LoadingScreen />;
    }

    return (
        <RootLayoutNav />
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});