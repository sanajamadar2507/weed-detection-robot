import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { StorageService } from '../storage/storageService';
import { Ionicons } from '@expo/vector-icons';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const [threshold, setThreshold] = useState<number>(APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    async function loadSettings() {
      const savedThreshold = await StorageService.getConfidenceThreshold();
      setThreshold(savedThreshold);

      const savedTheme = await StorageService.getThemeMode();
      setThemeMode(savedTheme);
    }
    loadSettings();
  }, []);

  const handleSelectThreshold = async (val: number) => {
    setThreshold(val);
    await StorageService.setConfidenceThreshold(val);
  };

  const handleToggleTheme = async (mode: 'dark' | 'light') => {
    setThemeMode(mode);
    await StorageService.setThemeMode(mode);
  };

  const handleResetDefaults = () => {
    Alert.alert(
      'Reset System Defaults',
      'Reset confidence threshold to system defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await StorageService.setConfidenceThreshold(APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD);
            setThreshold(APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD);
            Alert.alert('Reset', 'Settings restored to system defaults.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Settings</Text>
          <Text style={styles.screenSubtitle}>
            Configure AI computer vision thresholds, hardware endpoints, and display modes.
          </Text>
        </View>

        {/* Section: Detection Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="scan-circle-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.sectionTitle}>DETECTION SETTINGS</Text>
          </View>

          <Text style={styles.settingLabel}>AI Spray Confidence Threshold</Text>
          <Text style={styles.settingDesc}>
            Detections above this percentage automatically trigger a `SPRAY_REQUIRED` decision.
            Detections below this percentage default to `REVIEW_REQUIRED` for human safety.
          </Text>

          {/* Threshold Picker Buttons */}
          <View style={styles.thresholdRow}>
            {APP_CONFIG.AVAILABLE_THRESHOLDS.map((val) => {
              const isSelected = Math.abs(threshold - val) < 0.001;
              return (
                <TouchableOpacity
                  key={val.toString()}
                  style={[styles.thresholdPill, isSelected && styles.thresholdPillActive]}
                  onPress={() => handleSelectThreshold(val)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.thresholdText, isSelected && styles.thresholdTextActive]}
                  >
                    {(val * 100).toFixed(0)}%
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.currentThresholdBox}>
            <Text style={styles.currentThresholdLabel}>Active Safe Threshold:</Text>
            <Text style={styles.currentThresholdVal}>{(threshold * 100).toFixed(0)}%</Text>
          </View>
        </View>

        {/* Section: Robot Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hardware-chip-outline" size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>ROBOT SETTINGS</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Connection Interface</Text>
            <Text style={styles.infoVal}>Wi-Fi 802.11 b/g/n</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Hardware State</Text>
            <View style={styles.statusBadgeMuted}>
              <View style={styles.redDot} />
              <Text style={styles.statusBadgeText}>Ready to Connect</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Default Target IP</Text>
            <Text style={styles.infoVal}>{APP_CONFIG.DEFAULT_ESP32_IP}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Control Port</Text>
            <Text style={styles.infoVal}>{APP_CONFIG.DEFAULT_ESP32_PORT}</Text>
          </View>
        </View>

        {/* Section: Appearance */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>APPEARANCE</Text>
          </View>

          <View style={styles.themeToggleRow}>
            <TouchableOpacity
              style={[styles.themeOption, themeMode === 'dark' && styles.themeOptionActive]}
              onPress={() => handleToggleTheme('dark')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="moon"
                size={18}
                color={themeMode === 'dark' ? '#34D399' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'dark' && styles.themeOptionTextActive,
                ]}
              >
                Dark Mode (Default)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.themeOption, themeMode === 'light' && styles.themeOptionActive]}
              onPress={() => handleToggleTheme('light')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="sunny"
                size={18}
                color={themeMode === 'light' ? '#34D399' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'light' && styles.themeOptionTextActive,
                ]}
              >
                Light Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Data Management */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="folder-open-outline" size={20} color="#818CF8" />
            <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
          </View>

          <TouchableOpacity
            style={styles.dataActionBtn}
            onPress={() =>
              Alert.alert(
                'Clear Scan History',
                'All saved scan records will be permanently deleted. This cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                      await StorageService.clearHistory();
                      Alert.alert('Done', 'Scan history has been cleared.');
                    },
                  },
                ]
              )
            }
            activeOpacity={0.8}
          >
            <View style={styles.dataActionLeft}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <View>
                <Text style={styles.dataActionTitle}>Clear Scan History</Text>
                <Text style={styles.dataActionDesc}>Remove all saved detection records</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.dataActionBtn}
            onPress={() => navigation.navigate('About')}
            activeOpacity={0.8}
          >
            <View style={styles.dataActionLeft}>
              <Ionicons name="information-circle-outline" size={18} color={THEME.colors.primary} />
              <View>
                <Text style={styles.dataActionTitle}>System Architecture</Text>
                <Text style={styles.dataActionDesc}>View full system design overview</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Reset Defaults */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleResetDefaults}
          activeOpacity={0.8}
        >
          <Ionicons name="reload-outline" size={16} color="#94A3B8" />
          <Text style={styles.resetBtnText}>Reset System Defaults</Text>
        </TouchableOpacity>

        <Text style={styles.versionNotice}>
          WeedGuard AI v{APP_CONFIG.version} • Autonomous AgriTech System
        </Text>
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
  sectionCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    letterSpacing: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textLight,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 14,
  },
  thresholdRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  thresholdPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  thresholdPillActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primary,
  },
  thresholdText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '800',
  },
  thresholdTextActive: {
    color: '#FFFFFF',
  },
  currentThresholdBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  currentThresholdLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  currentThresholdVal: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoKey: {
    fontSize: 12,
    color: '#94A3B8',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.cardBorderDark,
    marginVertical: 8,
  },
  statusBadgeMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 6,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  statusBadgeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  themeToggleRow: {
    gap: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 10,
  },
  themeOptionActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  themeOptionText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  themeOptionTextActive: {
    color: THEME.colors.textLight,
  },
  dataActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dataActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dataActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textLight,
    marginBottom: 2,
  },
  dataActionDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  resetBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 12,
  },
  resetBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  versionNotice: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 11,
  },
});
