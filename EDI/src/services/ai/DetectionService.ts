import { DetectionOptions, DetectionResult } from '../../models/detection';

/**
 * Unified Detection Service Interface.
 * Allows seamless swapping between MockDetectionService (current prototype)
 * and YOLOv8DetectionService (future backend API) without changing UI components.
 */
export interface DetectionService {
  /**
   * Analyzes an image (local file uri, base64, or remote uri) and returns structured detection results.
   */
  analyzeImage(
    imageUri: string,
    options?: DetectionOptions
  ): Promise<DetectionResult>;

  /**
   * Name/identifier of the model engine currently active.
   */
  getModelName(): string;

  /**
   * Indicates whether results are simulated or from a real neural model.
   */
  isSimulated(): boolean;
}
