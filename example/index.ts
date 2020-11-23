import cookieParser from 'cookie-parser';
import express from 'express';
import { SecureCookie } from 'node-securecookie';

const app = express();
app.use(cookieParser());

const sc = new SecureCookie('12345', '1234567890123456');

app.get('/set-cookie', (req, res) => {
  const value = {
    foo: 'bar',
  };

  try {
    const encoded = sc.encode('cookie-name', value);
    res.cookie('cookie-name', encoded, {
      path: '/',
      httpOnly: true,
    });
    res.send('success');
  } catch (err) {
    // handle error
    res.status(500).send(err);
  }
});

app.get('/read-cookie', (req, res) => {
  const cookie = req.cookies['cookie-name'];

  try {
    const value = sc.decode<Record<string, string>>('cookie-name', cookie);
    res.json(value);
  } catch (err) {
    // handle error
    res.status(500).send(err);
  }
});

app.listen(8080);
