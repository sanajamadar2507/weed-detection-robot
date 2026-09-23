import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, BottomTabParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { SampleImagePicker } from '../components/SampleImagePicker';
import { SamplePlantImage } from '../constants/samples';
import { getDetectionService } from '../services/ai';
import { StorageService } from '../storage/storageService';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
type DetectRouteProp = RouteProp<BottomTabParamList, 'Detect'>;

export const DetectScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<DetectRouteProp>();

  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SamplePlantImage | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.initialUri) {
      setSelectedUri(route.params.initialUri);
      setSelectedSample(null);
      setErrorMessage(null);
    }
  }, [route.params?.initialUri]);

  const handlePickFromGallery = async () => {
    setErrorMessage(null);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setErrorMessage('Gallery permission is required to select field plant photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedUri(result.assets[0].uri);
        setSelectedSample(null);
      }
    } catch (err: any) {
      setErrorMessage('Could not open image gallery: ' + err.message);
    }
  };

  const handleTakePhoto = async () => {
    setErrorMessage(null);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setErrorMessage('Camera permission is required to capture field plant photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedUri(result.assets[0].uri);
        setSelectedSample(null);
      }
    } catch (err: any) {
      setErrorMessage('Could not open camera: ' + err.message);
    }
  };

  const handleSelectSample = (sample: SamplePlantImage) => {
    setSelectedUri(sample.imageUri);
    setSelectedSample(sample);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedUri) {
      Alert.alert('No Image Selected', 'Please select or capture a plant image before starting analysis.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const threshold = await StorageService.getConfidenceThreshold();
      const detectionService = getDetectionService();

      let scenario: 'weed_high' | 'no_weed' | 'weed_low' | 'random' = 'weed_high';
      if (selectedSample) {
        if (selectedSample.category === 'healthy_crop') scenario = 'no_weed';
        else if (selectedSample.category === 'ambiguous_weed') scenario = 'weed_low';
        else scenario = 'weed_high';
      }

      const result = await detectionService.analyzeImage(selectedUri, {
        confidenceThreshold: threshold,
        simulateScenario: scenario,
      });

      setIsAnalyzing(false);
      navigation.navigate('Result', { detection: result });
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage('Detection analysis error: ' + (err.message || 'Unknown error'));
    }
  };

  const handleRetake = () => {
    setSelectedUri(null);
    setSelectedSample(null);
    setErrorMessage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Plant Detection</Text>
          <Text style={styles.screenSubtitle}>
            Capture crop canopy or upload high-resolution leaf imagery for AI weed identification.
          </Text>
        </View>

        {/* Error Notification */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Main Image Viewfinder / Preview Box */}
        <View style={styles.previewContainer}>
          {selectedUri ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedUri }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.imageOverlayBadge}>
                <Ionicons name="checkmark-done-circle" size={14} color="#10B981" />
                <Text style={styles.imageOverlayText}>
                  {selectedSample ? selectedSample.name : 'Custom Image Ready'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderBox}>
              <View style={styles.cameraIconCircle}>
                <Ionicons name="scan-outline" size={44} color={THEME.colors.primary} />
              </View>
              <Text style={styles.placeholderTitle}>Ready for AI analysis</Text>
              <Text style={styles.placeholderSubtitle}>
                Select an image below using camera, gallery, or presentation presets.
              </Text>
            </View>
          )}

          {/* Analyzing Loading Overlay */}
          {isAnalyzing && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={THEME.colors.primary} />
              <Text style={styles.loadingTitle}>Analyzing plant image...</Text>
              <Text style={styles.loadingSubtitle}>
                Running AI computer vision inference & boundary evaluation
              </Text>
            </View>
          )}
        </View>

        {/* Image Source Buttons */}
        <View style={styles.sourceButtonsRow}>
          <TouchableOpacity
            style={styles.sourceButton}
            onPress={handleTakePhoto}
            activeOpacity={0.8}
            disabled={isAnalyzing}
          >
            <Ionicons name="camera" size={20} color={THEME.colors.primary} />
            <Text style={styles.sourceButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sourceButton}
            onPress={handlePickFromGallery}
            activeOpacity={0.8}
            disabled={isAnalyzing}
          >
            <Ionicons name="images" size={20} color="#60A5FA" />
            <Text style={styles.sourceButtonText}>Select Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Field Sample Selector */}
        <SampleImagePicker
          selectedUri={selectedUri}
          onSelectSample={handleSelectSample}
        />

        {/* Action Buttons: [ANALYZE IMAGE], [RETAKE], [SELECT ANOTHER] */}
        {selectedUri && !isAnalyzing && (
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.analyzeBtn}
              onPress={handleAnalyze}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={20} color="#064E3B" />
              <Text style={styles.analyzeBtnText}>ANALYZE IMAGE</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={16} color="#94A3B8" />
                <Text style={styles.secondaryBtnText}>RETAKE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handlePickFromGallery}
                activeOpacity={0.8}
              >
                <Ionicons name="swap-horizontal" size={16} color="#94A3B8" />
                <Text style={styles.secondaryBtnText}>SELECT ANOTHER</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.backgroundDark,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMutedDark,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    flex: 1,
  },
  previewContainer: {
    width: '100%',
    height: 280,
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageOverlayText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  placeholderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cameraIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textLight,
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMutedDark,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 20,
  },
  loadingTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 6,
  },
  loadingSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 240,
  },
  sourceButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sourceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    paddingVertical: 12,
    gap: 8,
  },
  sourceButtonText: {
    color: THEME.colors.textLight,
    fontSize: 13,
    fontWeight: '700',
  },
  actionGroup: {
    marginTop: 10,
    gap: 12,
  },
  analyzeBtn: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.primary,
    height: 52,
    borderRadius: THEME.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeBtnText: {
    color: '#064E3B',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 10,
    gap: 6,
  },
  secondaryBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
});
