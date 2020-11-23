export interface Codec {
  encode<T>(name: string, value: T): string;
  decode<T>(name: string, value: string): T;
}
