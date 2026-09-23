import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList, RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { Header } from '../components/Header';
import { RobotStatusCard } from '../components/RobotStatusCard';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { StorageService } from '../storage/storageService';
import { DashboardStats, HistoryItem } from '../models/history';
import { getRobotService } from '../services/robot';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type TabNavProp = BottomTabNavigationProp<BottomTabParamList, 'Dashboard'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export const DashboardScreen: React.FC = () => {
  const tabNavigation = useNavigation<TabNavProp>();
  const rootNavigation = useNavigation<RootNavProp>();

  const [stats, setStats] = useState<DashboardStats>({
    todayScans: 24,
    weedsDetected: 15,
    noWeedDetected: 9,
    sprayDecisions: 15,
    reviewRequiredCount: 2,
    detectionAccuracy: 94.2,
    isDemoData: true,
  });
  const [recentScan, setRecentScan] = useState<HistoryItem | null>(null);
  const robotService = getRobotService();

  const loadData = useCallback(async () => {
    const loadedStats = await StorageService.getDashboardStats();
    setStats(loadedStats);

    const history = await StorageService.getHistory();
    if (history.length > 0) {
      setRecentScan(history[0]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleCaptureImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        // If camera permission denied or running on desktop/web/emulator without camera,
        // navigate to Detect screen where sample presets and gallery selection are readily available!
        tabNavigation.navigate('Detect');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        tabNavigation.navigate('Detect', { initialUri: result.assets[0].uri });
      }
    } catch {
      tabNavigation.navigate('Detect');
    }
  };

  const handleUploadImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        tabNavigation.navigate('Detect');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        tabNavigation.navigate('Detect', { initialUri: result.assets[0].uri });
      }
    } catch {
      tabNavigation.navigate('Detect');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Greeting and App Identity */}
        <Header greeting="Good Morning" showSystemStatus={true} />

        {/* Robot Status Card */}
        <RobotStatusCard
          status={robotService.getStatus()}
          onPressManage={() => tabNavigation.navigate('Robot')}
        />

        {/* Main Action Callouts: Capture & Upload */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.captureBtn]}
            onPress={handleCaptureImage}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="camera" size={24} color="#064E3B" />
            </View>
            <View>
              <Text style={styles.actionBtnTitle}>CAPTURE IMAGE</Text>
              <Text style={styles.actionBtnSubtitle}>Live Camera Feed</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.uploadBtn]}
            onPress={handleUploadImage}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Ionicons name="cloud-upload" size={24} color="#60A5FA" />
            </View>
            <View>
              <Text style={[styles.actionBtnTitle, { color: '#F8FAFC' }]}>UPLOAD IMAGE</Text>
              <Text style={styles.actionBtnSubtitle}>Gallery & Test Set</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Detection Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Detection</Text>
          {recentScan && (
            <TouchableOpacity onPress={() => tabNavigation.navigate('History')}>
              <Text style={styles.seeAllText}>View History</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentScan ? (
          <TouchableOpacity
            style={styles.recentCard}
            onPress={() => rootNavigation.navigate('Details', { item: recentScan })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: recentScan.imageUri }} style={styles.recentThumb} />
            <View style={styles.recentInfo}>
              <View style={styles.recentTop}>
                <StatusBadge decision={recentScan.decision} size="sm" />
                <Text style={styles.recentTime}>
                  {new Date(recentScan.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text style={styles.recentClass}>
                {recentScan.detected ? `Weed Target (${(recentScan.confidence * 100).toFixed(0)}%)` : 'Healthy Crop (Clean)'}
              </Text>
              <Text style={styles.recentModel} numberOfLines={1}>
                {recentScan.model}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" style={styles.recentArrow} />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyRecentCard}>
            <Ionicons name="leaf-outline" size={28} color="#64748B" />
            <Text style={styles.emptyRecentTitle}>No Scans Yet</Text>
            <Text style={styles.emptyRecentSubtitle}>
              Tap Capture or Upload to initiate AI weed detection.
            </Text>
          </View>
        )}

        {/* Statistics Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Today's Scans"
            value={stats.todayScans}
            subtitle="Processed frames"
            icon="scan-outline"
            color="#3B82F6"
          />
          <StatCard
            title="Weeds Detected"
            value={stats.weedsDetected}
            subtitle="Target locations"
            icon="alert-circle-outline"
            color="#EF4444"
          />
          <StatCard
            title="Spray Decisions"
            value={stats.sprayDecisions}
            subtitle="Micro-pulse actions"
            icon="water-outline"
            color="#10B981"
          />
          <StatCard
            title="Detection Accuracy"
            value={`${stats.detectionAccuracy}%`}
            subtitle="Validation accuracy"
            icon="analytics-outline"
            color="#F59E0B"
          />
        </View>

        {/* Project Info Card */}
        <TouchableOpacity
          style={styles.aboutBanner}
          onPress={() => rootNavigation.navigate('About')}
          activeOpacity={0.8}
        >
          <View style={styles.aboutBannerLeft}>
            <Ionicons name="leaf" size={24} color={THEME.colors.primary} />
            <View>
              <Text style={styles.aboutBannerTitle}>Autonomous WeedGuard System</Text>
              <Text style={styles.aboutBannerSubtitle}>
                AI-Powered Weed Detection & Smart Spraying Architecture
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color={THEME.colors.primary} />
        </TouchableOpacity>
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
    paddingBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 110,
  },
  captureBtn: {
    backgroundColor: THEME.colors.primary,
  },
  uploadBtn: {
    backgroundColor: THEME.colors.cardDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 78, 59, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtnTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 0.5,
  },
  actionBtnSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
  },
  seeAllText: {
    color: THEME.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  demoNoticeBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  demoNoticeText: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 12,
    marginBottom: 24,
  },
  recentThumb: {
    width: 64,
    height: 64,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#334155',
    marginRight: 14,
  },
  recentInfo: {
    flex: 1,
  },
  recentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentTime: {
    fontSize: 11,
    color: '#64748B',
  },
  recentClass: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  recentModel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  recentArrow: {
    marginLeft: 8,
  },
  emptyRecentCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyRecentTitle: {
    color: THEME.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyRecentSubtitle: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  aboutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginTop: 8,
  },
  aboutBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  aboutBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  aboutBannerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
