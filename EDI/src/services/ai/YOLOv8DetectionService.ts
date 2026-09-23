import { DetectionService } from './DetectionService';
import { DetectionOptions, DetectionResult } from '../../models/detection';
import { APP_CONFIG } from '../../constants/config';
import { SprayDecisionEngine } from '../decision/SprayDecisionEngine';

/**
 * Neural Vision Model Detection Service Client.
 * Communicates with backend inference endpoint.
 */
export class YOLOv8DetectionService implements DetectionService {
  private apiBaseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.API_BASE_URL) {
    this.apiBaseUrl = baseUrl;
  }

  public getModelName(): string {
    return 'WeedGuard Neural Vision Model';
  }

  public isSimulated(): boolean {
    return false;
  }

  public async analyzeImage(
    imageUri: string,
    options?: DetectionOptions
  ): Promise<DetectionResult> {
    const threshold =
      options?.confidenceThreshold ?? APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant_capture.jpg',
      } as any);
      formData.append('confidence_threshold', threshold.toString());

      const response = await fetch(`${this.apiBaseUrl}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Inference Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      const evaluation = SprayDecisionEngine.evaluate(
        data.detected,
        data.class_name,
        data.confidence,
        threshold
      );

      return {
        id: `det_ai_${Date.now()}`,
        imageUri,
        detected: data.detected,
        className: data.detected ? data.class_name : null,
        confidence: data.confidence,
        objectCount: data.boxes?.length ?? 0,
        boundingBox: data.boxes?.[0],
        cropDetected: true,
        decision: evaluation.decision,
        decisionReason: evaluation.reason,
        timestamp: new Date().toISOString(),
        model: this.getModelName(),
        isMock: false,
        processingTimeMs: data.processing_time_ms || 120,
      };
    } catch (error: any) {
      console.warn('Inference request failed, checking backend availability:', error);
      throw new Error(
        `Unable to reach vision inference server at ${this.apiBaseUrl}. Please ensure your model server is online.`
      );
    }
  }
}
