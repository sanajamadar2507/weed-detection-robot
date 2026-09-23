export type SprayDecision = 'SPRAY_REQUIRED' | 'NO_SPRAY' | 'REVIEW_REQUIRED';

export type DetectionClass = 'weed' | 'crop' | 'healthy_crop' | 'unknown';

export interface BoundingBox {
  x: number;      // normalized 0.0 - 1.0 (left)
  y: number;      // normalized 0.0 - 1.0 (top)
  width: number;  // normalized 0.0 - 1.0 (width)
  height: number; // normalized 0.0 - 1.0 (height)
  label?: string;
  confidence?: number;
}

export interface DetectionResult {
  id: string;
  imageUri: string;
  detected: boolean;
  className: DetectionClass | null;
  confidence: number;            // 0.0 to 1.0
  objectCount: number;
  boundingBox?: BoundingBox;
  additionalBoxes?: BoundingBox[];
  cropDetected: boolean;
  decision: SprayDecision;
  decisionReason: string;
  timestamp: string;             // ISO string
  model: string;                 // e.g. "Demo YOLOv8 Simulation"
  isMock: boolean;               // explicit prototype flag
  processingTimeMs: number;
}

export interface DetectionOptions {
  confidenceThreshold?: number; // default e.g. 0.70
  simulateScenario?: 'weed_high' | 'no_weed' | 'weed_low' | 'random';
}
