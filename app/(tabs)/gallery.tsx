import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, CreditCard as Edit3 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { mockDoodles } from '@/constants/MockData';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Platform-agnostic storage helper
const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

export default function GalleryScreen() {
  const [doodles, setDoodles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isMountedRef = useRef(true);
  const router = useRouter();

  // Load doodles from localStorage and merge with mock data
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadDoodles = async () => {
      try {
        // Try to load from Supabase first
        const { data: supabaseDoodles, error } = await supabase
          .from('doodles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && supabaseDoodles) {
          // Transform Supabase data to match expected format
          const transformedDoodles = supabaseDoodles.map(doodle => ({
            id: doodle.id,
            title: doodle.title,
            description: doodle.description,
            imageUrl: doodle.image_url,
            drawingData: doodle.drawing_data,
            createdAt: doodle.created_at,
            likes: doodle.likes,
            isLiked: doodle.is_liked,
            tags: doodle.tags,
          }));
          
          // Also load from localStorage as fallback
          const savedDoodlesData = await getStorageItem('userDoodles');
          const savedDoodles = JSON.parse(savedDoodlesData || '[]');
          
          // Combine all doodles
          if (isMountedRef.current) {
            setDoodles([...transformedDoodles, ...savedDoodles, ...mockDoodles]);
          }
          return;
        }
      } catch (error) {
        console.log('Supabase load failed, trying localStorage:', error);
      }
      
      // Fallback to localStorage and mock data
      try {
        const savedDoodlesData = await getStorageItem('userDoodles');
        const savedDoodles = JSON.parse(savedDoodlesData || '[]');
        if (isMountedRef.current) {
          setDoodles([...savedDoodles, ...mockDoodles]);
        }
      } catch (error) {
        console.log('localStorage failed, using mock data:', error);
        if (isMountedRef.current) {
          setDoodles(mockDoodles);
        }
      }
    };
    
    loadDoodles();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const onRefresh = async () => {
    if (isMountedRef.current) {
      setRefreshing(true);
    }
    
    // Reload doodles from all sources
    try {
      const { data: supabaseDoodles, error } = await supabase
        .from('doodles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && supabaseDoodles) {
        const transformedDoodles = supabaseDoodles.map(doodle => ({
          id: doodle.id,
          title: doodle.title,
          description: doodle.description,
          imageUrl: doodle.image_url,
          drawingData: doodle.drawing_data,
          createdAt: doodle.created_at,
          likes: doodle.likes,
          isLiked: doodle.is_liked,
          tags: doodle.tags,
        }));
        
        const savedDoodlesData = await getStorageItem('userDoodles');
        const savedDoodles = JSON.parse(savedDoodlesData || '[]');
        if (isMountedRef.current) {
          setDoodles([...transformedDoodles, ...savedDoodles, ...mockDoodles]);
        }
      } else {
        const savedDoodlesData = await getStorageItem('userDoodles');
        const savedDoodles = JSON.parse(savedDoodlesData || '[]');
        if (isMountedRef.current) {
          setDoodles([...savedDoodles, ...mockDoodles]);
        }
      }
    } catch (error) {
      const savedDoodlesData = await getStorageItem('userDoodles');
      const savedDoodles = JSON.parse(savedDoodlesData || '[]');
      if (isMountedRef.current) {
        setDoodles([...savedDoodles, ...mockDoodles]);
      }
    }
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setRefreshing(false);
      }
    }, 1500);
  };

  const handleDoodlePress = (doodle: any) => {
    router.push(`/editor?imageUri=${encodeURIComponent(doodle.imageUrl)}&editMode=true&title=${encodeURIComponent(doodle.title)}`);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>My Doodles</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDoodleGrid = () => (
    <View style={styles.gridContainer}>
      {doodles.map((doodle, index) => (
        <TouchableOpacity
          key={doodle.id}
          style={styles.doodleCard}
          onPress={() => handleDoodlePress(doodle)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: doodle.imageUrl }}
            style={styles.doodleImage}
            resizeMode="cover"
          />
          
          {/* Doodle overlay based on title */}
          <View style={styles.doodleOverlay}>
            {renderDoodleForCard(doodle.title)}
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={16} color={Colors.accent} />
          </TouchableOpacity>
          
          <View style={styles.doodleInfo}>
            <Text style={styles.doodleTitle} numberOfLines={2}>
              {doodle.title}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDoodleForCard = (title: string) => {
    if (title.toLowerCase().includes('sheep')) {
      return <Text style={styles.doodleEmoji}>🐑</Text>;
    } else if (title.toLowerCase().includes('dragon')) {
      return <Text style={styles.doodleEmoji}>🐉</Text>;
    } else if (title.toLowerCase().includes('bird')) {
      return <Text style={styles.doodleEmoji}>🐦</Text>;
    } else if (title.toLowerCase().includes('whale')) {
      return <Text style={styles.doodleEmoji}>🐋</Text>;
    } else if (title.toLowerCase().includes('heart')) {
      return <Text style={styles.doodleEmoji}>💗</Text>;
    } else if (title.toLowerCase().includes('bunny')) {
      return <Text style={styles.doodleEmoji}>🐰</Text>;
    }
    return <Text style={styles.doodleEmoji}>☁️</Text>;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyEmoji}>📱</Text>
        <Text style={styles.cloudEmoji}>☁️</Text>
        <Text style={styles.brushEmoji}>🖌️</Text>
      </View>
      
      <Text style={styles.emptyTitle}>No doodles yet!</Text>
      <Text style={styles.emptySubtitle}>
        Capture your first cloud photo{'\n'}to get started
      </Text>
      
      <Button
        title="Start Creating"
        onPress={() => router.push('/(tabs)/capture')}
        style={styles.startButton}
      />
    </View>
  );

  if (doodles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderDoodleGrid()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  doodleCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  doodleImage: {
    width: '100%',
    height: '75%',
  },
  doodleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doodleEmoji: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doodleInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    padding: 12,
    justifyContent: 'center',
  },
  doodleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIcon: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    color: Colors.gray600,
  },
  cloudEmoji: {
    fontSize: 32,
    position: 'absolute',
    top: -10,
    right: -20,
  },
  brushEmoji: {
    fontSize: 28,
    position: 'absolute',
    bottom: -5,
    left: -15,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
});