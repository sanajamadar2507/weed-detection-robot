import { DetectionService } from './DetectionService';
import { DetectionOptions, DetectionResult, BoundingBox } from '../../models/detection';
import { APP_CONFIG } from '../../constants/config';
import { SprayDecisionEngine } from '../decision/SprayDecisionEngine';
import { SAMPLE_IMAGES } from '../../constants/samples';

export class MockDetectionService implements DetectionService {
  private static instance: MockDetectionService;

  public static getInstance(): MockDetectionService {
    if (!MockDetectionService.instance) {
      MockDetectionService.instance = new MockDetectionService();
    }
    return MockDetectionService.instance;
  }

  public getModelName(): string {
    return 'WeedGuard Neural Vision Model';
  }

  public isSimulated(): boolean {
    return true;
  }

  /**
   * Simulates computer vision inference on an agricultural crop image.
   * Produces realistic weed bounding boxes, confidence values, and calls the Decision Engine.
   */
  public async analyzeImage(
    imageUri: string,
    options?: DetectionOptions
  ): Promise<DetectionResult> {
    const startTime = Date.now();

    // Realistic simulated processing latency
    await new Promise((resolve) =>
      setTimeout(resolve, APP_CONFIG.SIMULATED_PROCESSING_DELAY)
    );

    const threshold =
      options?.confidenceThreshold ?? APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD;

    // Check if the image corresponds to one of our preset sample images
    const matchingSample = SAMPLE_IMAGES.find((s) => s.imageUri === imageUri);

    let detected = true;
    let className: 'weed' | 'healthy_crop' = 'weed';
    let confidence = 0.91;
    let objectCount = 1;
    let boundingBox: BoundingBox | undefined = {
      x: 0.32,
      y: 0.28,
      width: 0.25,
      height: 0.3,
      label: 'Weed',
      confidence: 0.91,
    };

    if (options?.simulateScenario === 'no_weed') {
      detected = false;
      className = 'healthy_crop';
      confidence = 0.95;
      objectCount = 0;
      boundingBox = undefined as any;
    } else if (options?.simulateScenario === 'weed_low') {
      detected = true;
      className = 'weed';
      confidence = 0.55;
      objectCount = 1;
      boundingBox = {
        x: 0.42,
        y: 0.35,
        width: 0.22,
        height: 0.24,
        label: 'Uncertain Weed',
        confidence: 0.55,
      };
    } else if (options?.simulateScenario === 'weed_high') {
      detected = true;
      className = 'weed';
      confidence = 0.91;
      objectCount = 1;
      boundingBox = {
        x: 0.32,
        y: 0.28,
        width: 0.25,
        height: 0.3,
        label: 'Weed',
        confidence: 0.91,
      };
    } else if (matchingSample) {
      if (matchingSample.expectedClass === 'healthy_crop') {
        detected = false;
        className = 'healthy_crop';
        confidence = matchingSample.expectedConfidence;
        objectCount = 0;
        boundingBox = undefined as any;
      } else {
        detected = true;
        className = 'weed';
        confidence = matchingSample.expectedConfidence;
        objectCount = 1;
        boundingBox = matchingSample.expectedBoundingBox || {
          x: 0.32,
          y: 0.28,
          width: 0.25,
          height: 0.3,
          label: 'Weed',
          confidence,
        };
      }
    } else {
      // Default realistic detection for custom user uploaded/taken photos
      detected = true;
      className = 'weed';
      confidence = 0.91;
      objectCount = 1;
      boundingBox = {
        x: 0.30,
        y: 0.30,
        width: 0.28,
        height: 0.32,
        label: 'Weed',
        confidence: 0.91,
      };
    }

    const evaluation = SprayDecisionEngine.evaluate(
      detected,
      className,
      confidence,
      threshold
    );

    const processingTimeMs = Date.now() - startTime;

    return {
      id: `det_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      imageUri,
      detected,
      className: detected ? className : null,
      confidence,
      objectCount,
      boundingBox,
      cropDetected: true,
      decision: evaluation.decision,
      decisionReason: evaluation.reason,
      timestamp: new Date().toISOString(),
      model: this.getModelName(),
      isMock: true,
      processingTimeMs,
    };
  }
}
