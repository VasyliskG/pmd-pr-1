// app/(tabs)/settings.tsx
import React from 'react';
import { StyleSheet, ScrollView, View, Switch, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
    const { theme, isSessionOnly, toggleTheme, toggleSessionOnly } = useAppStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <ThemedView style={styles.section}>
                <ThemedText type="title" style={styles.sectionTitle}>Зовнішній вигляд</ThemedText>

                <View style={[styles.settingRow, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <View style={styles.settingLeft}>
                        <IconSymbol size={22} name={theme === 'dark' ? 'moon.fill' : 'sun.max.fill'} color="#007AFF" />
                        <ThemedText style={styles.settingLabel}>Тема</ThemedText>
                    </View>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: '#81B0FF' }}
                        thumbColor={theme === 'dark' ? '#007AFF' : '#f4f3f4'}
                    />
                </View>
            </ThemedView>

            <ThemedView style={styles.section}>
                <ThemedText type="title" style={styles.sectionTitle}>Приватність</ThemedText>

                <View style={[styles.settingRow, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <View style={styles.settingLeft}>
                        <IconSymbol size={22} name="lock.shield.fill" color="#FF9500" />
                        <View style={styles.settingTextContainer}>
                            <ThemedText style={styles.settingLabel}>Режим сесії</ThemedText>
                            <ThemedText style={styles.settingDescription}>
                                Не зберігати пости після виходу
                            </ThemedText>
                        </View>
                    </View>
                    <Switch
                        value={isSessionOnly}
                        onValueChange={toggleSessionOnly}
                        trackColor={{ false: '#767577', true: '#FF9500' }}
                        thumbColor={isSessionOnly ? '#FF9500' : '#f4f3f4'}
                    />
                </View>

                {isSessionOnly && (
                    <View style={styles.warningBox}>
                        <IconSymbol size={18} name="exclamationmark.triangle.fill" color="#FF9500" />
                        <ThemedText style={styles.warningText}>
                            У режимі сесії список постів не зберігається в пам'яті пристрою
                        </ThemedText>
                    </View>
                )}
            </ThemedView>

            <ThemedView style={styles.section}>
                <ThemedText type="title" style={styles.sectionTitle}>Інформація</ThemedText>

                <View style={[styles.infoRow, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <ThemedText style={styles.infoLabel}>Стан зберігання</ThemedText>
                    <ThemedText style={[styles.infoValue, { color: isSessionOnly ? '#FF9500' : '#34C759' }]}>
                        {isSessionOnly ? 'Тимчасове' : 'Постійне'}
                    </ThemedText>
                </View>
            </ThemedView>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        margin: 16,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingTextContainer: {
        gap: 2,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: 12,
        opacity: 0.6,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    warningText: {
        flex: 1,
        fontSize: 12,
        color: '#FF9500',
        lineHeight: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    infoLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});