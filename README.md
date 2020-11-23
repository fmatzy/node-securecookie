# node-securecookie

securecookie implementation for Node.js

The main purpose of this package is to provide encoding and decoding capabilities that are compatible with [gorilla/securecookie](https://github.com/gorilla/securecookie).

## Installation

```console
$ npm install node-securecookie
```

## Usage

```typescript
import { SecureCookie } from 'node-securecookie';

// pass hash key and block key
const sc = new SecureCookie('12345', '1234567890123456');

const value = {
  foo: 'bar',
};

const encoded = sc.encode('cookie-name', value);
console.log(encoded);

const decoded = sc.decode<Record<string, string>>('cookie-name', encoded);
console.log(decoded);
```

See `/example` for the sample code that actually works using [express.js](https://github.com/expressjs/express).

## TODO

- [ ] Make errors easear to handle
- [ ] Do more tests
- [ ] Support `encoding/gob` serializer

## License

MIT &copy; fmatzy
