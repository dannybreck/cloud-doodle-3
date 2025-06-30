import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import Svg, { Path, Image as SvgImage } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Eraser, RotateCcw, Save, Trash2, Sticker } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DrawPath {
  path: string;
  color: string;
  width: number;
}

interface Asset {
  id: string;
  type: 'sticker';
  x: number;
  y: number;
  uri: string;
  width: number;
  height: number;
}

interface DrawingHistory {
  paths: DrawPath[];
  assets: Asset[];
}

export default function EditorScreen() {
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [isErasing, setIsErasing] = useState(false);
  const [history, setHistory] = useState<DrawingHistory[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [doodleTitle, setDoodleTitle] = useState('');

  const pathRef = useRef('');
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPath = `M${locationX.toFixed(2)},${locationY.toFixed(2)}`;
        pathRef.current = newPath;
        setCurrentPath(newPath);
      },

      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPath = `${pathRef.current} L${locationX.toFixed(2)},${locationY.toFixed(2)}`;
        pathRef.current = newPath;
        setCurrentPath(newPath);
      },

      onPanResponderRelease: () => {
        if (pathRef.current) {
          const newDrawPath: DrawPath = {
            path: pathRef.current,
            color: isErasing ? '#FFFFFF' : currentColor,
            width: isErasing ? currentWidth * 2 : currentWidth,
          };
          
          setPaths(prev => [...prev, newDrawPath]);
          setCurrentPath('');
          pathRef.current = '';
        }
      },
    })
  ).current;

  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, { paths: [...paths], assets: [...assets] }]);
  }, [paths, assets]);

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setPaths(lastState.paths);
      setAssets(lastState.assets);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const handleClearCanvas = () => {
    const clearAction = () => {
      saveToHistory();
      setPaths([]);
      setAssets([]);
      setCurrentPath('');
      pathRef.current = '';
      setSelectedAsset(null);
    };

    if (Platform.OS === 'web') {
      const result = confirm('Clear all drawings and stickers?');
      if (result) {
        clearAction();
      }
    } else {
      Alert.alert(
        'Clear Canvas',
        'Clear all drawings and stickers?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear', 
            style: 'destructive',
            onPress: clearAction
          },
        ]
      );
    }
  };

  const handleSave = async () => {
    if (!doodleTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your doodle');
      return;
    }

    try {
      // Simulate saving process
      const imageUri = 'data:image/png;base64,example'; // This would be generated from the canvas
      
      const doodleData = {
        title: doodleTitle,
        description: `Created ${new Date().toLocaleDateString()}`,
        imageUrl: imageUri,
        drawingData: {
          paths: paths,
          assets: assets,
        },
        createdAt: new Date().toISOString(),
      };

      console.log('Saving doodle:', doodleData);
      
      Alert.alert('Success', 'Doodle saved successfully!');
      setShowSaveModal(false);
      setDoodleTitle('');
    } catch (error) {
      console.error('Error saving doodle:', error);
      Alert.alert('Error', 'Failed to save doodle');
    }
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
  ];

  const widths = [1, 3, 5, 8, 12];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Doodle Editor</Text>
        <TouchableOpacity onPress={() => setShowSaveModal(true)} style={styles.saveButton}>
          <Save size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <Svg
            height="100%"
            width="100%"
            style={StyleSheet.absoluteFillObject}
          >
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path.path}
                stroke={path.color}
                strokeWidth={path.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="transparent"
              />
            ))}
            {currentPath && (
              <Path
                d={currentPath}
                stroke={isErasing ? '#FFFFFF' : currentColor}
                strokeWidth={isErasing ? currentWidth * 2 : currentWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="transparent"
              />
            )}
            {assets.map((asset) => (
              <SvgImage
                key={asset.id}
                x={asset.x}
                y={asset.y}
                width={asset.width}
                height={asset.height}
                href={asset.uri}
                opacity={selectedAsset === asset.id ? 0.7 : 1}
              />
            ))}
          </Svg>
        </View>
      </View>

      {/* Tools */}
      <View style={styles.toolsContainer}>
        {/* Color Palette */}
        <View style={styles.colorPalette}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                currentColor === color && styles.selectedColor,
              ]}
              onPress={() => {
                setCurrentColor(color);
                setIsErasing(false);
              }}
            />
          ))}
        </View>

        {/* Width Selection */}
        <View style={styles.widthSelector}>
          {widths.map((width) => (
            <TouchableOpacity
              key={width}
              style={[
                styles.widthButton,
                currentWidth === width && styles.selectedWidth,
              ]}
              onPress={() => setCurrentWidth(width)}
            >
              <View
                style={[
                  styles.widthIndicator,
                  {
                    width: width * 2,
                    height: width * 2,
                    backgroundColor: currentColor,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.toolButton, isErasing && styles.activeTool]}
            onPress={() => setIsErasing(!isErasing)}
          >
            <Eraser size={24} color={isErasing ? '#007AFF' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={handleUndo}
            disabled={history.length === 0}
          >
            <RotateCcw size={24} color={history.length > 0 ? '#666' : '#CCC'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={handleClearCanvas}>
            <Trash2 size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Modal */}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Doodle</Text>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Enter doodle title..."
              value={doodleTitle}
              onChangeText={setDoodleTitle}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    padding: 8,
  },
  canvasContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  toolsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  widthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  widthButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedWidth: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  widthIndicator: {
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activeTool: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveModalButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});