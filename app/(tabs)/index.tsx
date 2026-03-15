import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, SafeAreaView, useColorScheme, Platform, StatusBar 
} from 'react-native';

// --- Компонент картки для списку ---
const CardItem = ({ title, description, icon, isDark }: any) => (
  <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
    <View style={styles.cardIconContainer}><Text style={{ fontSize: 24 }}>{icon}</Text></View>
    <View style={styles.cardTextContainer}>
      <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#000' }]}>{title}</Text>
      <Text style={[styles.cardSubtitle, { color: isDark ? '#BBB' : '#666' }]}>{description}</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list');
  
  // 1. Стан для вибору режиму теми: 'system', 'light', або 'dark'
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');
  
  // 2. Отримуємо системну тему пристрою
  const systemColorScheme = useColorScheme();
  
  // 3. Визначаємо, яку тему відображати прямо зараз
  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const data = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Пункт меню ${i + 1}`,
    description: `Опис елемента у ${isDark ? 'темній' : 'світлій'} темі.`,
    icon: i % 2 === 0 ? '🎨' : '⚙️'
  }));

  // Динамічні кольори
  const bgColor = isDark ? '#121212' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Навігація між екранами */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'list' && (isDark ? styles.activeTabDark : styles.activeTabLight)]} 
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'list' ? '#FFF' : (isDark ? '#AAA' : '#666') }]}>Список</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'settings' && (isDark ? styles.activeTabDark : styles.activeTabLight)]} 
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'settings' ? '#FFF' : (isDark ? '#AAA' : '#666') }]}>Налаштування</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'list' ? (
          <View>
            <Text style={[styles.title, { color: textColor }]}>Ваш контент</Text>
            {data.map((item) => <CardItem key={item.id} {...item} isDark={isDark} />)}
          </View>
        ) : (
          <View style={styles.settingsContainer}>
            <Text style={[styles.title, { color: textColor }]}>Вибір теми</Text>
            
            {/* Кнопки вибору теми */}
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <TouchableOpacity 
                key={mode}
                style={[
                  styles.themeOption, 
                  themeMode === mode && styles.themeOptionSelected,
                  { backgroundColor: isDark ? '#252525' : '#EAEAEA' }
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <Text style={{ color: textColor, fontWeight: themeMode === mode ? 'bold' : 'normal' }}>
                  {mode === 'system' ? '🤖 Системна' : mode === 'light' ? '☀️ Світла' : '🌙 Темна'}
                </Text>
                {themeMode === mode && <Text style={{ color: '#007AFF' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  activeTabLight: { backgroundColor: '#007AFF' },
  activeTabDark: { backgroundColor: '#555' },
  tabText: { fontWeight: '600' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  // Картки
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardIconContainer: { marginRight: 15, justifyContent: 'center' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 13, marginTop: 4 },
  // Налаштування
  settingsContainer: { gap: 10 },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  themeOptionSelected: {
    borderWidth: 1,
    borderColor: '#007AFF',
  }
});
