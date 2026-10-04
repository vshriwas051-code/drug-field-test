import { srgbToLab, hexToLab, Lab } from './srgb';
import { deltaE2000 } from './deltaE2000';
import { RGB } from './srgb';

export interface ClassDefinition {
  id: string;
  label: string;
  reportedResult: 'PRESUMPTIVE_POSITIVE' | 'PRESUMPTIVE_NEGATIVE';
  referenceColours: Lab[];
}

export interface KitProfile {
  id: string;
  version: number;
  classes: ClassDefinition[];
  thresholds: {
    sharpnessWarn: number;
    sharpnessFail: number;
    whiteMeanWarn: number;
    whiteMeanFail: number;
    whiteClip: number;
    glareWarnPct: number;
    glareFailPct: number;
    lightSpreadWarnL: number;
    calibrationGood: number;
    calibrationFail: number;
    uniformityWarnL: number;
    sampleMinPixels: number;
    maxMatchDeltaE: number;
    ambiguityMargin: number;
    matchTemperature: number;
  };
}

export type ReasonCode = 'BLUR' | 'UNDEREXPOSED' | 'OVEREXPOSED' | 'GLARE' | 'UNEVEN_LIGHT' | 'CARD_NOT_FOUND' | 'CALIBRATION_ERROR' | 'SAMPLE_NOT_UNIFORM' | 'SAMPLE_TOO_SMALL' | 'NO_MATCH' | 'AMBIGUOUS' | 'OUTSIDE_READ_WINDOW' | 'OPERATOR_DISAGREES';

export interface ClassifyInput {
  observedLab: Lab;
  kit: KitProfile;
  qualityFailures: ReasonCode[]; // e.g., from image quality checks (BLUR, etc)
}

export interface ClassifyResult {
  machineResult: 'PRESUMPTIVE_POSITIVE' | 'PRESUMPTIVE_NEGATIVE' | 'INCONCLUSIVE';
  matchScore: number;
  reasons: ReasonCode[];
  distances: { classId: string; deltaE: number }[];
}

export function classify(input: ClassifyInput): ClassifyResult {
  const { observedLab, kit, qualityFailures } = input;
  const th = kit.thresholds;
  
  // 1. Calculate minimum dE for each class
  const classDistances = kit.classes.map(c => {
    let minD = Infinity;
    for (const ref of c.referenceColours) {
      const d = deltaE2000(observedLab, ref);
      if (d < minD) minD = d;
    }
    return { classId: c.id, deltaE: minD, def: c };
  });

  // Sort ascending by deltaE
  classDistances.sort((a, b) => a.deltaE - b.deltaE);

  const distances = classDistances.map(c => ({ classId: c.classId, deltaE: c.deltaE }));

  // 2. Apply rules
  let machineResult: 'PRESUMPTIVE_POSITIVE' | 'PRESUMPTIVE_NEGATIVE' | 'INCONCLUSIVE' = 'INCONCLUSIVE';
  let reasons: ReasonCode[] = [...qualityFailures];

  let c1 = classDistances[0];
  let c2 = classDistances[1];

  if (qualityFailures.length > 0) {
    // any quality fail -> INCONCLUSIVE
    machineResult = 'INCONCLUSIVE';
  } else if (c1.deltaE > th.maxMatchDeltaE) {
    machineResult = 'INCONCLUSIVE';
    reasons.push('NO_MATCH');
  } else if (c2 && (c2.deltaE - c1.deltaE < th.ambiguityMargin)) {
    machineResult = 'INCONCLUSIVE';
    reasons.push('AMBIGUOUS');
  } else {
    machineResult = c1.def.reportedResult;
  }

  // 3. Match score (tau = matchTemperature)
  // score = e^{-d1/tau} / sum(e^{-dk/tau})
  const tau = th.matchTemperature;
  let sumExp = 0;
  for (const c of classDistances) {
    sumExp += Math.exp(-c.deltaE / tau);
  }
  const matchScore = Math.exp(-c1.deltaE / tau) / sumExp;

  return {
    machineResult,
    matchScore,
    reasons,
    distances
  };
}
