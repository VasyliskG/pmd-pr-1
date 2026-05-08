// app/(tabs)/index.tsx
import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Ласкаво просимо!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Ваш додаток готовий до роботи
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">📱 Навігація</ThemedText>
          <ThemedText style={styles.cardText}>
            Використовуйте вкладки внизу для переміщення між екранами.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">🔐 Авторизація</ThemedText>
          <ThemedText style={styles.cardText}>
            Ваш стан входу активний. Перейдіть у Профіль для виходу.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">⚙️ Технології</ThemedText>
          <ThemedText style={styles.cardText}>
            Expo Router + React Context API = чиста навігація без зайвих залежностей
          </ThemedText>
        </ThemedView>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  cardText: {
    marginTop: 8,
    lineHeight: 22,
  },
});