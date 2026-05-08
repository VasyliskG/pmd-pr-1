// app/(tabs)/posts.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export default function PostsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async () => {
        try {
            setError(null);
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            if (!response.ok) {
                throw new Error('Помилка завантаження постів');
            }
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError('Не вдалося завантажити пости. Перевірте з\'єднання.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <ThemedText style={{ marginTop: 16 }}>Завантаження постів...</ThemedText>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ThemedText type="title" style={{ color: '#ff3b30' }}>Помилка</ThemedText>
                <ThemedText style={{ marginTop: 8, textAlign: 'center' }}>{error}</ThemedText>
                <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
                    <ThemedText style={styles.retryText}>Спробувати знову</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}
                        onPress={() => router.push(`/post-details?id=${item.id}`)}
                    >
                        <ThemedText type="defaultSemiBold" numberOfLines={2}>
                            {item.title}
                        </ThemedText>
                        <ThemedText style={styles.cardSubtitle} numberOfLines={3}>
                            {item.body}
                        </ThemedText>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </ThemedView>
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
    listContent: {
        padding: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardSubtitle: {
        marginTop: 8,
        opacity: 0.7,
        lineHeight: 20,
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
    },
});