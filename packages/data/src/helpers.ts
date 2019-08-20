import {Source} from 'graphql';
import {gzip} from 'zlib';

export function hrTimeToNs(hrtime: [number, number]) {
  return hrtime[0] * 1e9 + hrtime[1];
}

export function isSource(source: any): source is Source {
  return typeof source.body === 'string';
}

export function uuid() {
  return Math.random()
    .toString(16)
    .substr(2);
}

export function compress<T extends object>(obj: T): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer = Buffer.from(JSON.stringify(obj), 'utf-8');

    gzip(buffer, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
