import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { DoodleGridProps } from '@/types';

const { width } = Dimensions.get('window');
const GRID_PADDING = 32;
const GRID_GAP = 16;
const DEFAULT_ITEM_SIZE = (width - GRID_PADDING - GRID_GAP) / 2;

export function DoodleGrid({
  doodles,
  onItemPress,
  itemSize = DEFAULT_ITEM_SIZE,
  showDetails = false,
}: DoodleGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderDoodleItem = (doodle: any) => (
    <TouchableOpacity
      key={doodle.id}
      style={[styles.gridItem, { width: itemSize }]}
      onPress={() => onItemPress(doodle)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: doodle.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Overlay with like button */}
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.likeButton}>
            <Heart
              size={16}
              color={doodle.isLiked ? Colors.error : Colors.white}
              fill={doodle.isLiked ? Colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {showDetails && (
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {doodle.title}
          </Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemDate}>
              {formatDate(doodle.createdAt)}
            </Text>
            <View style={styles.likesContainer}>
              <Heart size={12} color={Colors.gray500} />
              <Text style={styles.likesCount}>{doodle.likes}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {doodles.map(renderDoodleItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: GRID_GAP,
  },
  gridItem: {
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 8,
  },
  likeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    paddingTop: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 12,
    color: Colors.gray500,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesCount: {
    fontSize: 12,
    color: Colors.gray500,
  },
});