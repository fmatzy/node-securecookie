export function encodeBase64(buf: Buffer): string {
  return buf.toString('base64');
}

export function decodeBase64(value: string): Buffer {
  return Buffer.from(value, 'base64');
}
