import { BinaryLike, CipherKey, createCipheriv, createDecipheriv } from 'crypto';
import { BuildCipher, Cipher } from './cipher';

export class AESCipher implements Cipher {
  private _blockKey: CipherKey;
  private _algorithm: string;

  readonly blockSize = 16;

  constructor(blockKey: CipherKey) {
    const keyLength = Buffer.from(blockKey).length;
    switch (keyLength) {
      case 16:
        this._algorithm = getCipherAlgorithm(128);
        break;
      case 24:
        this._algorithm = getCipherAlgorithm(192);
        break;
      case 32:
        this._algorithm = getCipherAlgorithm(256);
        break;
      default:
        throw new Error('invalid key length');
    }
    this._blockKey = blockKey;
  }

  encrypt(payload: Buffer, iv: BinaryLike): Buffer {
    const cipher = createCipheriv(this._algorithm, this._blockKey, iv);
    const encrypted = cipher.update(payload);
    const final = cipher.final();

    return Buffer.concat([encrypted, final]);
  }

  decrypt(payload: Buffer, iv: BinaryLike): Buffer {
    const decipher = createDecipheriv(this._algorithm, this._blockKey, iv);
    const decrypted = decipher.update(payload, 'binary', 'binary');
    const final = decipher.final('binary');
    return Buffer.from(decrypted + final);
  }
}

export const buildAESCipher: BuildCipher = (blockKey) => {
  return new AESCipher(blockKey);
};

function getCipherAlgorithm(keyBitLength: number): string {
  return `aes-${keyBitLength}-ctr`;
}
