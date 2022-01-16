import { unixTimeDeltaToDays, TimeUnit, getQuarter } from './util';

const PUBLIC_URL = '/ak-headhunting';

export enum Region {
  EN = "EN",
  CN = "CN"
}

export type ReleaseInfo = {
  released: number;
  featured: BannerInfo[];
  shop: BannerInfo[];
}

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

type BannerInfo = {
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

type BannerDict = { [key in Region]: BannerInfo[] };


type DataJsonFormat = {
  operators: OperatorDict,
  banners: BannerDict
}

export type HistoricalNumericDataPoint = {
  time: Date,
  value: number
}

export type HistoricalAnnotatedNumericDataPoint = HistoricalNumericDataPoint & {
  label: string | null
}

export type AggregateData = { [id: string]: number }

export type AggregateData2D = { [id: string]: AggregateData }

export type HistogramDatum = { value: number }

export type PeriodicAggregateData = {
  period: string,
  data: AggregateData
}

export type HistoricalAggregateDataPoint = {
  time: Date,
  data: AggregateData
}

function indexOfLatestShopOperator(operators: Operator[], region: Region): number {
  if (operators.length <= 1) {
    throw new Error('Operator count sus');
  }

  for (let idx = operators.length - 1; idx >= 0; --idx) {
    if (operators[idx][region].shop.length > 0) {
      return idx;
    }
  }
  return -1;
}

function birthdayDelta(now: Date, op: Operator): number {
  if (op.birthday === null) {
    return Infinity;
  }
  let birthday = new Date(now.getFullYear(), op.birthday[0] - 1, op.birthday[1]);
  let delta = Math.ceil((birthday.valueOf() - now.valueOf()) / TimeUnit.DAY);
  if (delta < 0) {
    birthday = new Date(now.getFullYear() + 1, op.birthday[0] - 1, op.birthday[1]);
    delta = Math.ceil((birthday.valueOf() - now.valueOf()) / TimeUnit.DAY);
  }
  return delta;
}

export class AKData {
  _region: Region;
  _operators: OperatorDict = {};
  _sortedOperators: Operator[];
  _banners: BannerDict = {
    [Region.EN]: [],
    [Region.CN]: []
  };
  
  constructor(region: Region) {
    if (AKData._instance !== null) {
      throw new Error("Constructor not available for singleton");
    }

    let data: DataJsonFormat = require('./data.json');
    this._region = region;
    this._operators = data.operators;
    this._sortedOperators = Object.values(this._operators)
        .sort((op1, op2) => {
          return op1[this._region].released > op2[this._region].released ? 1 : -1;
        });
    this._banners = data.banners;
    AKData._instance = this;
  }

  static _instance: AKData | null = null;
  static getInstance(): AKData {
    if (AKData._instance === null) {
      AKData._instance = new AKData(Region.EN);
    }
    return AKData._instance;
  }

  operators(): OperatorDict {
    return this._operators;
  }
  
  banners(): BannerInfo[] {
    return this._banners[this._region];
  }

  latestOperator(): Operator {
    const lastReleaseDate = this._sortedOperators[this._sortedOperators.length - 1][this._region].released;
    let latestBatch = this._sortedOperators
        .filter(op => op[this._region].released === lastReleaseDate)
        .sort((op1, op2) => {
          // Sort by rarity, then limited
          if (op1.rarity === op2.rarity) {
            if (op1.limited && op2.limited) { return 0; }
            return op1.limited ? -1 : 1;
          }
          return op1.rarity < op2.rarity ? 1 : -1;
        });
    return latestBatch[0];
  }
  
  // If there are operators whose birthdays are today, return that
  // Otherwise, return operators whose birthdays are the next closest day.
  upcomingBirthdays(): Operator[] {
    let result: Operator[] = Array.of();
    const now = new Date();
    let closest = Infinity;
    this._sortedOperators.forEach(op => {
      let delta = birthdayDelta(now, op);
      if (delta === closest) {
        result.push(op);
      } else if (delta < closest) {
        result = Array.of(op);
        closest = delta;
      }
    });
    return result;
  }

  overdueFeatured(): Operator[] {
    return [];
  }

  overdueShop(): Operator[] {
    return [];
  }

  recentAndUpcomingShopOperators(before: number, after: number): [Operator[], number[]] {
    let sixStars = this._sortedOperators.filter(op => !op.limited && op.rarity === 6)
    let latestIdx = indexOfLatestShopOperator(sixStars, this._region);
    let operators = sixStars.slice(latestIdx - before, latestIdx + 1 + after);
    let predictions = operators.map((op, idx) => {
      return operators[before][this._region].shop[0].start + (idx - before) * 3 * TimeUnit.BANNER;
    });
    return [operators, predictions];
  }

  debutBannerDuration(): HistoricalAnnotatedNumericDataPoint[] {
    let banners = this._banners[this._region].filter(b => b.isRotating && b.shopDebut6Star.length > 0);
    return banners.map(b => {
      return {
        time: new Date(b.start),
        value: unixTimeDeltaToDays(b.end - b.start),
        label: b.shopDebut6Star[0]
      }
    });
  }

  nonDebutBannerDuration(): HistoricalNumericDataPoint[] {
    let banners = this._banners[this._region].filter(b => b.isRotating && b.shopDebut6Star.length === 0);
    return banners.map(b => {
      return {
        time: new Date(b.start),
        value: unixTimeDeltaToDays(b.end - b.start),
      }
    });
  }

  certificateShop5StarDelay(): HistoricalNumericDataPoint[] {
    let operators = Object.values(this._operators)
        .filter(op => op[this._region].shop.length > 0 && op.rarity === 5)
        .sort((op1, op2) => {
          return op1[this._region].shop[0].start > op2[this._region].shop[0].start ? 1 : -1;
        });
    return operators.map(op => {
      return {
        time: new Date(op[this._region].shop[0].start),
        value: unixTimeDeltaToDays(op[this._region].shop[0].start - op[this._region].released)
      };
    });
  }

  certificateShop6StarDelay(): HistoricalNumericDataPoint[] {
    let operators = Object.values(this._operators)
        .filter(op => op[this._region].shop.length > 0 && op.rarity === 6)
        .sort((op1, op2) => {
          return op1[this._region].shop[0].start > op2[this._region].shop[0].start ? 1 : -1;
        });
    return operators.map(op => {
      return {
        time: new Date(op[this._region].shop[0].start),
        value: unixTimeDeltaToDays(op[this._region].shop[0].start - op[this._region].released)
      };
    });
  }

  // Region doesn't make sense for this one
  releaseDelayData(): HistoricalAggregateDataPoint[] {
    return this._sortedOperators.map(op => {
      return {
        time: new Date(op[this._region].released),
        data: { value: unixTimeDeltaToDays(op[this._region].released - op.CN.released) }
      };
    });
  }

  quarterlyOperatorReleaseData(): PeriodicAggregateData[] {
    let lastReleased = null;
    let result: PeriodicAggregateData[] = [];
    for (let idx = 1; idx < this._sortedOperators.length; ++idx) {
      const operator = this._sortedOperators[idx];
      if (operator[this._region].released === this._sortedOperators[0][this._region].released) {
        continue;
      }
      const quarter = getQuarter(operator[this._region].released);
      if (lastReleased === null || quarter !== lastReleased) {
        result.push({
          'period': quarter,
          'data': {
            'event': 0,
            'limited': 0,
            'standard': 0
          }
        });
        lastReleased = quarter;
      }
      if (operator.event) {
        result[result.length - 1]['data']['event']++;
      } else if (operator.limited) {
        result[result.length - 1]['data']['limited']++;
      } else if (operator.headhunting) {
        result[result.length - 1]['data']['standard']++;
      }
    }
    return result;
  }

  historicalGenderData(): HistoricalAggregateDataPoint[] {
    return this.historicalAggregateData(op => op.gender);
  }

  heightData(): HistogramDatum[] {
    return Object.values(this._operators).filter(op => op.height).map(op => {
      return { value: op.height };
    });
  }

  raceData(): AggregateData {
    return this.aggregateData(op => op.race);
  }

  factionData(): AggregateData {
    return this.aggregateData(op => op.faction);
  }
  
  historicalClassData(): HistoricalAggregateDataPoint[] {
    return this.historicalAggregateData(op => op.class);
  }

  classRarityData(): AggregateData2D {
    return this.aggregateData2D(op => op.class, op => op.rarity.toString());
  }

  historicalRarityData(): HistoricalAggregateDataPoint[] {
    return this.historicalAggregateData(op => op.rarity.toString());
  }

  rarityGenderData(): AggregateData2D {
    return this.aggregateData2D(op => op.rarity.toString(), op => op.gender);
  }

  classGenderData(): AggregateData2D {
    return this.aggregateData2D(op => op.class, op => op.gender);
  }

  historicalAggregateData(func: (op: Operator) => string): HistoricalAggregateDataPoint[] {
    let operators = this._sortedOperators;

    let result: HistoricalAggregateDataPoint[] = [{
      time: new Date(operators[0][this._region].released),
      data: { [func(operators[0])] : 1 }
    }];

    let lastReleased = operators[0][this._region].released;
    for (let idx = 1; idx < operators.length; ++idx) {
      if (operators[idx][this._region].released !== lastReleased) {
        result.push({
          time: new Date(operators[idx][this._region].released),
          data: { ...result[result.length - 1].data }
        });
        lastReleased = operators[idx][this._region].released;
      }
      let key = func(operators[idx]);
      if (key in result[result.length - 1].data) {
        result[result.length - 1].data[key] += 1;
      } else {
        result[result.length - 1].data[key] = 1;
      }
    }
    return result;
  }

  aggregateData(func: (op: Operator) => string): AggregateData {
    let result: AggregateData = {}
    Object.values(this._operators).forEach(op => {
      let key = func(op);
      if (key in result) {
        result[key]++;
      } else {
        result[key] = 1;
      }
    });
    return result;
  }

  aggregateData2D(func1: (op: Operator) => string, func2: (op: Operator) => string): AggregateData2D {
    let result: AggregateData2D = {};
    Object.values(this._operators).forEach(op => {
      let key1 = func1(op);
      if (! (key1 in result)) {
        result[key1] = {};
      }
      let key2 = func2(op);
      if (key2 in result[key1]) {
        result[key1][key2]++;
      } else {
        result[key1][key2] = 1;
      }
    });
    return result;
  }
}

const IMAGES: { [id: string]: { [id: string]: string } } = require('./images.json');

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

