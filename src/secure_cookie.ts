import { CipherKey, createHmac, randomBytes } from 'crypto';
import { buildAESCipher, BuildCipher, Cipher } from './cipher';
import { Codec } from './codec';
import { JSONSerializer, Serializer } from './serializer';
import { decodeBase64, encodeBase64 } from './util/base64';
import { joinBuffer, splitBuffer } from './util/buffer';
import { getTimestamp } from './util/timestamp';

type CompareResult = -1 | 1 | 0;

export class SecureCookie implements Codec {
  private _hashKey: CipherKey;
  private _blockKey?: CipherKey;
  private _buildCipher: BuildCipher = buildAESCipher;
  private _cipher?: Cipher;

  maxAge = 86400 * 30;
  minAge = 0;
  maxLength = 4096;
  hashAlgorithm = 'sha256';
  serializer: Serializer = new JSONSerializer();

  set buildCipher(buildCipher: BuildCipher) {
    if (!this._blockKey) {
      throw new Error('block key is not set');
    }
    this._buildCipher = buildCipher;
    this._cipher = this._buildCipher(this._blockKey);
  }

  constructor(hashKey: CipherKey, blockKey?: CipherKey) {
    this._hashKey = hashKey;
    this._blockKey = blockKey;
    if (this._blockKey) {
      this._cipher = this._buildCipher(this._blockKey);
    }
  }

  encode<T>(name: string, value: T): string {
    let serialized = this.serializer.serialize(value);

    if (this._cipher) {
      serialized = this._encrypt(serialized);
    }

    const encoded = encodeBase64(serialized);
    const now = getTimestamp();
    const mac = this._createMac(name, now, encoded);

    const cookieValueBuf = joinBuffer([now, encoded, mac], '|');
    const encodedValue = encodeBase64(Buffer.from(cookieValueBuf));

    if (this.maxLength && encodedValue.length > this.maxLength) {
      throw new Error('encoded value exceeds max length');
    }
    return encodedValue;
  }

  decode<T>(name: string, value: string): T {
    if (this.maxLength && value.length > this.maxLength) {
      throw new Error('value to decode exceeds max length');
    }

    const decodedValueBuf = decodeBase64(value);
    const [dateBuf, payloadBuf, mac] = splitBuffer(decodedValueBuf, '|', 3);
    if (!dateBuf || !payloadBuf || !mac) {
      throw new Error('passed value is not verified');
    }

    const date = dateBuf.toString();
    const payload = payloadBuf.toString();

    const macVerified = this._verifyMac(name, date, payload, mac);
    if (!macVerified) {
      throw new Error('passed value is not verified');
    }

    const timestamp = Number(date);
    if (Number.isNaN(timestamp)) {
      throw new Error('invalid timestamp');
    }
    const dateRangeCompared = this._verifyDateRange(timestamp);
    if (dateRangeCompared < 0) {
      throw new Error('timestamp is too new');
    } else if (dateRangeCompared > 0) {
      throw new Error('timestamp has expired');
    }

    let decodedPayload = decodeBase64(payload);
    if (this._blockKey) {
      decodedPayload = this._decrypt(decodedPayload);
    }

    return this.serializer.deserialize<T>(decodedPayload);
  }

  private _createMac(name: string, date: number | string, payload: string): Buffer {
    const hmac = createHmac(this.hashAlgorithm, this._hashKey);
    const target = [name, date, payload].join('|');
    return hmac.update(target).digest();
  }

  private _verifyMac(name: string, date: string, payload: string, mac: Buffer) {
    const hashed = this._createMac(name, date, payload);

    return Buffer.compare(hashed, mac) === 0;
  }

  private _verifyDateRange(timestamp: number): CompareResult {
    const now = getTimestamp();
    if (this.minAge && timestamp > now - this.minAge) {
      return -1;
    }
    if (this.maxAge && timestamp < now - this.maxAge) {
      return 1;
    }

    return 0;
  }

  private _encrypt(payload: Buffer): Buffer {
    if (!this._cipher) {
      throw new Error('block key is not set');
    }

    const blockSize = this._cipher.blockSize;
    const iv = randomBytes(blockSize);
    const encrypted = this._cipher.encrypt(payload, iv);

    return Buffer.concat([iv, encrypted]);
  }

  private _decrypt(payload: Buffer): Buffer {
    if (!this._cipher) {
      throw new Error('block key is not set');
    }

    const blockSize = this._cipher.blockSize;
    if (payload.length < blockSize) {
      throw new Error('value could not be decrypted');
    }

    const iv = payload.slice(0, blockSize);
    const value = payload.slice(blockSize);
    return this._cipher.decrypt(value, iv);
  }
}
