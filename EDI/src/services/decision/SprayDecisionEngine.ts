import { DetectionClass, SprayDecision } from '../../models/detection';
import { APP_CONFIG } from '../../constants/config';

export interface DecisionEvaluation {
  decision: SprayDecision;
  reason: string;
  thresholdUsed: number;
  confidence: number;
  isWeed: boolean;
}

export class SprayDecisionEngine {
  /**
   * Evaluates AI detection outputs against the confidence threshold to determine spray action.
   * 
   * Decision Logic:
   * - IF weed detected AND confidence >= threshold => SPRAY_REQUIRED
   * - IF weed detected AND confidence < threshold  => REVIEW_REQUIRED
   * - IF no weed detected                          => NO_SPRAY
   */
  public static evaluate(
    isDetected: boolean,
    className: DetectionClass | null,
    confidence: number,
    threshold: number = APP_CONFIG.DEFAULT_CONFIDENCE_THRESHOLD
  ): DecisionEvaluation {
    const isWeed = isDetected && className === 'weed';

    if (!isWeed) {
      return {
        decision: 'NO_SPRAY',
        reason: 'Healthy crop canopy identified. No invasive weed targets detected.',
        thresholdUsed: threshold,
        confidence,
        isWeed: false,
      };
    }

    if (confidence >= threshold) {
      return {
        decision: 'SPRAY_REQUIRED',
        reason: `Weed confirmed with ${(confidence * 100).toFixed(0)}% confidence (exceeds ${(threshold * 100).toFixed(0)}% threshold). Targeted micro-spray recommended.`,
        thresholdUsed: threshold,
        confidence,
        isWeed: true,
      };
    }

    return {
      decision: 'REVIEW_REQUIRED',
      reason: `Potential weed detected, but confidence (${(confidence * 100).toFixed(0)}%) is below safety threshold (${(threshold * 100).toFixed(0)}%). Manual visual inspection required to avoid crop damage.`,
      thresholdUsed: threshold,
      confidence,
      isWeed: true,
    };
  }
}
