import { DetectionResult } from './detection';

export interface HistoryItem extends DetectionResult {
  notes?: string;
}

export interface DashboardStats {
  todayScans: number;
  weedsDetected: number;
  noWeedDetected: number;
  sprayDecisions: number;
  reviewRequiredCount: number;
  detectionAccuracy: number; // e.g. 94.2%
  isDemoData: boolean;
}
