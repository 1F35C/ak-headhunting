export type BannerInfo = {
  start: number,
  end: number,
}

export type ReleaseInfo = {
  released: number;
  featured: [BannerInfo];
  shop: [BannerInfo];
}

export type Operator = {
  name: string;
  class: string;
  rarity: number;
  headhunting: boolean;
  recruitment: boolean;
  limited: boolean;
  faction: string;
  subfaction: string;
  release_date_en: number;
  EN: ReleaseInfo;
  CN: ReleaseInfo;
}

export type OperatorDict = { [id: string]: Operator }

type DataJsonFormat = {
  operators: OperatorDict
}

export class AKData {
  _operators: OperatorDict = {};
  
  constructor() {
    if (AKData._instance !== null) {
      throw new Error("Constructor not available for singleton");
    }

    let data: DataJsonFormat = require('./data.json');
    this._operators = data.operators;
    AKData._instance = this;
  }

  operators(): OperatorDict {
    return this._operators;
  }

  static _instance: AKData | null = null;
  static getInstance(): AKData {
    if (AKData._instance === null) {
      AKData._instance = new AKData();
    }
    return AKData._instance;
  }
}
