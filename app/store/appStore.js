// store/appStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// === AUTH SLICE ===
const createAuthSlice = (set, get) => ({
    userToken: null,
    user: null,

    login: async (token, userData) => {
        set({ userToken: token, user: userData });
        // Зберігаємо в AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    },

    logout: async () => {
        set({ userToken: null, user: null });
        // Видаляємо з AsyncStorage
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
    },

    // Ініціалізація стану при запуску
    initializeAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (token && user) {
                set({ userToken: token, user });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Auth initialization error:', error);
            return false;
        }
    },
});

// === SETTINGS SLICE ===
const createSettingsSlice = (set, get) => ({
    theme: 'light',
    language: 'uk',
    isSessionOnly: false,

    toggleTheme: async () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        // Зберігаємо налаштування завжди (незалежно від isSessionOnly)
        await AsyncStorage.setItem('theme', newTheme);
    },

    setLanguage: async (lang) => {
        set({ language: lang });
        await AsyncStorage.setItem('language', lang);
    },

    toggleSessionOnly: async () => {
        const newValue = !get().isSessionOnly;
        set({ isSessionOnly: newValue });
        await AsyncStorage.setItem('isSessionOnly', String(newValue));
    },

    // Ініціалізація налаштувань при запуску
    initializeSettings: async () => {
        try {
            const theme = await AsyncStorage.getItem('theme');
            const language = await AsyncStorage.getItem('language');
            const isSessionOnly = await AsyncStorage.getItem('isSessionOnly');

            const settings = {};
            if (theme) settings.theme = theme;
            if (language) settings.language = language;
            if (isSessionOnly !== null) settings.isSessionOnly = isSessionOnly === 'true';

            set(settings);
            return settings;
        } catch (error) {
            console.error('Settings initialization error:', error);
            return {};
        }
    },
});

// === DATA SLICE (POSTS) ===
const createDataSlice = (set, get) => ({
    posts: [],
    selectedPost: null,

    setPosts: async (posts) => {
        set({ posts });
        // Зберігаємо тільки якщо НЕ режим сесії
        if (!get().isSessionOnly) {
            await AsyncStorage.setItem('posts', JSON.stringify(posts));
        }
    },

    setSelectedPost: (post) => {
        set({ selectedPost: post });
    },

    clearPosts: async () => {
        set({ posts: [], selectedPost: null });
        if (!get().isSessionOnly) {
            await AsyncStorage.removeItem('posts');
        }
    },

    // Ініціалізація даних при запуску
    initializeData: async () => {
        try {
            // Якщо режим сесії — не відновлюємо пости
            if (get().isSessionOnly) {
                return [];
            }

            const postsStr = await AsyncStorage.getItem('posts');
            const posts = postsStr ? JSON.parse(postsStr) : [];
            set({ posts });
            return posts;
        } catch (error) {
            console.error('Data initialization error:', error);
            return [];
        }
    },
});

// === ОБ'ЄДНАННЯ ВСІХ SLICES ===
export const useAppStore = create((set, get) => ({
    ...createAuthSlice(set, get),
    ...createSettingsSlice(set, get),
    ...createDataSlice(set, get),

    // Функція для повної ініціалізації при запуску
    initializeStore: async () => {
        await get().initializeSettings();
        await get().initializeAuth();
        await get().initializeData();
    },
}));