export type AnyDict = { [id: string]: any }

export type Operator = {
  name: string;
  class: string;
  rarity: number;
  gender: string;
  height: number;
  race: string;
  headhunting: boolean;
  recruitment: boolean;
  limited: boolean;
  birthday: [number, number];
  event: boolean;
  faction: string;
  subfaction: string;
  release_date_en: number;
  EN: ReleaseInfo;
  CN: ReleaseInfo;
}

export type OperatorDict = { [id: string]: Operator }

export enum Region {
  EN = "EN",
  CN = "CN"
}

export type ReleaseInfo = {
  released: number;
  featured: BannerInfo[];
  shop: BannerInfo[];
}

export type BannerInfo = {
  start: number,
  end: number,
  title: string,
  featured: string[],
  shop: string[],
  isLimited: boolean,
  shopDebut6Star: string[],
  shopDebut5Star: string[],
  isEvent: boolean,
  isRotating: boolean
}

