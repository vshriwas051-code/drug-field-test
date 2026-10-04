import { describe, it, expect } from 'vitest';
import { srgbToLinear, linearToSrgb, hexToLab, linearRgbToXyz, xyzToLab, srgbArrayToLinear, hexToRgb } from '../src/colour/srgb';
import { deltaE2000 } from '../src/colour/deltaE2000';
import { fitHomography, applyHomography } from '../src/colour/homography';
import { fitColorCorrection, applyColorCorrection } from '../src/colour/calibrate';
import { canonicalize, hashString, hashBytes, generateKeyPair, signPayload, verifySignature, verifyRecord } from '../src/integrity';

describe('7.3 Colour maths (exact)', () => {
  it('Required test vectors', () => {
    // #FFFFFF -> Lab (100, 0, 0) within 0.01
    const whiteLab = hexToLab('FFFFFF');
    expect(whiteLab[0]).toBeCloseTo(100, 2);
    expect(whiteLab[1]).toBeCloseTo(0, 2);
    expect(whiteLab[2]).toBeCloseTo(0, 2);

    // #FF0000 -> (53.24, 80.09, 67.20) within 0.05
    const redLab = hexToLab('FF0000');
    expect(redLab[0]).toBeCloseTo(53.24, 1);
    expect(redLab[1]).toBeCloseTo(80.09, 1);
    expect(redLab[2]).toBeCloseTo(67.20, 1);

    // deltaE2000 between (50, 2.6772, -79.7751) and (50, 0, -82.7485) = 2.0425 ± 0.0001
    const dE = deltaE2000([50, 2.6772, -79.7751], [50, 0, -82.7485]);
    expect(dE).toBeCloseTo(2.0425, 4);
  });
});

describe('Homography', () => {
  it('homography round trip (4 points out and back within 0.01 px)', () => {
    const src = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];
    const dst = [
      { x: 10, y: 10 },
      { x: 120, y: 15 },
      { x: 90, y: 110 },
      { x: 5, y: 95 }
    ];
    const H = fitHomography(src, dst);
    
    for (let i = 0; i < 4; i++) {
      const mapped = applyHomography(H, src[i]);
      expect(mapped.x).toBeCloseTo(dst[i].x, 2);
      expect(mapped.y).toBeCloseTo(dst[i].y, 2);
    }
  });
});

describe('Integrity', () => {
  it('canonicalisation is stable', () => {
    const a = { b: 1, a: 2 };
    const b = { a: 2, b: 1 };
    expect(canonicalize(a)).toBe(canonicalize(b));
  });

  it('sign and verify round trip', () => {
    const { privateKeyHex, publicKeyHex } = generateKeyPair();
    const payload = canonicalize({ test: true });
    const sig = signPayload(payload, privateKeyHex);
    expect(verifySignature(payload, sig, publicKeyHex)).toBe(true);
    
    // Changing payload fails
    const badPayload = canonicalize({ test: false });
    expect(verifySignature(badPayload, sig, publicKeyHex)).toBe(false);
  });
  
  it('verifyRecord check failures', () => {
    const { privateKeyHex, publicKeyHex } = generateKeyPair();
    const payloadObj = {
      image: { sha256: hashBytes(new Uint8Array([1, 2, 3])) }
    };
    const payload = canonicalize(payloadObj);
    const sig = signPayload(payload, privateKeyHex);
    
    const checks = verifyRecord({
      payloadStr: payload,
      signatureHex: sig,
      devicePublicKeyHex: publicKeyHex,
      imageBytes: new Uint8Array([1, 2, 3]) // matching
    });
    
    expect(checks.find(c => c.id === 'SIGNATURE')?.status).toBe('pass');
    expect(checks.find(c => c.id === 'IMAGE_HASH')?.status).toBe('pass');
    
    // Bad image bytes
    const checks2 = verifyRecord({
      payloadStr: payload,
      signatureHex: sig,
      devicePublicKeyHex: publicKeyHex,
      imageBytes: new Uint8Array([1, 2, 4]) // non-matching
    });
    
    expect(checks2.find(c => c.id === 'IMAGE_HASH')?.status).toBe('fail');
  });
});
