import { JSONSerializer } from './json_serializer';

const testCookies: Record<string, string>[] = [
  {
    foo: 'bar',
  },
  {
    baz: 'ding',
  },
];

describe('JSONSerializer', () => {
  it('works correctly', () => {
    const serlializer = new JSONSerializer();
    testCookies.forEach((cookie) => {
      const serialized = serlializer.serialize(cookie);
      const desirialized = serlializer.deserialize<Record<string, string>>(serialized);
      expect(desirialized).toEqual(cookie);
    });
  });
});
