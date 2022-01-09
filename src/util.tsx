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
