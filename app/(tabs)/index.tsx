import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, SafeAreaView, useColorScheme, Platform, StatusBar, TextInput, Keyboard, Image, Modal
} from 'react-native';

interface CardDataItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
}

// --- Компонент картки для списку ---
const CardItem = ({ title, description, isDark, image, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
    <View style={styles.cardIconContainer}>
      {image ? (
        <Image source={{ uri: image }} style={styles.cardImage} />
      ) : (
        <Text style={{ fontSize: 24 }}>📷</Text>
      )}
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#000' }]}>{title}</Text>
      <Text style={[styles.cardSubtitle, { color: isDark ? '#BBB' : '#666' }]}>{description}</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'list' | 'addContent' | 'settings'>('list');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');

  const systemColorScheme = useColorScheme();

  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const [data, setData] = useState<CardDataItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [selectedItem, setSelectedItem] = useState<CardDataItem | null>(null);

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    const newItem: CardDataItem = {
      id: data.length,
      title: newTitle,
      description: newDescription,
      image: newImage.trim() ? newImage : null,
    };
    setData(prevData => [newItem, ...prevData]);
    setNewTitle('');
    setNewDescription('');
    setNewImage('');
    Keyboard.dismiss();
    setActiveTab('list');
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    setData(prevData => prevData.filter(item => item.id !== selectedItem.id));
    setSelectedItem(null);
  };

  // Динамічні кольори
  const bgColor = isDark ? '#121212' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const inputBgColor = isDark ? '#252525' : '#EAEAEA';
  const placeholderTextColor = isDark ? '#888' : '#666';

  const tabLabels = {
    list: 'Список',
    addContent: 'Додати',
    settings: 'Налаштування',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Навігація між екранами - спадне меню */}
      <View style={styles.pickerContainer}>
        <TouchableOpacity 
          style={[styles.pickerButton, { backgroundColor: inputBgColor }]} 
          onPress={() => setPickerVisible(true)}
        >
          <Text style={[styles.pickerButtonText, { color: textColor }]}>{tabLabels[activeTab]}</Text>
          <Text style={{ color: textColor }}>▼</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isPickerVisible}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#252525' : '#FFF' }]}>
            {(['list', 'addContent', 'settings'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={styles.modalOption}
                onPress={() => {
                  setActiveTab(tab);
                  setPickerVisible(false);
                }}
              >
                <Text style={{ color: textColor, fontWeight: activeTab === tab ? 'bold' : 'normal' }}>
                  {tabLabels[tab]}
                </Text>
                {activeTab === tab && <Text style={{ color: '#007AFF' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'list' ? (
          <View>
            <Text style={[styles.title, { color: textColor }]}>Ваш контент</Text>
            {data.map((item) => <CardItem key={item.id} {...item} isDark={isDark} onPress={() => setSelectedItem(item)} />)}
          </View>
        ) : activeTab === 'addContent' ? (
          <View style={styles.addContentContainer}>
            <Text style={[styles.title, { color: textColor }]}>Додати новий елемент</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
              placeholder="Назва елемента"
              placeholderTextColor={placeholderTextColor}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBgColor, color: textColor, height: 80 }]}
              placeholder="Опис елемента"
              placeholderTextColor={placeholderTextColor}
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />
            <TextInput
              style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
              placeholder="URL зображення (необов'язково)"
              placeholderTextColor={placeholderTextColor}
              value={newImage}
              onChangeText={setNewImage}
            />
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: '#007AFF' }]} 
              onPress={handleAddItem}
            >
              <Text style={styles.addButtonText}>Додати</Text>
            </TouchableOpacity>
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

      {selectedItem && (
        <Modal
          transparent={true}
          visible={!!selectedItem}
          animationType="fade"
          onRequestClose={() => setSelectedItem(null)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setSelectedItem(null)}>
            <View style={[styles.detailModalContent, { backgroundColor: isDark ? '#252525' : '#FFF' }]}>
              {selectedItem.image && <Image source={{ uri: selectedItem.image }} style={styles.detailImage} />}
              <Text style={[styles.detailTitle, { color: textColor }]}>{selectedItem.title}</Text>
              <Text style={[styles.detailDescription, { color: textColor }]}>{selectedItem.description}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteItem}
              >
                <Text style={styles.closeButtonText}>Видалити</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedItem(null)}
              >
                <Text style={styles.closeButtonText}>Закрити</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  pickerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 10,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
  },

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
  cardIconContainer: { marginRight: 15, justifyContent: 'center', width: 40, height: 40, alignItems: 'center' },
  cardImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 13, marginTop: 4 },
  addContentContainer: { gap: 15 },
  input: {
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  addButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  },
  detailModalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff0000ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  }
});
