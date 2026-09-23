import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';
import { RobotConnectionStatus } from '../models/robot';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  status: RobotConnectionStatus;
  onPressManage?: () => void;
}

export const RobotStatusCard: React.FC<Props> = ({ status, onPressManage }) => {
  let statusColor = '#94A3B8'; // gray
  let statusText = 'Disconnected';
  let badgeBg = 'rgba(148, 163, 184, 0.15)';

  if (status === 'Connected') {
    statusColor = THEME.colors.healthy;
    statusText = 'Connected';
    badgeBg = 'rgba(16, 185, 129, 0.15)';
  } else if (status === 'Connecting') {
    statusColor = THEME.colors.review;
    statusText = 'Connecting...';
    badgeBg = 'rgba(245, 158, 11, 0.15)';
  }

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.pulseCircle, { borderColor: statusColor, backgroundColor: badgeBg }]}>
          <Ionicons name="hardware-chip-outline" size={24} color={statusColor} />
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>ROBOT STATUS</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            <Text style={styles.connMethod}>(Wi-Fi ESP32)</Text>
          </View>
          <Text style={styles.note}>
            {status === 'Connected'
              ? 'Robot controller online. Spray commands enabled.'
              : 'Connect to robot controller to enable field spraying.'}
          </Text>
        </View>
      </View>

      {onPressManage && (
        <TouchableOpacity style={styles.btn} onPress={onPressManage} activeOpacity={0.8}>
          <Text style={styles.btnText}>Manage</Text>
          <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pulseCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    letterSpacing: 0.8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  connMethod: {
    fontSize: 12,
    color: '#64748B',
  },
  note: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    marginLeft: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
});
