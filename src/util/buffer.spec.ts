import { splitBuffer } from './buffer';

describe('splitBuffer', () => {
  it('works correctly', () => {
    const chunks = ['this', 'is', 'target'];
    const value = Buffer.from(chunks.join('|'));

    const splited = splitBuffer(value, '|').map((buf) => buf.toString());
    expect(splited).toEqual(chunks);
  });

  it('works correctly with limit', () => {
    const chunks = ['this', 'is', 'target|extra'];
    const value = Buffer.from(chunks.join('|'));

    const splited = splitBuffer(value, '|', 3).map((buf) => buf.toString());
    expect(splited).toEqual(chunks);
  });
});
