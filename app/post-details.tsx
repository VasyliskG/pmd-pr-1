// app/post-details.tsx
import React, { useEffect, useState } from 'react';
import {
    StyleSheet, ScrollView, View, ActivityIndicator, TouchableOpacity,
    Image, Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export default function PostDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
                if (!response.ok) {
                    throw new Error('Помилка завантаження поста');
                }
                const data = await response.json();
                setPost(data);
            } catch (err) {
                Alert.alert('Помилка', 'Не вдалося завантажити пост');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleCreateCalendarEvent = async () => {
        if (!post) return;

        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Дозвіл необхідний',
                    'Для створення події в календарі потрібен дозвіл на доступ.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const calendars = await Calendar.getDefaultCalendarsAsync();
            const defaultCalendar = calendars[0];

            if (!defaultCalendar) {
                Alert.alert('Помилка', 'Не вдалося знайти календар за замовчуванням');
                return;
            }

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0);

            const endDate = new Date(tomorrow);
            endDate.setHours(11, 0, 0, 0);

            await Calendar.createEventAsync(defaultCalendar.id, {
                title: `Переглянути пост: ${post.title}`,
                startDate: tomorrow,
                endDate: endDate,
                notes: post.body,
            });

            Alert.alert('Успішно', 'Подію додано до календаря!');
        } catch (err) {
            Alert.alert('Помилка', 'Не вдалося створити подію в календарі');
        }
    };

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Дозвіл необхідний',
                    'Для вибору зображення потрібен дозвіл на доступ до медіатеки.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (err) {
            Alert.alert('Помилка', 'Не вдалося вибрати зображення');
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <ThemedText style={{ marginTop: 16 }}>Завантаження...</ThemedText>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ThemedText type="title" style={{ color: '#ff3b30' }}>Помилка</ThemedText>
                <ThemedText style={{ marginTop: 8 }}>Не вдалося завантажити пост</ThemedText>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <ThemedView style={styles.card}>
                <ThemedText type="title" style={styles.title}>
                    {post.title}
                </ThemedText>

                <View style={styles.metaRow}>
                    <IconSymbol size={16} name="person.fill" color={isDark ? '#888' : '#666'} />
                    <ThemedText style={styles.metaText}>Автор: {post.userId}</ThemedText>
                </View>

                <ThemedText style={styles.body}>{post.body}</ThemedText>
            </ThemedView>

            {selectedImage && (
                <ThemedView style={styles.imageCard}>
                    <ThemedText type="defaultSemiBold" style={styles.imageTitle}>
                        Прикріплене зображення
                    </ThemedText>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                        resizeMode="cover"
                    />
                </ThemedView>
            )}

            <ThemedView style={styles.actionsCard}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
                    onPress={handleCreateCalendarEvent}
                >
                    <IconSymbol size={20} name="calendar.badge.plus" color="#007AFF" />
                    <ThemedText style={styles.actionButtonText}>
                        Створити нагадування в календарі
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
                    onPress={handlePickImage}
                >
                    <IconSymbol size={20} name="photo.on.rectangle" color="#007AFF" />
                    <ThemedText style={styles.actionButtonText}>
                        Прикріпити зображення
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    metaText: {
        fontSize: 14,
        opacity: 0.7,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.9,
    },
    imageCard: {
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageTitle: {
        marginBottom: 12,
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    actionsCard: {
        margin: 16,
        marginTop: 0,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '500',
    },
});