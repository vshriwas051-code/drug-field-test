import { RGB } from './srgb';

export type Matrix3 = number[][]; // 3x3

export function invert3x3(M: Matrix3): Matrix3 {
  const [[a, b, c], [d, e, f], [g, h, i]] = M;
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < 1e-10) {
    throw new Error('Singular matrix in color calibration');
  }
  const invDet = 1 / det;
  return [
    [(e * i - f * h) * invDet, (c * h - b * i) * invDet, (b * f - c * e) * invDet],
    [(f * g - d * i) * invDet, (a * i - c * g) * invDet, (c * d - a * f) * invDet],
    [(d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet]
  ];
}

// O and R are Nx3 (where N=12 typically)
// M = (O^T O + \lambda I)^{-1} O^T R
export function fitColorCorrection(observed: RGB[], reference: RGB[], lambda = 1e-4): Matrix3 {
  if (observed.length !== reference.length || observed.length === 0) {
    throw new Error('Observed and reference must be same non-zero length');
  }
  const N = observed.length;
  
  // Compute O^T O
  const OtO: Matrix3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  for (let i = 0; i < N; i++) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        OtO[r][c] += observed[i][r] * observed[i][c];
      }
    }
  }

  // Add lambda I
  for (let i = 0; i < 3; i++) {
    OtO[i][i] += lambda;
  }

  const invOtO = invert3x3(OtO);

  // Compute O^T R
  const OtR: Matrix3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  for (let i = 0; i < N; i++) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        OtR[r][c] += observed[i][r] * reference[i][c];
      }
    }
  }

  // M = invOtO * OtR
  const M: Matrix3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += invOtO[r][k] * OtR[k][c];
      }
      M[r][c] = sum;
    }
  }

  return M;
}

export function applyColorCorrection(observed: RGB, M: Matrix3): RGB {
  const corrected: RGB = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    let sum = 0;
    for (let k = 0; k < 3; k++) {
      sum += observed[k] * M[k][c];
    }
    // Clamp to [0, 1] although physically it can exceed
    corrected[c] = Math.max(0, Math.min(1, sum));
  }
  return corrected;
}
