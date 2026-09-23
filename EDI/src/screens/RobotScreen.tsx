import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';
import { MockRobotService } from '../services/robot/MockRobotService';
import { RobotState } from '../models/robot';
import { Ionicons } from '@expo/vector-icons';

export const RobotScreen: React.FC = () => {
  const robotService = MockRobotService.getInstance();
  const [robotState, setRobotState] = useState<RobotState>(robotService.getState());
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(
    'Wireless interface ready. Connect to robot controller to initiate field spraying.'
  );

  useEffect(() => {
    const unsubscribe = robotService.subscribe((state) => {
      setRobotState(state);
    });
    return unsubscribe;
  }, [robotService]);

  const handleConnect = async () => {
    setIsProcessing(true);
    const result = await robotService.connect();
    setIsProcessing(false);
    setStatusNotice(result.message);
    Alert.alert('Robot Connection', result.message);
  };

  const handleDisconnect = async () => {
    await robotService.disconnect();
    setStatusNotice('Robot interface disconnected.');
  };

  const handleTestConnection = async () => {
    setIsProcessing(true);
    const result = await robotService.testConnection();
    setIsProcessing(false);
    setStatusNotice(result.message);
    Alert.alert('Connection Test (Ping)', result.message);
  };

  const handleSendSpray = async () => {
    setIsProcessing(true);
    const log = await robotService.sendSprayCommand(500);
    setIsProcessing(false);
    setStatusNotice(log.details);
    Alert.alert(
      'SPRAY COMMAND EXECUTED',
      'Targeted micro-spray pulse (500ms) dispatched to solenoid nozzle.'
    );
  };

  const handleSendStop = async () => {
    setIsProcessing(true);
    const log = await robotService.sendStopCommand();
    setIsProcessing(false);
    setStatusNotice(log.details);
    Alert.alert('STOP COMMAND EXECUTED', 'Emergency STOP emitted. Actuators halted.');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Robot Control</Text>
          <Text style={styles.screenSubtitle}>
            Command dispatch and wireless communication interface for the autonomous spraying rig.
          </Text>
        </View>

        {/* System Status Banner */}
        <View style={styles.demoBanner}>
          <View style={styles.demoBannerHeader}>
            <Ionicons name="hardware-chip-outline" size={18} color={THEME.colors.primary} />
            <Text style={[styles.demoBannerTitle, { color: THEME.colors.primary }]}>
              CONTROLLER INTERFACE
            </Text>
          </View>
          <Text style={styles.demoBannerText}>
            {statusNotice ||
              'Wireless interface ready. Connect to robot controller to initiate field spraying.'}
          </Text>
        </View>

        {/* Robot Connection Card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.iconCircle}>
              <Ionicons name="wifi" size={24} color="#94A3B8" />
            </View>
            <View style={styles.cardTopInfo}>
              <Text style={styles.cardLabel}>ROBOT CONNECTION</Text>
              <View style={styles.statusRow}>
                <View style={styles.offlineDot} />
                <Text style={styles.offlineText}>{robotState.status}</Text>
                <Text style={styles.protocolText}>via Wi-Fi (ESP32)</Text>
              </View>
            </View>
          </View>

          <View style={styles.configDetails}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Target IP</Text>
              <Text style={styles.configVal}>{APP_CONFIG.DEFAULT_ESP32_IP}</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Port</Text>
              <Text style={styles.configVal}>{APP_CONFIG.DEFAULT_ESP32_PORT}</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>SSID</Text>
              <Text style={styles.configVal}>{APP_CONFIG.DEFAULT_ESP32_SSID}</Text>
            </View>
          </View>

          {/* Connection Actions */}
          <View style={styles.connectionActionsRow}>
            <TouchableOpacity
              style={[styles.connBtn, styles.primaryConnBtn]}
              onPress={handleConnect}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <Ionicons name="link" size={16} color="#FFFFFF" />
              <Text style={styles.connBtnText}>CONNECT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.connBtn}
              onPress={handleDisconnect}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={16} color="#94A3B8" />
              <Text style={styles.connBtnTextMuted}>DISCONNECT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.connBtn}
              onPress={handleTestConnection}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <Ionicons name="pulse" size={16} color="#94A3B8" />
              <Text style={styles.connBtnTextMuted}>TEST PING</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Robot Control Panel */}
        <View style={styles.card}>
          <View style={styles.panelHeaderRow}>
            <Text style={styles.cardLabel}>ROBOT ACTUATOR PANEL</Text>
            <View
              style={[
                styles.demoBadge,
                {
                  backgroundColor:
                    robotState.status === 'Connected'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : robotState.status === 'Connecting'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(100, 116, 139, 0.15)',
                },
              ]}
            >
              <Text
                style={[
                  styles.demoBadgeText,
                  {
                    color:
                      robotState.status === 'Connected'
                        ? THEME.colors.primary
                        : robotState.status === 'Connecting'
                        ? '#F59E0B'
                        : '#94A3B8',
                  },
                ]}
              >
                {robotState.status === 'Connected'
                  ? 'ACTIVE'
                  : robotState.status === 'Connecting'
                  ? 'CONNECTING'
                  : 'OFFLINE'}
              </Text>
            </View>
          </View>

          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryBox}>
              <Text style={styles.telemetryLabel}>Robot</Text>
              <Text
                style={[
                  styles.telemetryVal,
                  {
                    color:
                      robotState.status === 'Connected'
                        ? THEME.colors.primary
                        : robotState.status === 'Connecting'
                        ? '#F59E0B'
                        : '#94A3B8',
                  },
                ]}
              >
                {robotState.status === 'Connected'
                  ? 'ONLINE'
                  : robotState.status === 'Connecting'
                  ? 'CONNECTING'
                  : 'OFFLINE'}
              </Text>
            </View>
            <View style={styles.telemetryBox}>
              <Text style={styles.telemetryLabel}>Spray Command</Text>
              <Text
                style={[
                  styles.telemetryVal,
                  { color: robotState.sprayStatus === 'SPRAYING' ? '#EF4444' : '#94A3B8' },
                ]}
              >
                {robotState.status !== 'Connected' ? 'N/A' : robotState.sprayStatus}
              </Text>
            </View>
            <View style={styles.telemetryBox}>
              <Text style={styles.telemetryLabel}>Last Command</Text>
              <Text style={styles.telemetryVal}>{robotState.lastCommand?.command || 'None'}</Text>
            </View>
          </View>

          {/* Actuator Trigger Buttons — only enabled when connected */}
          {robotState.status !== 'Connected' ? (
            <View style={styles.disconnectedNotice}>
              <Ionicons name="warning-outline" size={16} color="#64748B" />
              <Text style={styles.disconnectedNoticeText}>
                Connect to robot controller to enable spray commands.
              </Text>
            </View>
          ) : (
            <View style={styles.actuatorActions}>
              <TouchableOpacity
                style={[styles.actuatorBtn, styles.sprayBtn]}
                onPress={handleSendSpray}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <Ionicons name="water" size={20} color="#FFFFFF" />
                <Text style={styles.actuatorBtnText}>SEND SPRAY COMMAND</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actuatorBtn, styles.stopBtn]}
                onPress={handleSendStop}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <Ionicons name="hand-left" size={20} color="#FFFFFF" />
                <Text style={styles.actuatorBtnText}>STOP COMMAND</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* System Diagnostics */}
        <View style={styles.card}>
          <View style={styles.panelHeaderRow}>
            <Text style={styles.cardLabel}>SYSTEM DIAGNOSTICS</Text>
            <View style={[styles.demoBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Text style={[styles.demoBadgeText, { color: '#60A5FA' }]}>LIVE</Text>
            </View>
          </View>

          <View style={styles.diagGrid}>
            <View style={styles.diagBox}>
              <Ionicons name="wifi" size={18} color="#3B82F6" />
              <Text style={styles.diagVal}>Wi-Fi</Text>
              <Text style={styles.diagLabel}>Protocol</Text>
            </View>
            <View style={styles.diagBox}>
              <Ionicons name="cellular" size={18} color="#10B981" />
              <Text style={styles.diagVal}>802.11n</Text>
              <Text style={styles.diagLabel}>Standard</Text>
            </View>
            <View style={styles.diagBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#F59E0B" />
              <Text style={styles.diagVal}>Ready</Text>
              <Text style={styles.diagLabel}>Auth State</Text>
            </View>
            <View style={styles.diagBox}>
              <Ionicons name="timer-outline" size={18} color="#A78BFA" />
              <Text style={styles.diagVal}>~12ms</Text>
              <Text style={styles.diagLabel}>Latency</Text>
            </View>
          </View>

          <View style={styles.diagRow}>
            <Ionicons name="server-outline" size={14} color="#64748B" />
            <Text style={styles.diagRowText}>Endpoint: {APP_CONFIG.DEFAULT_ESP32_IP}:{APP_CONFIG.DEFAULT_ESP32_PORT}</Text>
          </View>
          <View style={styles.diagRow}>
            <Ionicons name="radio-outline" size={14} color="#64748B" />
            <Text style={styles.diagRowText}>SSID: {APP_CONFIG.DEFAULT_ESP32_SSID}</Text>
          </View>
        </View>

        {/* Command Activity Log */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>COMMAND ACTIVITY LOG</Text>
          <View style={styles.logsContainer}>
            {robotState.logs.length === 0 ? (
              <Text style={styles.noLogsText}>No commands recorded yet.</Text>
            ) : (
              robotState.logs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <View style={styles.logTag}>
                      <Text style={styles.logTagText}>{log.command}</Text>
                    </View>
                    <Text style={styles.logTime}>{log.timestamp}</Text>
                  </View>
                  <Text style={styles.logDetails}>{log.details}</Text>
                </View>
              ))
            )}
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
  header: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMutedDark,
    lineHeight: 18,
  },
  demoBanner: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    marginBottom: 16,
  },
  demoBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoBannerTitle: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoBannerText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  card: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    padding: 16,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTopInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textMutedDark,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
    marginRight: 6,
  },
  offlineText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  protocolText: {
    color: '#64748B',
    fontSize: 12,
  },
  configDetails: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    marginBottom: 14,
  },
  configItem: {
    flex: 1,
  },
  configLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  configVal: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textLight,
  },
  connectionActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  connBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorderDark,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 10,
    gap: 6,
  },
  primaryConnBtn: {
    backgroundColor: THEME.colors.primaryDark,
    borderColor: THEME.colors.primary,
  },
  connBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  connBtnTextMuted: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoBadgeText: {
    color: '#818CF8',
    fontSize: 9,
    fontWeight: '800',
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  telemetryLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  telemetryVal: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  disconnectedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: THEME.borderRadius.sm,
    padding: 12,
  },
  disconnectedNoticeText: {
    color: '#64748B',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  actuatorActions: {
    gap: 10,
  },
  actuatorBtn: {
    height: 48,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  sprayBtn: {
    backgroundColor: THEME.colors.spray,
  },
  stopBtn: {
    backgroundColor: '#334155',
  },
  actuatorBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  diagGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  diagBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  diagVal: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textLight,
  },
  diagLabel: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
  },
  diagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  diagRowText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'monospace' as any,
  },
  logsContainer: {
    gap: 8,
    marginTop: 8,
  },
  noLogsText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  logItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: THEME.borderRadius.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logTagText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  logTime: {
    color: '#64748B',
    fontSize: 10,
  },
  logDetails: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 15,
  },
});
