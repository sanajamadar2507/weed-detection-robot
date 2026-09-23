import { RobotService } from './RobotService';
import { CommandLog, RobotConnectionStatus, RobotState } from '../../models/robot';
import { APP_CONFIG } from '../../constants/config';

/**
 * Future ESP32 Robot Hardware Controller.
 * 
 * Hardware Architecture:
 * Mobile App -> Wi-Fi (HTTP / WebSocket) -> ESP32 Microcontroller 
 * -> GPIO 4 / Relay -> 12V Solenoid Valve & Micro-Diaphragm Pump
 * 
 * API Protocol (Example):
 * GET http://192.168.4.1/spray?duration=500 -> activates spray relay for 500ms
 * GET http://192.168.4.1/stop               -> emergency halt
 * GET http://192.168.4.1/status             -> returns battery, pressure, telemetry
 */
export class ESP32RobotService implements RobotService {
  private ipAddress: string;
  private port: number;
  private status: RobotConnectionStatus = 'Disconnected';
  private logs: CommandLog[] = [];

  constructor(
    ip: string = APP_CONFIG.DEFAULT_ESP32_IP,
    port: number = APP_CONFIG.DEFAULT_ESP32_PORT
  ) {
    this.ipAddress = ip;
    this.port = port;
  }

  public getStatus(): RobotConnectionStatus {
    return this.status;
  }

  public getState(): RobotState {
    return {
      status: this.status,
      connectionType: 'Wi-Fi',
      targetIp: this.ipAddress,
      port: this.port,
      sprayStatus: 'IDLE',
      logs: this.logs,
      isDemoMode: false,
    };
  }

  public async connect(): Promise<{ success: boolean; message: string }> {
    try {
      this.status = 'Connecting';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`http://${this.ipAddress}:${this.port}/status`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.status = 'Connected';
        return { success: true, message: `Connected to ESP32 at ${this.ipAddress}` };
      }
      this.status = 'Disconnected';
      return { success: false, message: `ESP32 returned status ${res.status}` };
    } catch (e: any) {
      this.status = 'Disconnected';
      return {
        success: false,
        message: `Could not reach ESP32 at http://${this.ipAddress}:${this.port}. Check robot Wi-Fi connection.`,
      };
    }
  }

  public async disconnect(): Promise<void> {
    this.status = 'Disconnected';
  }

  public async sendSprayCommand(durationMs: number = 500): Promise<CommandLog> {
    const log: CommandLog = {
      id: `cmd-esp-${Date.now()}`,
      command: 'SPRAY',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT',
      details: `Dispatched spray pulse (${durationMs}ms) to ESP32`,
      isDemo: false,
    };

    try {
      await fetch(`http://${this.ipAddress}:${this.port}/spray?duration=${durationMs}`);
      log.status = 'ACKNOWLEDGED';
    } catch (err: any) {
      log.status = 'FAILED';
      log.details = `ESP32 communication error: ${err.message}`;
    }

    this.logs.unshift(log);
    return log;
  }

  public async sendStopCommand(): Promise<CommandLog> {
    const log: CommandLog = {
      id: `cmd-esp-stop-${Date.now()}`,
      command: 'STOP',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT',
      details: 'Dispatched emergency STOP to ESP32',
      isDemo: false,
    };

    try {
      await fetch(`http://${this.ipAddress}:${this.port}/stop`);
      log.status = 'ACKNOWLEDGED';
    } catch (err: any) {
      log.status = 'FAILED';
      log.details = `ESP32 STOP error: ${err.message}`;
    }

    this.logs.unshift(log);
    return log;
  }

  public async testConnection(): Promise<{
    success: boolean;
    latencyMs: number;
    message: string;
  }> {
    const t0 = Date.now();
    try {
      const res = await fetch(`http://${this.ipAddress}:${this.port}/ping`, {
        method: 'GET',
      });
      const latency = Date.now() - t0;
      return {
        success: res.ok,
        latencyMs: latency,
        message: res.ok ? `Ping successful (${latency}ms)` : 'Ping rejected',
      };
    } catch (e: any) {
      return {
        success: false,
        latencyMs: 0,
        message: `Connection failed: ${e.message}`,
      };
    }
  }
}
