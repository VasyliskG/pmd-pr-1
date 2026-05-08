// app/(tabs)/profile.tsx
import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/appStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
    const { user, logout } = useAppStore();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleLogout = () => {
        Alert.alert(
            'Вихід з акаунту',
            'Ви впевнені, що хочете вийти?',
            [
                { text: 'Скасувати', style: 'cancel' },
                {
                    text: 'Вийти',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    }
                },
            ]
        );
    };

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>Користувач не знайдений</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                    <Text style={styles.avatarText}>
                        {(user.name ?? user.username).charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={[styles.userName, { color: isDark ? '#fff' : '#000' }]}>
                    {user.name ?? user.username}
                </Text>
                <Text style={[styles.userHandle, { color: isDark ? '#888' : '#666' }]}>
                    @{user.username}
                </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                <InfoRow
                    icon="person.fill"
                    label="Ім'я користувача"
                    value={user.username}
                    isDark={isDark}
                />
                {user.name && user.name !== user.username && (
                    <InfoRow
                        icon="person.badge.plus"
                        label="Повне ім'я"
                        value={user.name}
                        isDark={isDark}
                    />
                )}
                {user.email && (
                    <InfoRow
                        icon="envelope.fill"
                        label="Email"
                        value={user.email}
                        isDark={isDark}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <IconSymbol size={20} name="rectangle.portrait.and.arrow.right" color="#fff" />
                <Text style={styles.logoutButtonText}>Вийти з акаунту</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

function InfoRow({ icon, label, value, isDark }: {
    icon: string;
    label: string;
    value: string;
    isDark: boolean;
}) {
    return (
        <View style={styles.infoRow}>
            <IconSymbol size={18} name={icon} color={isDark ? '#666' : '#999'} />
            <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: isDark ? '#666' : '#999' }]}>
                    {label}
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        alignItems: 'center',
        padding: 30,
        paddingTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 14,
    },
    infoCard: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginHorizontal: 16,
        marginTop: 8,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        padding: 16,
        backgroundColor: '#ff3b30',
        borderRadius: 12,
        gap: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});