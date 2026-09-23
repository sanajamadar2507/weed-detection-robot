import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { StorageService } from '../storage/storageService';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
}

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const handleGetStarted = async () => {
    await StorageService.setCompletedOnboarding(true);
    navigation.replace('MainTabs');
  };

  const steps = [
    {
      step: '1',
      title: 'Capture',
      desc: 'Capture or upload a crop image directly from the field or choose from demonstration samples.',
      icon: 'camera' as const,
      color: '#10B981',
    },
    {
      step: '2',
      title: 'Detect',
      desc: 'AI computer vision analyzes the crop canopy and highlights invasive weeds with bounding boxes.',
      icon: 'scan' as const,
      color: '#3B82F6',
    },
    {
      step: '3',
      title: 'Decide',
      desc: 'The decision engine checks confidence levels to mandate SPRAY, NO SPRAY, or REVIEW actions.',
      icon: 'git-network' as const,
      color: '#F59E0B',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SMART AGRICULTURE WORKFLOW</Text>
          </View>
          <Text style={styles.title}>How WeedGuard AI Works</Text>
          <Text style={styles.subtitle}>
            An automated three-stage pipeline designed for precise herbicide application and crop preservation.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((item) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={[styles.stepIconBox, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
                <View style={[styles.stepNumBadge, { backgroundColor: item.color }]}>
                  <Text style={styles.stepNumText}>{item.step}</Text>
                </View>
              </View>

              <View style={styles.stepTextContent}>
                <Text style={styles.stepTitle}>
                  {item.step}. {item.title}
                </Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.systemBox}>
          <Ionicons name="shield-checkmark" size={18} color={THEME.colors.primary} />
          <Text style={styles.systemText}>
            Precision Agriculture: Real-time neural vision and smart spray decisions save herbicide and protect crop yield.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted} activeOpacity={0.8}>
          <Text style={styles.buttonText}>GET STARTED</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.backgroundDark,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textMutedDark,
    lineHeight: 20,
  },
  stepsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.cardDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    gap: 16,
  },
  stepIconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stepNumBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textLight,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: THEME.colors.textMutedDark,
    lineHeight: 18,
  },
  systemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: THEME.borderRadius.md,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  systemText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: THEME.colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.cardBorderDark,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.primary,
    height: 52,
    borderRadius: THEME.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#064E3B',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
