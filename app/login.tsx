import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, useColorScheme, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './providers/AuthProvider';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSubmit = async () => {
    setError(null);
    const ok = await signIn(username.trim(), password);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      setError('Неправильний логін або пароль');
    }
  };

  const bg = isDark ? '#0D1117' : '#EEF2FF';
  const accentTop = isDark ? '#1E293B' : '#C7D2FE';
  const cardBg = isDark ? '#1C1F26' : '#FFFFFF';
  const textColor = isDark ? '#E2E8F0' : '#1E293B';
  const subTextColor = isDark ? '#94A3B8' : '#64748B';
  const inputBg = isDark ? '#252B36' : '#F1F5F9';
  const inputBorder = isDark ? '#374151' : '#CBD5E1';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      {/* Decorative top accent band */}
      <View style={[styles.topBand, { backgroundColor: accentTop }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.centered}>
          {/* App logo / brand */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🔐</Text>
            <Text style={[styles.appName, { color: textColor }]}>Мій Додаток</Text>
          </View>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: cardBg, shadowColor: isDark ? '#000' : '#94A3B8' }]}>
            <Text style={[styles.title, { color: textColor }]}>Вхід до акаунту</Text>
            <Text style={[styles.subtitle, { color: subTextColor }]}>Введіть ваші облікові дані</Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: subTextColor }]}>{'Ім\'я користувача'}</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="наприклад: alice або bob"
                placeholderTextColor={placeholderColor}
                style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }]}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: subTextColor }]}>Пароль</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={placeholderColor}
                secureTextEntry
                style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }]}
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️  {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, !username.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={!username.trim()}
            >
              <Text style={styles.buttonText}>Увійти →</Text>
            </TouchableOpacity>
          </View>

          {/* Hint box */}
          <View style={[styles.hintBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: isDark ? '#334155' : '#BFDBFE' }]}>
            <Text style={[styles.hintTitle, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>💡 Тестові облікові записи</Text>
            <Text style={[styles.hintText, { color: subTextColor }]}>alice / password</Text>
            <Text style={[styles.hintText, { color: subTextColor }]}>bob / 123456</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  topBand: { height: 6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 28 },
  logoEmoji: { fontSize: 52, marginBottom: 8 },
  appName: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  card: {
    width: '100%',
    maxWidth: 440,
    padding: 28,
    borderRadius: 20,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: { color: '#B91C1C', fontSize: 14 },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  hintBox: {
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  hintTitle: { fontWeight: '700', marginBottom: 6, fontSize: 13 },
  hintText: { fontSize: 13 },
});
