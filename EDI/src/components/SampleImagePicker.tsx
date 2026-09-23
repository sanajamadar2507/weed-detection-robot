import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SAMPLE_IMAGES, SamplePlantImage } from '../constants/samples';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  selectedUri?: string | null;
  onSelectSample: (sample: SamplePlantImage) => void;
}

export const SampleImagePicker: React.FC<Props> = ({ selectedUri, onSelectSample }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Ionicons name="images" size={16} color={THEME.colors.primary} />
          <Text style={styles.title}>SELECT FIELD CROP SAMPLE</Text>
        </View>
        <Text style={styles.badge}>Field Samples</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {SAMPLE_IMAGES.map((sample) => {
          const isSelected = selectedUri === sample.imageUri;
          return (
            <TouchableOpacity
              key={sample.id}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => onSelectSample(sample)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: sample.imageUri }} style={styles.thumb} />
              <View style={styles.info}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {sample.category === 'weed_clear'
                      ? 'WEED PRESENT'
                      : sample.category === 'healthy_crop'
                      ? 'HEALTHY CROP'
                      : 'LOW CONFIDENCE'}
                  </Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {sample.name}
                </Text>
                <Text style={styles.note} numberOfLines={2}>
                  {sample.notes}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={20} color={THEME.colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    letterSpacing: 0.5,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scrollList: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    width: 200,
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.cardBorderDark,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  thumb: {
    width: '100%',
    height: 100,
    backgroundColor: '#334155',
  },
  info: {
    padding: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  categoryText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '800',
  },
  name: {
    color: THEME.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  note: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 14,
  },
  checkIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#0F172A',
    borderRadius: 12,
  },
});
