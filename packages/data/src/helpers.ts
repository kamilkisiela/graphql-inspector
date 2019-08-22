import {Source} from 'graphql';
import {gzip} from 'zlib';
import {createHash} from 'crypto';

export function hash(data: string): string {
  return createHash('sha512')
    .update(data)
    .digest('hex');
}

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

export function flatten<T>(list: T[][]): T[] {
  return Array.prototype.concat(...list);
}

export function unique<T>(list: T[]): T[] {
  return list.filter((val, i, all) => all.indexOf(val) === i);
}
