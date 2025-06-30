import { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';

export default function CaptureScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const message = 'Sorry, we need camera roll permissions to select photos.';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Permission Required', message);
      }
      return false;
    }
    return true;
  };

  const selectPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Photo selection error:', error);
      const errorMessage = 'Failed to select photo. Please try again.';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      const message = 'Sorry, we need camera permissions to take photos.';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Permission Required', message);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      const errorMessage = 'Failed to take photo. Please try again.';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToEdit = () => {
    if (!selectedImage) return;
    
    console.log('Navigating to editor with image:', selectedImage);
    router.push(`/editor?imageUri=${encodeURIComponent(selectedImage)}`);
  };

  const renderCameraInterface = () => (
    <View style={styles.cameraContainer}>
      <Text style={styles.instructionText}>Point at clouds and tap to capture</Text>
      
      <View style={styles.viewfinder}>
        <View style={styles.guidanceCircle}>
          <View style={styles.dashedBorder} />
        </View>
      </View>
      
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.galleryButton} onPress={selectPhoto}>
          <Text style={styles.galleryButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={takePhoto}
          disabled={isLoading}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <View style={styles.placeholder} />
      </View>
    </View>
  );

  const renderPhotoPreview = () => (
    <View style={styles.previewContainer}>
      <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      
      <View style={styles.previewActions}>
        <Button
          title="Use This Photo"
          onPress={proceedToEdit}
          style={styles.usePhotoButton}
        />
        
        <Button
          title="Retake"
          variant="outline"
          onPress={() => setSelectedImage(null)}
          style={styles.retakeButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedImage ? renderPhotoPreview() : renderCameraInterface()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cameraContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  instructionText: {
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 40,
  },
  guidanceCircle: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedBorder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  galleryButton: {
    flex: 1,
  },
  galleryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  placeholder: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  previewImage: {
    flex: 1,
    borderRadius: 20,
    marginBottom: 30,
  },
  previewActions: {
    gap: 16,
    paddingBottom: 40,
  },
  usePhotoButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 18,
  },
  retakeButton: {
    borderColor: Colors.gray600,
    borderRadius: 25,
    paddingVertical: 18,
  },
});