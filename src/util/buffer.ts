export function splitBuffer(buf: Buffer, delim: string | Buffer, limit?: number): Buffer[] {
  let search = -1;
  const delimBuf = typeof delim === 'string' ? Buffer.from(delim) : delim;
  const lines: Buffer[] = [];

  while ((search = buf.indexOf(delimBuf)) > -1) {
    lines.push(buf.slice(0, search));
    buf = buf.slice(search + delimBuf.length, buf.length);

    if (limit && lines.length >= limit - 1) {
      break;
    }
  }

  lines.push(buf);
  return lines;
}

export function joinBuffer(bufs: (Buffer | string | number)[], delim: string | Buffer): Buffer {
  const delimBuf = typeof delim === 'string' ? Buffer.from(delim) : delim;

  const joined = bufs.reduce<Buffer[]>((arr, buf, index) => {
    if (typeof buf === 'string') {
      buf = Buffer.from(buf);
    } else if (typeof buf === 'number') {
      buf = Buffer.from(buf.toString());
    }

    arr.push(buf);
    if (index < bufs.length - 1) {
      arr.push(delimBuf);
    }
    return arr;
  }, []);
  return Buffer.concat(joined);
}
