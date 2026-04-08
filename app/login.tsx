import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './providers/AuthProvider';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    setError(null);
    const ok = await signIn(username.trim(), password);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      setError('Неправильний логін або пароль');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Вхід</Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Ім'я користувача"
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Пароль"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Увійти</Text>
        </TouchableOpacity>

        <View style={styles.hintContainer}>
          <Text style={styles.hintTitle}>Тестові користувачі:</Text>
          <Text style={styles.hintText}>alice / password</Text>
          <Text style={styles.hintText}>bob / 123456</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, padding: 24, borderRadius: 12, backgroundColor: '#fff', elevation: 3 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#ff3b30', marginBottom: 8, textAlign: 'center' },
  hintContainer: { marginTop: 12 },
  hintTitle: { fontWeight: '600', marginBottom: 4 },
  hintText: { color: '#666' },
});
