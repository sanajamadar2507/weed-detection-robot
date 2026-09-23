import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  greeting?: string;
  showSystemStatus?: boolean;
}

export const Header: React.FC<Props> = ({
  greeting = 'Good Morning',
  showSystemStatus = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>{greeting}</Text>
        <View style={styles.brandRow}>
          <Text style={styles.appName}>{APP_CONFIG.appName}</Text>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={10} color={THEME.colors.primary} />
            <Text style={styles.aiBadgeText}>AI ROBOT</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{APP_CONFIG.subtitle}</Text>
      </View>

      <View style={styles.right}>
        {showSystemStatus && (
          <View style={styles.statusBadge}>
            <View style={styles.greenPulse} />
            <Text style={styles.statusBadgeText}>SYSTEM READY</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingTop: 8,
  },
  left: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMutedDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 4,
  },
  aiBadgeText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textMutedDark,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primary,
  },
  statusBadgeText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
