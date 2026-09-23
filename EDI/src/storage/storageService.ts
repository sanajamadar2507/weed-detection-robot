import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';
import { HistoryItem, DashboardStats } from '../models/history';
import { APP_CONFIG } from '../constants/config';

// Fallback in-memory cache
const memoryCache = new Map<string, string>();

async function setItem(key: string, value: string): Promise<void> {
  try {
    memoryCache.set(key, value);
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn(`AsyncStorage set error for key ${key}:`, e);
  }
}

async function getItem(key: string): Promise<string | null> {
  try {
    const val = await AsyncStorage.getItem(key);
    if (val !== null) return val;
    return memoryCache.get(key) ?? null;
  } catch (e) {
    console.warn(`AsyncStorage get error for key ${key}:`, e);
    return memoryCache.get(key) ?? null;
  }
}

export class StorageService {
  /**
   * Onboarding persistence
   */
  public static async hasCompletedOnboarding(): Promise<boolean> {
    const val = await getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
    return val === 'true';
  }

  public static async setCompletedOnboarding(completed: boolean): Promise<void> {
    await setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, completed ? 'true' : 'false');
  }

  /**
   * Confidence Threshold Setting
   */
  public static async getConfidenceThreshold(): Promise<number> {
    const val = await getItem(STORAGE_KEYS.SETTINGS_THRESHOLD);
    if (!val) return APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD : parsed;
  }

  public static async setConfidenceThreshold(threshold: number): Promise<void> {
    await setItem(STORAGE_KEYS.SETTINGS_THRESHOLD, threshold.toString());
  }

  /**
   * Theme mode setting
   */
  public static async getThemeMode(): Promise<'dark' | 'light'> {
    const val = await getItem(STORAGE_KEYS.SETTINGS_THEME_MODE);
    return val === 'light' ? 'light' : 'dark';
  }

  public static async setThemeMode(mode: 'dark' | 'light'): Promise<void> {
    await setItem(STORAGE_KEYS.SETTINGS_THEME_MODE, mode);
  }

  /**
   * Detection History CRUD
   */
  public static async getHistory(): Promise<HistoryItem[]> {
    const raw = await getItem(STORAGE_KEYS.DETECTION_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static async saveDetection(item: HistoryItem): Promise<void> {
    const history = await this.getHistory();
    // Prepend new item
    const updated = [item, ...history.filter((h) => h.id !== item.id)];
    await setItem(STORAGE_KEYS.DETECTION_HISTORY, JSON.stringify(updated));
  }

  public static async deleteDetection(id: string): Promise<void> {
    const history = await this.getHistory();
    const updated = history.filter((h) => h.id !== id);
    await setItem(STORAGE_KEYS.DETECTION_HISTORY, JSON.stringify(updated));
  }

  public static async clearHistory(): Promise<void> {
    await setItem(STORAGE_KEYS.DETECTION_HISTORY, JSON.stringify([]));
  }

  /**
   * Dashboard Statistics
   */
  public static async getDashboardStats(): Promise<DashboardStats> {
    const raw = await getItem(STORAGE_KEYS.DASHBOARD_STATS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback to default demo stats
      }
    }

    // Default realistic demo statistics clearly flagged
    return {
      todayScans: 24,
      weedsDetected: 15,
      noWeedDetected: 9,
      sprayDecisions: 15,
      reviewRequiredCount: 2,
      detectionAccuracy: 94.2,
      isDemoData: true,
    };
  }

  public static async recordScan(item: HistoryItem): Promise<void> {
    const stats = await this.getDashboardStats();
    stats.todayScans += 1;
    if (item.detected && item.className === 'weed') {
      stats.weedsDetected += 1;
    } else {
      stats.noWeedDetected += 1;
    }

    if (item.decision === 'SPRAY_REQUIRED') {
      stats.sprayDecisions += 1;
    } else if (item.decision === 'REVIEW_REQUIRED') {
      stats.reviewRequiredCount += 1;
    }

    await setItem(STORAGE_KEYS.DASHBOARD_STATS, JSON.stringify(stats));
  }
}
