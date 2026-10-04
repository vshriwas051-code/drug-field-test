import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

export function hashString(data: string): string {
  const bytes = new TextEncoder().encode(data);
  return hashBytes(bytes);
}

export function hashBytes(bytes: Uint8Array): string {
  const hash = sha256(bytes);
  return bytesToHex(hash);
}
