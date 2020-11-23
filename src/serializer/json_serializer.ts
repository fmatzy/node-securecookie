import { Serializer } from './serializer';

export class JSONSerializer implements Serializer {
  serialize<T>(src: T): Buffer {
    return Buffer.from(JSON.stringify(src, null, 0));
  }

  deserialize<T>(src: Uint8Array): T {
    return JSON.parse(src.toString());
  }
}
