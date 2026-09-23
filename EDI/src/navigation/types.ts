import { DetectionResult } from '../models/detection';
import { HistoryItem } from '../models/history';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Result: { detection: DetectionResult };
  Details: { item: HistoryItem };
  About: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Detect: { initialUri?: string } | undefined;
  Robot: undefined;
  History: undefined;
  Settings: undefined;
};
