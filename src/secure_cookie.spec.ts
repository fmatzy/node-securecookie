import { SecureCookie } from './secure_cookie';

describe('SecureCookie', () => {
  it('works correctly', () => {
    const cookieValue = {
      foo: 'bar',
      baz: 128,
    };

    const sc1 = new SecureCookie('12345', '1234567890123456');
    const sc2 = new SecureCookie('54321', '6543210987654321');

    for (let i = 0; i < 50; i++) {
      const encoded1 = sc1.encode('sid', cookieValue);
      const decoded1 = sc1.decode<Record<string, any>>('sid', encoded1);
      expect(decoded1).toEqual(cookieValue);

      const encoded2 = sc2.encode('sid', cookieValue);
      const decoded2 = sc2.decode<Record<string, any>>('sid', encoded2);
      expect(decoded2).toEqual(cookieValue);
    }
  });
});
