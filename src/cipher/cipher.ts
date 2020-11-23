import { BinaryLike, CipherKey } from 'crypto';

export interface Cipher {
  readonly blockSize: number;
  encrypt(payload: Buffer, iv: BinaryLike): Buffer;
  decrypt(payload: Buffer, iv: BinaryLike): Buffer;
}

export type BuildCipher = (blockKey: CipherKey) => Cipher;
