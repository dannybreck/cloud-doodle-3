import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, CreditCard as Edit3, Share2, Chrome as Home } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { featuredDoodles } from '@/constants/MockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.appTitle}>
        <Text style={styles.cloudText}>CLOUD</Text>{'\n'}
        <Text style={styles.doodleText}>DOODLE</Text>
      </Text>
      
      <Text style={styles.subtitle}>
        Turn any cloud photo into a{'\n'}whimsical doodle in seconds
      </Text>
    </View>
  );

  const renderFeaturedCarousel = () => (
    <View style={styles.carouselSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
        snapToInterval={width * 0.7}
        decelerationRate="fast"
      >
        {featuredDoodles.map((item, index) => (
          <TouchableOpacity key={item.id} style={styles.carouselCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
            
            {/* Doodle Overlay */}
            <View style={styles.doodleOverlay}>
              {renderDoodleOverlay(item.doodleType)}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Carousel Indicators */}
      <View style={styles.indicators}>
        {featuredDoodles.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.indicator,
              index === 0 && styles.activeIndicator
            ]} 
          />
        ))}
      </View>
    </View>
  );

  const renderDoodleOverlay = (type: string) => {
    // Simple SVG-like overlays for each doodle type
    switch (type) {
      case 'sheep':
        return (
          <View style={styles.sheepDoodle}>
            <View style={styles.sheepBody} />
            <View style={styles.sheepHead} />
            <Text style={styles.doodleEmoji}>🐑</Text>
          </View>
        );
      case 'dragon':
        return <Text style={styles.doodleEmoji}>🐉</Text>;
      case 'bird':
        return <Text style={styles.doodleEmoji}>🐦</Text>;
      case 'whale':
        return <Text style={styles.doodleEmoji}>🐋</Text>;
      default:
        return null;
    }
  };

  const renderGetStartedSection = () => (
    <View style={styles.getStartedSection}>
      <Button
        title="GET STARTED"
        onPress={() => router.push('/(tabs)/capture')}
        style={styles.getStartedButton}
      />
    </View>
  );

  const renderHowItWorksSection = () => (
    <View style={styles.howItWorksSection}>
      <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
      
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Camera size={32} color={Colors.accent} />
          </View>
          <Text style={styles.stepTitle}>Take photo</Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Edit3 size={32} color={Colors.accent} />
          </View>
          <Text style={styles.stepTitle}>Draw doodle</Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Share2 size={32} color={Colors.accent} />
          </View>
          <Text style={styles.stepTitle}>Share</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderFeaturedCarousel()}
        {renderGetStartedSection()}
        {renderHowItWorksSection()}
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
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  appTitle: {
    textAlign: 'center',
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 50,
    marginBottom: 24,
  },
  cloudText: {
    color: Colors.primary,
  },
  doodleText: {
    color: Colors.accent,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  carouselSection: {
    paddingBottom: 40,
  },
  carouselContainer: {
    paddingHorizontal: 24,
  },
  carouselCard: {
    width: width * 0.65,
    height: 200,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  doodleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheepDoodle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheepBody: {
    width: 60,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    marginBottom: 8,
  },
  sheepHead: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  doodleEmoji: {
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray600,
  },
  activeIndicator: {
    backgroundColor: Colors.accent,
  },
  getStartedSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 18,
  },
  howItWorksSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});