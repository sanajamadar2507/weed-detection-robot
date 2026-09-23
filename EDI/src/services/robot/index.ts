import { RobotService } from './RobotService';
import { MockRobotService } from './MockRobotService';
import { ESP32RobotService } from './ESP32RobotService';

let activeRobotService: RobotService = MockRobotService.getInstance();

export function getRobotService(): RobotService {
  return activeRobotService;
}

export function setRobotServiceMode(mode: 'mock' | 'esp32', esp32Ip?: string, port?: number): void {
  if (mode === 'mock') {
    activeRobotService = MockRobotService.getInstance();
  } else {
    activeRobotService = new ESP32RobotService(esp32Ip, port);
  }
}

export { RobotService, MockRobotService, ESP32RobotService };
