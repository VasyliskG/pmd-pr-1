// app/login.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from './store/appStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const login = useAppStore((state) => state.login);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Введіть email та пароль');
      return;
    }

    setIsLoading(true);

    try {
      // Імітуємо API запит (оскільки reqres.in вимагає ключ)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Перевіряємо облікові дані локально
      const validUsers = [
        { email: 'test@example.com', password: 'password123', name: 'Test User' },
        { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
      ];

      const found = validUsers.find(
          u => u.email === email.trim() && u.password === password.trim()
      );

      if (found) {
        // Зберігаємо користувача в магазині
        await login('fake-token-' + Date.now(), {
          username: email.split('@')[0],
          name: found.name,
          email: email.trim(),
        });
        router.replace('/(tabs)');
      } else {
        setError('Невірний email або пароль');
      }
    } catch (err) {
      setError('Помилка з\'єднання. Перевірте інтернет.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
      >
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Вхід</Text>
            <Text style={styles.subtitle}>Введіть дані для входу</Text>

            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
                returnKeyType="next"
            />

            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Пароль"
                secureTextEntry
                style={styles.input}
                editable={!isLoading}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
              {isLoading ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.buttonText}>Увійти</Text>
              )}
            </TouchableOpacity>

            <View style={styles.hintContainer}>
              <Text style={styles.hintTitle}>Тестові облікові записи:</Text>
              <View style={styles.hintRow}>
                <Text style={styles.hintLabel}>test@example.com</Text>
                <Text style={styles.hintValue}>password123</Text>
              </View>
              <View style={styles.hintRow}>
                <Text style={styles.hintLabel}>admin@example.com</Text>
                <Text style={styles.hintValue}>admin123</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: {
    color: '#ff3b30',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#FFE5E5',
    padding: 8,
    borderRadius: 6,
  },
  hintContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  hintTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  hintLabel: { color: '#666', fontFamily: 'monospace' },
  hintValue: { color: '#007AFF', fontFamily: 'monospace', fontWeight: '600' },
});