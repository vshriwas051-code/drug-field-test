import { Point } from './homography';

// Bilinear sampling from an ImageData-like object
export function bilinearSample(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number
): [number, number, number, number] { // R, G, B, A
  if (x < 0 || x >= width - 1 || y < 0 || y >= height - 1) {
    // Return black/transparent for out of bounds
    return [0, 0, 0, 0];
  }

  const x1 = Math.floor(x);
  const y1 = Math.floor(y);
  const x2 = x1 + 1;
  const y2 = y1 + 1;

  const dx = x - x1;
  const dy = y - y1;

  const i11 = (y1 * width + x1) * 4;
  const i21 = (y1 * width + x2) * 4;
  const i12 = (y2 * width + x1) * 4;
  const i22 = (y2 * width + x2) * 4;

  const w11 = (1 - dx) * (1 - dy);
  const w21 = dx * (1 - dy);
  const w12 = (1 - dx) * dy;
  const w22 = dx * dy;

  const r = data[i11] * w11 + data[i21] * w21 + data[i12] * w12 + data[i22] * w22;
  const g = data[i11 + 1] * w11 + data[i21 + 1] * w21 + data[i12 + 1] * w12 + data[i22 + 1] * w22;
  const b = data[i11 + 2] * w11 + data[i21 + 2] * w21 + data[i12 + 2] * w12 + data[i22 + 2] * w22;
  const a = data[i11 + 3] * w11 + data[i21 + 3] * w21 + data[i12 + 3] * w12 + data[i22 + 3] * w22;

  return [r, g, b, a];
}

// Convert a whole image using homography mapping from dst to src
export function warpImage(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  inverseH: number[][] // 3x3 matrix mapping dst coordinate to src coordinate
): Uint8ClampedArray {
  const dstData = new Uint8ClampedArray(dstW * dstH * 4);
  
  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      // Apply inverse homography: dst (x, y) -> src (sx, sy)
      const w = inverseH[2][0] * x + inverseH[2][1] * y + inverseH[2][2];
      const sx = (inverseH[0][0] * x + inverseH[0][1] * y + inverseH[0][2]) / w;
      const sy = (inverseH[1][0] * x + inverseH[1][1] * y + inverseH[1][2]) / w;

      const [r, g, b, a] = bilinearSample(srcData, srcW, srcH, sx, sy);
      
      const idx = (y * dstW + x) * 4;
      dstData[idx] = r;
      dstData[idx + 1] = g;
      dstData[idx + 2] = b;
      dstData[idx + 3] = a;
    }
  }

  return dstData;
}
