import { RobotService } from './RobotService';
import { CommandLog, RobotConnectionStatus, RobotState } from '../../models/robot';
import { APP_CONFIG } from '../../constants/config';

export class MockRobotService implements RobotService {
  private static instance: MockRobotService;

  private state: RobotState = {
    status: 'Disconnected',
    connectionType: 'Wi-Fi',
    targetIp: APP_CONFIG.DEFAULT_ESP32_IP,
    port: APP_CONFIG.DEFAULT_ESP32_PORT,
    sprayStatus: 'READY',
    isDemoMode: false,
    logs: [
      {
        id: 'log-init-1',
        command: 'STATUS',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'ACKNOWLEDGED',
        details: 'System initialized. Controller interface on standby.',
        isDemo: false,
      },
    ],
  };

  private listeners: Array<(state: RobotState) => void> = [];

  public static getInstance(): MockRobotService {
    if (!MockRobotService.instance) {
      MockRobotService.instance = new MockRobotService();
    }
    return MockRobotService.instance;
  }

  public subscribe(listener: (state: RobotState) => void): () => void {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const clone = { ...this.state };
    this.listeners.forEach((l) => l(clone));
  }

  public getStatus(): RobotConnectionStatus {
    return this.state.status;
  }

  public getState(): RobotState {
    return { ...this.state };
  }

  public async connect(): Promise<{ success: boolean; message: string }> {
    this.state.status = 'Connecting';
    this.notify();

    await new Promise((resolve) => setTimeout(resolve, 800));

    this.state.status = 'Connected';
    const log: CommandLog = {
      id: `log-${Date.now()}`,
      command: 'PING',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACKNOWLEDGED',
      details: `Wi-Fi connection established with Robot Controller at ${this.state.targetIp}:${this.state.port}`,
      isDemo: false,
    };
    this.state.logs = [log, ...this.state.logs.slice(0, 19)];
    this.state.lastCommand = log;
    this.notify();

    return {
      success: true,
      message: `Robot connected successfully via Wi-Fi (${this.state.targetIp})`,
    };
  }

  public async disconnect(): Promise<void> {
    this.state.status = 'Disconnected';
    const log: CommandLog = {
      id: `log-${Date.now()}`,
      command: 'STATUS',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACKNOWLEDGED',
      details: 'Robot interface disconnected.',
      isDemo: false,
    };
    this.state.logs = [log, ...this.state.logs.slice(0, 19)];
    this.state.lastCommand = log;
    this.notify();
  }

  public async sendSprayCommand(durationMs: number = 500): Promise<CommandLog> {
    this.state.sprayStatus = 'SPRAYING';
    this.notify();

    await new Promise((resolve) => setTimeout(resolve, 600));

    this.state.sprayStatus = 'READY';
    const log: CommandLog = {
      id: `cmd-${Date.now()}`,
      command: 'SPRAY',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACKNOWLEDGED',
      details: `Targeted SPRAY pulse (${durationMs}ms) dispatched to solenoid nozzle.`,
      isDemo: false,
    };

    this.state.logs = [log, ...this.state.logs.slice(0, 19)];
    this.state.lastCommand = log;
    this.notify();
    return log;
  }

  public async sendStopCommand(): Promise<CommandLog> {
    this.state.sprayStatus = 'IDLE';
    const log: CommandLog = {
      id: `cmd-${Date.now()}`,
      command: 'STOP',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACKNOWLEDGED',
      details: 'Emergency STOP emitted. Actuators halted.',
      isDemo: false,
    };

    this.state.logs = [log, ...this.state.logs.slice(0, 19)];
    this.state.lastCommand = log;
    this.notify();
    return log;
  }

  public async testConnection(): Promise<{
    success: boolean;
    latencyMs: number;
    message: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      latencyMs: 18,
      message: `Ping acknowledged from Robot Controller (${this.state.targetIp}) in 18ms.`,
    };
  }
}
