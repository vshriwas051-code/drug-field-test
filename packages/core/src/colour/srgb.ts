export type RGB = [number, number, number]; // [0, 255] or [0, 1] depending on context, we will standardize on [0, 1] for math
export type Lab = [number, number, number];
export type XYZ = [number, number, number];

export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function srgbArrayToLinear(rgb: RGB): RGB {
  return [srgbToLinear(rgb[0]), srgbToLinear(rgb[1]), srgbToLinear(rgb[2])];
}

export function linearToSrgbArray(rgb: RGB): RGB {
  return [linearToSrgb(rgb[0]), linearToSrgb(rgb[1]), linearToSrgb(rgb[2])];
}

export function linearRgbToXyz(rgb: RGB): XYZ {
  const [R, G, B] = rgb;
  const X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B;
  const Y = 0.2126729 * R + 0.7151522 * G + 0.0721750 * B;
  const Z = 0.0193339 * R + 0.1191920 * G + 0.9503041 * B;
  return [X, Y, Z];
}

export function xyzToLab(xyz: XYZ): Lab {
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  const [X, Y, Z] = xyz;

  const f = (t: number): number => {
    const limit = Math.pow(6 / 29, 3);
    if (t > limit) {
      return Math.cbrt(t);
    } else {
      return t / (3 * Math.pow(6 / 29, 2)) + 4 / 29;
    }
  };

  const fx = f(X / Xn);
  const fy = f(Y / Yn);
  const fz = f(Z / Zn);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [L, a, b];
}

export function srgbToLab(rgb: RGB): Lab {
  const linear = srgbArrayToLinear(rgb);
  const xyz = linearRgbToXyz(linear);
  return xyzToLab(xyz);
}

export function hexToRgb(hex: string): RGB {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export function hexToLab(hex: string): Lab {
  return srgbToLab(hexToRgb(hex));
}
