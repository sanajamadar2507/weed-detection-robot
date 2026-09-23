import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  LayoutChangeEvent,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { BoundingBoxOverlay } from '../components/BoundingBoxOverlay';
import { StorageService } from '../storage/storageService';
import { Ionicons } from '@expo/vector-icons';

type ResultRouteProp = RouteProp<RootStackParamList, 'Result'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<ResultRouteProp>();
  const { detection } = route.params;

  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const [isSaved, setIsSaved] = useState(false);

  const handleImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setImageLayout({ width, height });
  };

  const handleSave = async () => {
    if (isSaved) return;
    try {
      await StorageService.saveDetection(detection);
      await StorageService.recordScan(detection);
      setIsSaved(true);
      Alert.alert('Saved', 'AI Detection result saved to local history.');
    } catch {
      Alert.alert('Error', 'Failed to save detection record.');
    }
  };

  const handleViewDetails = () => {
    navigation.navigate('Details', { item: detection });
  };

  const handleBackToDashboard = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>AI DETECTION RESULT</Text>
            <View style={styles.demoPill}>
              <Text style={styles.demoPillText}>AI VISION MODEL</Text>
            </View>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Main Image with AI Bounding Box Overlay */}
        <View style={styles.imageCard} onLayout={handleImageLayout}>
          <Image source={{ uri: detection.imageUri }} style={styles.resultImage} resizeMode="cover" />

          {/* Render bounding box over weed if detected */}
          {detection.detected && detection.boundingBox && imageLayout.width > 0 && (
            <BoundingBoxOverlay
              box={detection.boundingBox}
              containerWidth={imageLayout.width}
              containerHeight={imageLayout.height}
              color={THEME.colors.spray}
            />
          )}

          <View style={styles.imageBadge}>
            <Ionicons name="scan" size={14} color="#34D399" />
            <Text style={styles.imageBadgeText}>
              {detection.detected ? '1 Weed Identified' : 'Clean Field - No Weeds'}
            </Text>
          </View>
        </View>

        {/* Primary Decision Banner */}
        <View style={styles.decisionBanner}>
          <Text style={styles.bannerLabel}>AUTOMATED DECISION</Text>
          <View style={styles.badgeWrapper}>
            <StatusBadge decision={detection.decision} size="lg" />
          </View>
          <Text style={styles.decisionReason}>{detection.decisionReason}</Text>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.metricsCard}>
          <Text style={styles.metricsTitle}>Analysis Breakdown</Text>

          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Detection Class</Text>
              <Text style={styles.metricValue}>
                {detection.detected ? 'WEED DETECTED' : 'NO WEED DETECTED'}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>AI Confidence</Text>
              <Text style={[styles.metricValue, { color: THEME.colors.primary }]}>
                {(detection.confidence * 100).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Detected Objects</Text>
              <Text style={styles.metricValue}>
                {detection.objectCount} {detection.objectCount === 1 ? 'Weed' : 'Objects'}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Crop Canopy</Text>
              <Text style={[styles.metricValue, { color: '#38BDF8' }]}>Detected (Healthy)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Processing Latency</Text>
              <Text style={styles.metricValue}>{detection.processingTimeMs} ms</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Inference Model</Text>
              <Text style={[styles.metricValue, { fontSize: 11, color: '#A5B4FC' }]}>
                {detection.model}
              </Text>
            </View>
          </View>
        </View>

        {/* Hardware Status Note */}
        <View style={styles.hardwareNote}>
          <Ionicons name="hardware-chip-outline" size={16} color="#94A3B8" />
          <Text style={styles.hardwareNoteText}>
            Status: Analysis complete. Decision logged and queued for actuator dispatch.
          </Text>
        </View>

        {/* Bottom Actions: [VIEW DETAILS], [SAVE RESULT], [BACK TO DASHBOARD] */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.saveBtn, isSaved && styles.savedBtn]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={isSaved}
          >
            <Ionicons
              name={isSaved ? 'checkmark-circle' : 'bookmark-outline'}
              size={18}
              color={isSaved ? '#10B981' : '#F8FAFC'}
            />
            <Text style={styles.btnText}>{isSaved ? 'RESULT SAVED' : 'SAVE RESULT'}</Text>
          </TouchableOpacity>

          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.btn, styles.secondaryBtn]}
              onPress={handleViewDetails}
              activeOpacity={0.8}
            >
              <Ionicons name="list-outline" size={18} color="#94A3B8" />
              <Text style={styles.secondaryBtnText}>VIEW DETAILS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.secondaryBtn]}
              onPress={handleBackToDashboard}
              activeOpacity={0.8}
            >
              <Ionicons name="home-outline" size={18} color="#94A3B8" />
              <Text style={styles.secondaryBtnText}>DASHBOARD</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.colors.cardDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
  },
  demoPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  demoPillText: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '800',
  },
  imageCard: {
    width: '100%',
    height: 270,
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageBadgeText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  decisionBanner: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    letterSpacing: 1,
    marginBottom: 10,
  },
  badgeWrapper: {
    marginBottom: 10,
  },
  decisionReason: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
  },
  metricsCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    marginBottom: 14,
  },
  metricsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.cardBorderDark,
    marginVertical: 10,
  },
  hardwareNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    gap: 8,
    marginBottom: 20,
  },
  hardwareNoteText: {
    color: '#94A3B8',
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  actions: {
    gap: 10,
  },
  btn: {
    height: 48,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveBtn: {
    backgroundColor: THEME.colors.primaryDark,
  },
  savedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: THEME.colors.cardDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
  },
  secondaryBtnText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
});
