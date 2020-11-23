export interface Serializer {
  serialize<T>(src: T): Buffer;
  deserialize<T>(src: Uint8Array): T;
}
