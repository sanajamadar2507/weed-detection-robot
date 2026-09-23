import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon,
  color = THEME.colors.primary,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}1A` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textLight,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMutedDark,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
