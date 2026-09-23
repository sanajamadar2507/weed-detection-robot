import { DetectionService } from './DetectionService';
import { MockDetectionService } from './MockDetectionService';
import { YOLOv8DetectionService } from './YOLOv8DetectionService';

let activeService: DetectionService = MockDetectionService.getInstance();

export function getDetectionService(): DetectionService {
  return activeService;
}

export function setDetectionServiceMode(mode: 'mock' | 'real', realApiUrl?: string): void {
  if (mode === 'mock') {
    activeService = MockDetectionService.getInstance();
  } else {
    activeService = new YOLOv8DetectionService(realApiUrl);
  }
}

export { DetectionService, MockDetectionService, YOLOv8DetectionService };
