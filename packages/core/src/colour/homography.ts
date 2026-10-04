export type Point = { x: number; y: number };
export type Matrix3 = number[][]; // 3x3

// Solves Ax = b using Gaussian elimination with partial pivoting
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Partial pivoting
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-10) {
      throw new Error('Singular matrix');
    }

    // Eliminate below
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += M[i][j] * x[j];
    }
    x[i] = (M[i][n] - sum) / M[i][i];
  }
  return x;
}

// Fit homography from source points to destination points
// Map: Canonical (src) -> Image (dst)
export function fitHomography(src: Point[], dst: Point[]): Matrix3 {
  if (src.length !== dst.length || src.length < 4) {
    throw new Error('Need at least 4 point pairs for homography');
  }
  const n = src.length;
  // We want to solve for h11..h32 where h33 = 1
  // x' = (h11 x + h12 y + h13) / (h31 x + h32 y + 1)
  // y' = (h21 x + h22 y + h23) / (h31 x + h32 y + 1)
  // x' (h31 x + h32 y + 1) = h11 x + h12 y + h13
  // y' (h31 x + h32 y + 1) = h21 x + h22 y + h23
  // -x h11 - y h12 - h13 + x x' h31 + y x' h32 = -x'
  // -x h21 - y h22 - h23 + x y' h31 + y y' h32 = -y'
  
  const A = Array.from({ length: 2 * n }, () => new Array(8).fill(0));
  const b = new Array(2 * n).fill(0);

  for (let i = 0; i < n; i++) {
    const x = src[i].x;
    const y = src[i].y;
    const X = dst[i].x;
    const Y = dst[i].y;

    A[2 * i] = [-x, -y, -1, 0, 0, 0, x * X, y * X];
    b[2 * i] = -X;

    A[2 * i + 1] = [0, 0, 0, -x, -y, -1, x * Y, y * Y];
    b[2 * i + 1] = -Y;
  }

  // A is (2n)x8, b is (2n)x1. We solve A^T A h = A^T b
  const At = Array.from({ length: 8 }, () => new Array(2 * n).fill(0));
  for (let i = 0; i < 2 * n; i++) {
    for (let j = 0; j < 8; j++) {
      At[j][i] = A[i][j];
    }
  }

  const AtA = Array.from({ length: 8 }, () => new Array(8).fill(0));
  const Atb = new Array(8).fill(0);

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let sum = 0;
      for (let k = 0; k < 2 * n; k++) {
        sum += At[i][k] * A[k][j];
      }
      AtA[i][j] = sum;
    }
    let sum = 0;
    for (let k = 0; k < 2 * n; k++) {
      sum += At[i][k] * b[k];
    }
    Atb[i] = sum;
  }

  const h = solveLinearSystem(AtA, Atb);
  
  return [
    [h[0], h[1], h[2]],
    [h[3], h[4], h[5]],
    [h[6], h[7], 1.0]
  ];
}

export function applyHomography(H: Matrix3, pt: Point): Point {
  const w = H[2][0] * pt.x + H[2][1] * pt.y + H[2][2];
  return {
    x: (H[0][0] * pt.x + H[0][1] * pt.y + H[0][2]) / w,
    y: (H[1][0] * pt.x + H[1][1] * pt.y + H[1][2]) / w
  };
}
