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
  gender: string;
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

export type HistoricalGenderDataPoint = {
  time: Date,
  male: number,
  female: number,
  unknown: number
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

  historicalGenderData(): HistoricalGenderDataPoint[] {
    let operators = Object.values(this._operators).sort((op1, op2) => {
      return op1.EN.released > op2.EN.released ? 1 : -1;
    });
    let result: HistoricalGenderDataPoint[] = [{
      time: new Date(operators[0].EN.released),
      male: (operators[0].gender === 'Male') ? 1 : 0,
      female: (operators[0].gender === 'Female') ? 1 : 0,
      unknown: (operators[0].gender !== 'Male' && operators[0].gender !== 'Female') ? 1 : 0
    }];
    let lastReleased = operators[0].EN.released;
    for (let idx = 1; idx < operators.length; ++idx) {
      if (operators[idx].EN.released !== lastReleased) {
        result.push({
          time: new Date(operators[idx].EN.released),
          male: result[result.length - 1].male,
          female: result[result.length - 1].female,
          unknown: result[result.length - 1].unknown,
        });
      }
      switch (operators[idx].gender) {
        case 'Male':
          result[result.length - 1].male += 1;
          break;
        case 'Female':
          result[result.length - 1].female += 1;
          break;
        default:
          result[result.length - 1].unknown += 1;
          console.log(operators[idx].name);
      }
      lastReleased = operators[idx].EN.released;
    }
    console.log(result);
    return result;
  }
}
