import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { StorageService } from '../storage/storageService';
import { HistoryItem } from '../models/history';
import { Ionicons } from '@expo/vector-icons';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'SPRAY' | 'REVIEW' | 'NO_SPRAY'>('ALL');

  const loadHistory = useCallback(async () => {
    const data = await StorageService.getHistory();
    setHistory(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Delete this detection record from local history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await StorageService.deleteDetection(id);
          loadHistory();
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to erase all saved detection records? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearHistory();
            loadHistory();
          },
        },
      ]
    );
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'SPRAY') return item.decision === 'SPRAY_REQUIRED';
    if (filter === 'REVIEW') return item.decision === 'REVIEW_REQUIRED';
    if (filter === 'NO_SPRAY') return item.decision === 'NO_SPRAY';
    return true;
  });

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const dateObj = new Date(item.timestamp);
    const dateStr = dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardMain}
          onPress={() => navigation.navigate('Details', { item })}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} resizeMode="cover" />

          <View style={styles.cardDetails}>
            <View style={styles.timeRow}>
              <Text style={styles.dateText}>
                {dateStr} • {timeStr}
              </Text>
            </View>

            <View style={styles.badgeRow}>
              <StatusBadge decision={item.decision} size="sm" />
            </View>

            <Text style={styles.detectionTitle}>
              {item.detected ? `Weed Target (${(item.confidence * 100).toFixed(0)}%)` : 'Healthy Crop (Clean)'}
            </Text>

            <Text style={styles.modelText} numberOfLines={1}>
              {item.model}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('Details', { item })}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={16} color={THEME.colors.primary} />
            <Text style={styles.viewBtnText}>VIEW</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Detection History</Text>
            <Text style={styles.subtitle}>
              {history.length} saved scan record{history.length === 1 ? '' : 's'}
            </Text>
          </View>

          {history.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll} activeOpacity={0.8}>
              <Ionicons name="trash-bin-outline" size={14} color="#EF4444" />
              <Text style={styles.clearBtnText}>CLEAR ALL</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'SPRAY', 'REVIEW', 'NO_SPRAY'] as const).map((key) => {
            const isSelected = filter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setFilter(key)}
              >
                <Text
                  style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}
                >
                  {key === 'ALL'
                    ? 'All'
                    : key === 'SPRAY'
                    ? 'Spray'
                    : key === 'REVIEW'
                    ? 'Review'
                    : 'Clean'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="file-tray-outline" size={36} color="#64748B" />
          </View>
          <Text style={styles.emptyTitle}>No Detection Records Found</Text>
          <Text style={styles.emptySubtitle}>
            Perform plant detections on the Detect screen and tap 'Save Result' to archive records.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.backgroundDark,
    paddingTop: 54,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textMutedDark,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    gap: 4,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.cardDark,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primary,
  },
  filterPillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    overflow: 'hidden',
  },
  cardMain: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 74,
    height: 74,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#334155',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  timeRow: {
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  badgeRow: {
    marginBottom: 4,
  },
  detectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  modelText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewBtnText: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textLight,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: THEME.colors.textMutedDark,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
});
