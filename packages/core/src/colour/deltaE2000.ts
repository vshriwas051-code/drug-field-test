import { Lab } from './srgb';

/**
 * CIEDE2000 Color Difference
 * Implementation of the algorithm described by Sharma, Wu, and Dalal (2005)
 * "The CIEDE2000 Color-Difference Formula: Implementation Notes, Supplementary Test Data, and Mathematical Observations"
 */
export function deltaE2000(lab1: Lab, lab2: Lab, kL = 1, kC = 1, kH = 1): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  // Step 1: Calculate C_i, h_i (i = 1, 2)
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));

  const a1_prime = a1 * (1 + G);
  const a2_prime = a2 * (1 + G);

  const C1_prime = Math.sqrt(a1_prime * a1_prime + b1 * b1);
  const C2_prime = Math.sqrt(a2_prime * a2_prime + b2 * b2);

  const h1_prime = (b1 === 0 && a1_prime === 0) ? 0 : Math.atan2(b1, a1_prime) * (180 / Math.PI);
  const h1_prime_rad = h1_prime >= 0 ? h1_prime : h1_prime + 360;

  const h2_prime = (b2 === 0 && a2_prime === 0) ? 0 : Math.atan2(b2, a2_prime) * (180 / Math.PI);
  const h2_prime_rad = h2_prime >= 0 ? h2_prime : h2_prime + 360;

  // Step 2: Calculate dL_prime, dC_prime, dH_prime
  const dL_prime = L2 - L1;
  const dC_prime = C2_prime - C1_prime;

  let dh_prime = 0;
  if (C1_prime * C2_prime !== 0) {
    if (Math.abs(h2_prime_rad - h1_prime_rad) <= 180) {
      dh_prime = h2_prime_rad - h1_prime_rad;
    } else if (h2_prime_rad - h1_prime_rad > 180) {
      dh_prime = h2_prime_rad - h1_prime_rad - 360;
    } else if (h2_prime_rad - h1_prime_rad < -180) {
      dh_prime = h2_prime_rad - h1_prime_rad + 360;
    }
  }

  const dH_prime = 2 * Math.sqrt(C1_prime * C2_prime) * Math.sin((dh_prime / 2) * (Math.PI / 180));

  // Step 3: Calculate CIEDE2000 Color-Difference dE00
  const Lbar_prime = (L1 + L2) / 2;
  const Cbar_prime = (C1_prime + C2_prime) / 2;

  let hbar_prime = h1_prime_rad + h2_prime_rad;
  if (C1_prime * C2_prime !== 0) {
    if (Math.abs(h1_prime_rad - h2_prime_rad) <= 180) {
      hbar_prime = (h1_prime_rad + h2_prime_rad) / 2;
    } else if (Math.abs(h1_prime_rad - h2_prime_rad) > 180 && h1_prime_rad + h2_prime_rad < 360) {
      hbar_prime = (h1_prime_rad + h2_prime_rad + 360) / 2;
    } else if (Math.abs(h1_prime_rad - h2_prime_rad) > 180 && h1_prime_rad + h2_prime_rad >= 360) {
      hbar_prime = (h1_prime_rad + h2_prime_rad - 360) / 2;
    }
  }

  const T = 1 - 0.17 * Math.cos((hbar_prime - 30) * (Math.PI / 180))
    + 0.24 * Math.cos((2 * hbar_prime) * (Math.PI / 180))
    + 0.32 * Math.cos((3 * hbar_prime + 6) * (Math.PI / 180))
    - 0.20 * Math.cos((4 * hbar_prime - 63) * (Math.PI / 180));

  const dTheta = 30 * Math.exp(-Math.pow((hbar_prime - 275) / 25, 2));

  const RC = 2 * Math.sqrt(Math.pow(Cbar_prime, 7) / (Math.pow(Cbar_prime, 7) + Math.pow(25, 7)));

  const SL = 1 + (0.015 * Math.pow(Lbar_prime - 50, 2)) / Math.sqrt(20 + Math.pow(Lbar_prime - 50, 2));
  const SC = 1 + 0.045 * Cbar_prime;
  const SH = 1 + 0.015 * Cbar_prime * T;

  const RT = -Math.sin(2 * dTheta * (Math.PI / 180)) * RC;

  const dE00 = Math.sqrt(
    Math.pow(dL_prime / (kL * SL), 2) +
    Math.pow(dC_prime / (kC * SC), 2) +
    Math.pow(dH_prime / (kH * SH), 2) +
    RT * (dC_prime / (kC * SC)) * (dH_prime / (kH * SH))
  );

  return dE00;
}
