export type RobotConnectionStatus = 'Disconnected' | 'Connecting' | 'Connected';

export type RobotCommandType = 'SPRAY' | 'STOP' | 'STATUS' | 'PING';

export interface CommandLog {
  id: string;
  command: RobotCommandType;
  timestamp: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED' | 'ACKNOWLEDGED';
  details: string;
  isDemo: boolean;
}

export interface RobotState {
  status: RobotConnectionStatus;
  connectionType: 'Wi-Fi' | 'Bluetooth' | 'USB';
  targetIp: string;
  port: number;
  batteryLevel?: number;
  sprayStatus: 'READY' | 'SPRAYING' | 'IDLE' | 'ERROR';
  lastCommand?: CommandLog;
  logs: CommandLog[];
  isDemoMode: boolean;
}
