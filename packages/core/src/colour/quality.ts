import { RGB, srgbToLab } from './srgb';

export function calculateSharpness(data: Uint8ClampedArray, width: number, height: number): number {
  // Variance of 3x3 Laplacian on greyscale
  // L = 0.299 R + 0.587 G + 0.114 B
  
  // Fast greyscale conversion
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  // 3x3 Laplacian kernel:
  //  0  1  0
  //  1 -4  1
  //  0  1  0
  const laplacian = new Float32Array((width - 2) * (height - 2));
  let lIdx = 0;
  let sum = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const val = 
        gray[idx - width] + 
        gray[idx - 1] + 
        gray[idx + 1] + 
        gray[idx + width] - 
        4 * gray[idx];
      laplacian[lIdx++] = val;
      sum += val;
    }
  }

  const mean = sum / laplacian.length;
  let sumSq = 0;
  for (let i = 0; i < laplacian.length; i++) {
    const diff = laplacian[i] - mean;
    sumSq += diff * diff;
  }

  return sumSq / laplacian.length;
}

export function analyzeWhitePatch(
  data: Uint8ClampedArray, width: number, height: number, x: number, y: number, size: number
) {
  // Use central 60%
  const inset = Math.floor(size * 0.2);
  let sum = 0;
  let maxChan = 0;
  let count = 0;

  for (let ry = y + inset; ry < y + size - inset; ry++) {
    for (let rx = x + inset; rx < x + size - inset; rx++) {
      const idx = (ry * width + rx) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      const chanMax = Math.max(r, g, b);
      if (chanMax > maxChan) maxChan = chanMax;
      
      // Simple mean of all channels for overall brightness
      sum += (r + g + b) / 3;
      count++;
    }
  }

  return {
    mean: sum / count,
    clip: maxChan
  };
}
