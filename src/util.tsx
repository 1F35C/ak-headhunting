export enum TimeUnit {
  DAY = 24 * 3600 * 1000,
  BANNER = 14 * TimeUnit.DAY
}

export function unixTimeDeltaToDays(delta: number): number {
  return Math.floor(delta / TimeUnit.DAY);
}

export function daysSince(unixTime: number): number {
  return Math.floor((Date.now() - unixTime) / TimeUnit.DAY);
}
export function getQuarter(unixTime: number): string {
  const date = new Date(unixTime);
  return date.getFullYear() + '\'Q ' + (Math.floor(date.getMonth() / 3) + 1);
}

// Images

const IMAGES: { [id: string]: { [id: string]: string } } = require('./images.json');
const PUBLIC_URL = '/ak-headhunting';

export function getOperatorImage(name: string): string {
  return getImage('portraits', name);
}

export function getImage(context: string, value: string): string {
  if (context in IMAGES && value in IMAGES[context]) {
    if (window.location.href.toLowerCase().includes('localhost')) {
      return IMAGES[context][value];
    } else {
      return PUBLIC_URL + IMAGES[context][value];
    }
  }
  throw new Error("Image could not be found");
}

