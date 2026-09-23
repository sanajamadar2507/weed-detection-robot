import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

export const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  const pipeline = [
    { title: 'Camera Capture', sub: 'ESP32-CAM optical sensor', icon: 'camera' },
    { title: 'Image Transfer', sub: 'Wi-Fi HTTP multipart payload', icon: 'wifi' },
    { title: 'AI Weed Detection', sub: 'Deep neural vision model', icon: 'scan' },
    { title: 'Confidence Scoring', sub: 'Safety threshold evaluation', icon: 'analytics' },
    { title: 'Spray Decision', sub: 'Spray, No-Spray, or Review state', icon: 'git-network' },
    { title: 'Robot Controller', sub: 'ESP32 actuator logic', icon: 'hardware-chip' },
    { title: 'Targeted Spraying', sub: '12V Solenoid micro-valve', icon: 'water' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Project</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Project Branding Header */}
        <View style={styles.brandCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={32} color={THEME.colors.primary} />
          </View>
          <Text style={styles.title}>{APP_CONFIG.projectTitle}</Text>
          <Text style={styles.subtitle}>{APP_CONFIG.subtitle}</Text>
          <View style={styles.academicBadge}>
            <Ionicons name="hardware-chip-outline" size={14} color="#818CF8" />
            <Text style={styles.academicBadgeText}>Autonomous AgriTech System</Text>
          </View>
        </View>

        {/* The Agricultural Problem */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
            <Text style={styles.cardHeaderTitle}>THE PROBLEM</Text>
          </View>
          <Text style={styles.cardBodyText}>
            Manual weed identification and conventional blanket spraying require enormous physical labor,
            drive up farm operational costs, and lead to massive chemical runoff. Excess herbicide degrades soil
            health and inadvertently damages sensitive crops.
          </Text>
        </View>

        {/* The Proposed Solution */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="bulb-outline" size={20} color={THEME.colors.primary} />
            <Text style={styles.cardHeaderTitle}>THE SOLUTION</Text>
          </View>
          <Text style={styles.cardBodyText}>
            The proposed system deploys computer vision and deep learning to inspect crop rows in real-time,
            localizing invasive weeds with bounding boxes and computing confidence scores to trigger targeted
            micro-doses of herbicide directly onto weed foliage while sparing adjacent crops.
          </Text>
        </View>

        {/* End-to-End System Flow */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="git-commit-outline" size={20} color="#3B82F6" />
            <Text style={styles.cardHeaderTitle}>END-TO-END SYSTEM FLOW</Text>
          </View>

          <View style={styles.flowContainer}>
            {pipeline.map((step, idx) => (
              <View key={step.title} style={styles.flowRow}>
                <View style={styles.flowNode}>
                  <View style={styles.flowIconBox}>
                    <Ionicons name={step.icon as any} size={16} color={THEME.colors.primary} />
                  </View>
                  {idx < pipeline.length - 1 && <View style={styles.flowConnector} />}
                </View>

                <View style={styles.flowContent}>
                  <Text style={styles.flowTitle}>{step.title}</Text>
                  <Text style={styles.flowSub}>{step.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Core Technologies */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="code-slash-outline" size={20} color="#A855F7" />
            <Text style={styles.cardHeaderTitle}>CORE TECHNOLOGIES</Text>
          </View>

          <View style={styles.techGrid}>
            {[
              { name: 'Neural Vision Networks', role: 'Real-time Object Detection' },
              { name: 'PyTorch / OpenCV', role: 'Computer Vision & Tensors' },
              { name: 'Python / Microservices', role: 'Inference API Microservice' },
              { name: 'ESP32-CAM', role: 'Vision Sensor Node' },
              { name: 'ESP32 Controller', role: 'Actuator & Relay Controller' },
              { name: 'React Native & Expo', role: 'Mobile Control Dashboard' },
              { name: 'Wi-Fi 802.11', role: 'Low-latency Field Protocol' },
            ].map((t) => (
              <View key={t.name} style={styles.techItem}>
                <Text style={styles.techName}>{t.name}</Text>
                <Text style={styles.techRole}>{t.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hardware Status Banner */}
        <View style={styles.hardwareDisclaimer}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="hardware-chip" size={18} color={THEME.colors.primary} />
            <Text style={[styles.disclaimerBadge, { color: THEME.colors.primary }]}>
              ROBOTICS HARDWARE INTEGRATION
            </Text>
          </View>
          <Text style={styles.disclaimerBody}>
            The WeedGuard AI platform integrates computer vision inference, leaf boundary visualization,
            and confidence-driven decision algorithms with wireless ESP32 microcontroller and solenoid valve
            actuators for targeted chemical delivery.
          </Text>
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
  brandCard: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textMutedDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  academicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  academicBadgeText: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textLight,
    letterSpacing: 0.8,
  },
  cardBodyText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  flowContainer: {
    marginTop: 6,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flowNode: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  flowIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowConnector: {
    width: 2,
    height: 24,
    backgroundColor: THEME.colors.cardBorderDark,
    marginVertical: 2,
  },
  flowContent: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 16,
  },
  flowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  flowSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  techGrid: {
    gap: 8,
  },
  techItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
  },
  techName: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  techRole: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  hardwareDisclaimer: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerBadge: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disclaimerBody: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
});
