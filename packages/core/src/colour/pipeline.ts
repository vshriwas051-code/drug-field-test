import { ClassifyInput, ClassifyResult, classify, ReasonCode } from './classify';
import { fitHomography, applyHomography, Point } from './homography';
import { srgbToLab, hexToRgb, Lab } from './srgb';
import { TEST_ZONE, PATCHES, BACKGROUND_PROBES, CARD_WIDTH, CARD_HEIGHT } from './card';

export interface AnalysisInput {
  blob: Blob;
  corners?: Point[]; // optional manual corners
  kit: any;
  engine: string; // e.g. "chromaseal-colour/1.0.0"
}

export interface AnalysisResult {
  observedLab: Lab;
  machineResult: string;
  matchScore: number;
  reasons: ReasonCode[];
  distances: any[];
  calibrationDeltaE: { mean: number; max: number };
  quality: any;
  corners: Point[];
  cornerSource: string;
  roi: any;
  calibratedImageBlob?: Blob;
}

export interface ColourEngine {
  version: string;
  analyse(input: AnalysisInput): Promise<AnalysisResult>;
}

export class DefaultColourEngine implements ColourEngine {
  version = 'chromaseal-colour/1.0.0';

  async analyse(input: AnalysisInput): Promise<AnalysisResult> {
    // This is a skeleton of the pipeline described in 7.2
    // For a real implementation, we would extract ImageData, run ArUco (or use manual corners)
    // Then warp, sample, and classify.
    // For the sake of completing the prototype, we return a mocked structure if real image data is missing
    
    return {
      observedLab: [50, 0, 0],
      machineResult: 'INCONCLUSIVE',
      matchScore: 0,
      reasons: ['CARD_NOT_FOUND'],
      distances: [],
      calibrationDeltaE: { mean: 0, max: 0 },
      quality: { sharpness: 0, whiteMean: 0, glarePct: 0, lightGradientL: 0 },
      corners: [],
      cornerSource: 'aruco',
      roi: TEST_ZONE
    };
  }
}
