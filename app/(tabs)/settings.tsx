import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Platform, StatusBar, useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg = isDark ? '#0D1117' : '#F8FAFC';
  const cardBg = isDark ? '#1C1F26' : '#FFFFFF';
  const textColor = isDark ? '#E2E8F0' : '#1E293B';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';
  const dividerColor = isDark ? '#2D3748' : '#E2E8F0';
  const accentColor = '#4F46E5';

  const handleLogout = () => {
    signOut();
    router.replace('/login');
  };

  const initials = user
    ? (user.name ?? user.username).slice(0, 2).toUpperCase()
    : '??';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.pageTitle, { color: textColor }]}>Налаштування</Text>

        {/* User info card */}
        <View style={[styles.card, { backgroundColor: cardBg, shadowColor: isDark ? '#000' : '#94A3B8' }]}>
          <Text style={[styles.sectionLabel, { color: subTextColor }]}>ОБЛІКОВИЙ ЗАПИС</Text>

          <View style={styles.userRow}>
            {/* Avatar circle */}
            <View style={[styles.avatar, { backgroundColor: accentColor }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={styles.userInfo}>
              {user ? (
                <>
                  <Text style={[styles.userName, { color: textColor }]}>
                    {user.name ?? user.username}
                  </Text>
                  {user.name ? (
                    <Text style={[styles.userMeta, { color: subTextColor }]}>
                      @{user.username}
                    </Text>
                  ) : null}
                  {user.email ? (
                    <Text style={[styles.userMeta, { color: subTextColor }]}>
                      {user.email}
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text style={[styles.userName, { color: subTextColor }]}>
                  Не авторизовано
                </Text>
              )}
            </View>
          </View>

          {user ? (
            <>
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />

              {/* Detail rows */}
              {[
                { label: 'Логін', value: user.username },
                ...(user.name ? [{ label: 'Повне ім\'я', value: user.name }] : []),
                ...(user.email ? [{ label: 'Email', value: user.email }] : []),
              ].map(({ label, value }) => (
                <View key={label} style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: subTextColor }]}>{label}</Text>
                  <Text style={[styles.infoValue, { color: textColor }]}>{value}</Text>
                </View>
              ))}
            </>
          ) : null}
        </View>

        {/* Logout button */}
        {user ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={styles.logoutText}>🚪  Вийти з акаунту</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  scroll: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  userMeta: { fontSize: 13, marginTop: 2 },
  divider: { height: 1, marginVertical: 16 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
