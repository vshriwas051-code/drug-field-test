import canonicalizeLib from 'canonicalize';

/**
 * RFC 8785 Canonical JSON
 */
export function canonicalize(data: any): string {
  const result = canonicalizeLib(data);
  if (result === undefined) {
    throw new Error('Could not canonicalize data');
  }
  return result;
}
