import { CommandLog, RobotCommandType, RobotConnectionStatus, RobotState } from '../../models/robot';

/**
 * Unified Robot Control Service Interface.
 * Encapsulates robot connection, spraying triggers, stop commands, and status monitoring.
 */
export interface RobotService {
  /**
   * Connect to the robot controller.
   */
  connect(): Promise<{ success: boolean; message: string }>;

  /**
   * Disconnect from the robot controller.
   */
  disconnect(): Promise<void>;

  /**
   * Current status of robot hardware connection.
   */
  getStatus(): RobotConnectionStatus;

  /**
   * Full snapshot of robot state including logs and active spray status.
   */
  getState(): RobotState;

  /**
   * Sends a targeted micro-spray command to the robot solenoid/pump.
   */
  sendSprayCommand(durationMs?: number): Promise<CommandLog>;

  /**
   * Emergency stops or halts any ongoing robotic actuator motion or spraying.
   */
  sendStopCommand(): Promise<CommandLog>;

  /**
   * Tests wireless ping / communication with the controller.
   */
  testConnection(): Promise<{ success: boolean; latencyMs: number; message: string }>;
}
