import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BoundingBox } from '../models/detection';
import { THEME } from '../constants/theme';

interface Props {
  box?: BoundingBox;
  containerWidth: number;
  containerHeight: number;
  color?: string;
}

export const BoundingBoxOverlay: React.FC<Props> = ({
  box,
  containerWidth,
  containerHeight,
  color = THEME.colors.spray,
}) => {
  if (!box || containerWidth <= 0 || containerHeight <= 0) return null;

  const left = box.x * containerWidth;
  const top = box.y * containerHeight;
  const width = box.width * containerWidth;
  const height = box.height * containerHeight;

  return (
    <View
      style={[
        styles.box,
        {
          left,
          top,
          width,
          height,
          borderColor: color,
        },
      ]}
      pointerEvents="none"
    >
      {/* Corner crosshairs for AI precision aesthetic */}
      <View style={[styles.corner, styles.cornerTL, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerTR, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerBL, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerBR, { borderColor: color }]} />

      {/* Tag Label */}
      <View style={[styles.tag, { backgroundColor: color }]}>
        <Text style={styles.tagText}>
          {box.label || 'Weed'} {box.confidence ? `${(box.confidence * 100).toFixed(0)}%` : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    zIndex: 10,
  },
  tag: {
    position: 'absolute',
    top: -24,
    left: -2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderWidth: 2,
  },
  cornerTL: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0 },
});
