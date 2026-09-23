import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { StorageService } from '../storage/storageService';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const pulseAnim = React.useRef(new Animated.Value(0.9)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(async () => {
      const completed = await StorageService.hasCompletedOnboarding();
      if (completed) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Onboarding');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={48} color={THEME.colors.primary} />
          <View style={styles.radarRing} />
        </View>

        <Text style={styles.title}>{APP_CONFIG.appName}</Text>
        <Text style={styles.subtitle}>{APP_CONFIG.projectTitle}</Text>
        <Text style={styles.tagline}>{APP_CONFIG.subtitle}</Text>

        <View style={styles.badge}>
          <Ionicons name="hardware-chip-outline" size={14} color="#34D399" />
          <Text style={styles.badgeText}>AUTONOMOUS AGRI-ROBOT</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>WeedGuard System • v{APP_CONFIG.version}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  radarRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 12,
    color: THEME.colors.textMutedDark,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 280,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  badgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
