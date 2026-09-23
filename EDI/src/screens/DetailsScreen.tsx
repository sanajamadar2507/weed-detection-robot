import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { StorageService } from '../storage/storageService';
import { Ionicons } from '@expo/vector-icons';

type DetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export const DetailsScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<DetailsRouteProp>();
  const { item } = route.params;

  const handleDelete = () => {
    Alert.alert('Delete Record', 'Are you sure you want to remove this scan from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await StorageService.deleteDetection(item.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detection Details</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Plant Image */}
        <View style={styles.imageCard}>
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
          <View style={styles.idBadge}>
            <Text style={styles.idText}>ID: {item.id}</Text>
          </View>
        </View>

        {/* Primary Decision Banner */}
        <View style={styles.statusCard}>
          <Text style={styles.cardHeader}>DECISION STATUS</Text>
          <View style={{ marginVertical: 8 }}>
            <StatusBadge decision={item.decision} size="lg" />
          </View>
          <Text style={styles.reasonText}>{item.decisionReason}</Text>
        </View>

        {/* Technical Inspection Table */}
        <View style={styles.tableCard}>
          <Text style={styles.cardHeader}>METADATA & TELEMETRY</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Detection Class</Text>
            <Text style={styles.rowValue}>{item.detected ? 'Weed' : 'Healthy Crop'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Confidence Score</Text>
            <Text style={[styles.rowValue, { color: THEME.colors.primary }]}>
              {(item.confidence * 100).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Detected Objects</Text>
            <Text style={styles.rowValue}>{item.objectCount} target(s)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Detection Time</Text>
            <Text style={styles.rowValue}>
              {new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Inference Latency</Text>
            <Text style={styles.rowValue}>{item.processingTimeMs} ms</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Model Provenance</Text>
            <View style={styles.modelTag}>
              <Text style={styles.modelTagText}>{item.model}</Text>
            </View>
          </View>
        </View>

        {/* Bounding Box Coordinates Inspection */}
        {item.boundingBox && (
          <View style={styles.bboxCard}>
            <Text style={styles.cardHeader}>NORMALIZED BOUNDING BOX</Text>
            <View style={styles.bboxGrid}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>X (Left)</Text>
                <Text style={styles.coordVal}>{item.boundingBox.x.toFixed(3)}</Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Y (Top)</Text>
                <Text style={styles.coordVal}>{item.boundingBox.y.toFixed(3)}</Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Width</Text>
                <Text style={styles.coordVal}>{item.boundingBox.width.toFixed(3)}</Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Height</Text>
                <Text style={styles.coordVal}>{item.boundingBox.height.toFixed(3)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Decision Rationale */}
        <View style={styles.integrityBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={THEME.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.integrityTitle}>Automated Decision Rationale</Text>
            <Text style={styles.integrityDesc}>
              This decision was evaluated by comparing the detection confidence against safety thresholds to safeguard crops while ensuring thorough weed elimination.
            </Text>
          </View>
        </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.colors.cardDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCard: {
    width: '100%',
    height: 240,
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  idBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  idText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  statusCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  tableCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.cardBorderDark,
    marginVertical: 8,
  },
  modelTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  modelTagText: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '700',
  },
  bboxCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    marginBottom: 16,
  },
  bboxGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  coordBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  coordLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  coordVal: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  integrityBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    gap: 12,
  },
  integrityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C7D2FE',
    marginBottom: 2,
  },
  integrityDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
