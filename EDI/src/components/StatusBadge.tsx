import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SprayDecision } from '../models/detection';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  decision: SprayDecision;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ decision, size = 'md' }) => {
  let title = 'NO SPRAY REQUIRED';
  let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle';
  let bgColor = THEME.colors.healthyLight;
  let textColor = THEME.colors.healthyDark;
  let borderColor = THEME.colors.healthy;

  if (decision === 'SPRAY_REQUIRED') {
    title = 'SPRAY REQUIRED';
    iconName = 'alert-circle';
    bgColor = THEME.colors.sprayLight;
    textColor = THEME.colors.sprayDark;
    borderColor = THEME.colors.spray;
  } else if (decision === 'REVIEW_REQUIRED') {
    title = 'REVIEW REQUIRED';
    iconName = 'warning';
    bgColor = THEME.colors.reviewLight;
    textColor = THEME.colors.reviewDark;
    borderColor = THEME.colors.review;
  }

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingVertical: isLg ? 10 : isSm ? 4 : 6,
          paddingHorizontal: isLg ? 16 : isSm ? 8 : 12,
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={isLg ? 20 : isSm ? 12 : 16}
        color={textColor}
        style={{ marginRight: 6 }}
      />
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: isLg ? 16 : isSm ? 11 : 13,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
