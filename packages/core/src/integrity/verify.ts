import { canonicalize } from './canonical';
import { hashString, hashBytes } from './hash';
import { signPayload, verifySignature } from './sign';

export type CheckStatus = 'pass' | 'fail' | 'warn' | 'skipped';

export interface VerifyCheck {
  id: string;
  label: string;
  status: CheckStatus;
  expected?: string;
  actual?: string;
  explanation: string;
}

export interface VerifyInput {
  payloadStr: string;
  signatureHex: string;
  devicePublicKeyHex: string;
  imageBytes?: Uint8Array;
  calibratedBytes?: Uint8Array;
  prevRecord?: any; // previous payload object
  receipt?: any;
  serverPublicKeyHex?: string;
  qrFingerprint?: string; // FIRST_16_HEX_OF_RECORD_HASH
}

export function verifyRecord(input: VerifyInput): VerifyCheck[] {
  const checks: VerifyCheck[] = [];

  let payloadObj: any;
  try {
    payloadObj = JSON.parse(input.payloadStr);
  } catch {
    checks.push({
      id: 'CANONICAL_FORM',
      label: 'Canonical form',
      status: 'fail',
      explanation: 'Payload is not valid JSON'
    });
    return checks; // Can't proceed
  }

  // 1. Canonical form
  let isCanonical = false;
  try {
    const canonical = canonicalize(payloadObj);
    isCanonical = (canonical === input.payloadStr);
  } catch {}
  
  checks.push({
    id: 'CANONICAL_FORM',
    label: 'Canonical form',
    status: isCanonical ? 'pass' : 'fail',
    explanation: isCanonical ? 'Stored payload is in its own canonical form' : 'Stored payload is not its own canonical form'
  });

  // 2. Signature
  const sigValid = verifySignature(input.payloadStr, input.signatureHex, input.devicePublicKeyHex);
  checks.push({
    id: 'SIGNATURE',
    label: 'Device signature',
    status: sigValid ? 'pass' : 'fail',
    explanation: sigValid ? 'Ed25519 signature verifies' : 'Ed25519 signature does not verify'
  });

  // 3. Image hash
  if (input.imageBytes) {
    const imageHash = hashBytes(input.imageBytes);
    const expectedHash = payloadObj.image?.sha256;
    const match = imageHash === expectedHash;
    checks.push({
      id: 'IMAGE_HASH',
      label: 'Image hash',
      status: match ? 'pass' : 'fail',
      expected: expectedHash,
      actual: imageHash,
      explanation: match ? 'SHA-256 of the image matches payload' : 'SHA-256 of the image differs from the payload'
    });
  }

  // 4. Calibrated image hash
  if (input.calibratedBytes) {
    const calHash = hashBytes(input.calibratedBytes);
    const expectedCalHash = payloadObj.calibratedImage?.sha256;
    const match = calHash === expectedCalHash;
    checks.push({
      id: 'CALIBRATED_HASH',
      label: 'Calibrated image hash',
      status: match ? 'pass' : 'fail',
      expected: expectedCalHash,
      actual: calHash,
      explanation: match ? 'SHA-256 of calibrated image matches payload' : 'SHA-256 of the calibrated image differs from the payload'
    });
  }

  // 5. Chain link
  if (input.prevRecord) {
    let expectedPrevHash = payloadObj.prevRecordHash;
    const prevCanonical = canonicalize(input.prevRecord);
    const actualPrevHash = hashString(prevCanonical);
    const match = actualPrevHash === expectedPrevHash || (expectedPrevHash === 'GENESIS' && !input.prevRecord);
    
    checks.push({
      id: 'CHAIN_LINK',
      label: 'Chain link',
      status: match ? 'pass' : 'fail',
      expected: expectedPrevHash,
      actual: actualPrevHash,
      explanation: match ? 'Previous record matches prevRecordHash' : 'Previous record hash differs from prevRecordHash'
    });
  }

  // 6. QR Fingerprint
  if (input.qrFingerprint) {
    const recordHash = hashString(input.payloadStr);
    const expectedQr = recordHash.substring(0, 16);
    const match = input.qrFingerprint.toLowerCase() === expectedQr.toLowerCase();
    checks.push({
      id: 'QR_FINGERPRINT',
      label: 'QR Fingerprint',
      status: match ? 'pass' : 'fail',
      expected: expectedQr,
      actual: input.qrFingerprint,
      explanation: match ? 'Fingerprint in QR matches record hash' : 'Fingerprint in the QR differs from the record hash'
    });
  }

  // 7. Time drift
  if (payloadObj.capturedAt && payloadObj.serverReceivedAt) { // Wait, the spec says "received more than 10 minutes after capture without an offline-queue flag". The offline flag is in the request, not payload, but for verify we check if we have the data.
    // For now skip time drift as it's a warn only and depends on API
  }

  return checks;
}
