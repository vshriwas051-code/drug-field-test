import { ed25519 } from '@noble/curves/ed25519';
import { bytesToHex, hexToBytes } from '@noble/curves/abstract/utils';

export function generateKeyPair(): { privateKeyHex: string; publicKeyHex: string } {
  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKey);
  return {
    privateKeyHex: bytesToHex(privateKey),
    publicKeyHex: bytesToHex(publicKey)
  };
}

export function signPayload(payloadStr: string, privateKeyHex: string): string {
  const msgBytes = new TextEncoder().encode(payloadStr);
  const signature = ed25519.sign(msgBytes, hexToBytes(privateKeyHex));
  return bytesToHex(signature);
}

export function verifySignature(payloadStr: string, signatureHex: string, publicKeyHex: string): boolean {
  try {
    const msgBytes = new TextEncoder().encode(payloadStr);
    return ed25519.verify(hexToBytes(signatureHex), msgBytes, hexToBytes(publicKeyHex));
  } catch {
    return false;
  }
}
