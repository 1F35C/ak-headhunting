import { AgChartsReact } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import {
  getImage,
  AKData,
  Region,
  HistoricalNumericDataPoint,
  HistoricalAnnotatedNumericDataPoint,
  HistoricalAggregateDataPoint
} from './AKData';


type BannerDurationChartParams = {
  debutBannerDurationData: HistoricalAnnotatedNumericDataPoint[],
  nonDebutBannerDurationData: HistoricalNumericDataPoint[]
}
function BannerDurationChart(params: BannerDurationChartParams) {
  let options = {
    title: {
      text: 'Banners With New Operator in Shop'
    },
    subtitle: {
      text: 'y-axis: duration of banner in days'
    },
    series: [
      {
        data: params.debutBannerDurationData,
        type: 'scatter',
        xKey: 'time',
        yKey: 'value',
        yName: 'New',
        labelKey: 'label',
        marker: { shape: 'circle', size: 8, stroke: '#f03a5f', fill: '#f03a5f' }
      },
      {
        data: params.nonDebutBannerDurationData,
        type: 'scatter',
        xKey: 'time',
        yName: 'Old',
        yKey: 'value',
        marker: { shape: 'cross', stroke: '#3488ce', fill: '#3488ce' }
      }
    ],
    axes: [
      {
        type: 'time',
        position: 'bottom'
      },
      {
        type: 'number',
        position: 'left'
      }
    ]

  }
  return (
    <div className="rounded">
      <AgChartsReact options={options} />
    </div>
  );
}

type ShopDebutWaitChartParams = {
  certShop5StarDelayData: HistoricalNumericDataPoint[],
  certShop6StarDelayData: HistoricalNumericDataPoint[]
};

function ShopDebutWaitChart(params: ShopDebutWaitChartParams) {
  let options = {
    series: [
      {
        data: params.certShop6StarDelayData,
        xKey: 'time',
        yKey: 'value',
        yName: '6 Star'
      },
      {
        data: params.certShop5StarDelayData,
        xKey: 'time',
        yKey: 'value',
        yName: '5 Star'
      }
    ],
    title: {
      text: 'Days between Release and Certificate Shop Debut'
    },
    axes: [
      {
        type: 'time',
        position: 'bottom',
        tick: { count: agCharts.time.month.every(3) }
      },
      {
        type: 'number',
        position: 'left'
      }
    ]
  };
  return (
    <div className="rounded">
      <AgChartsReact options={ options } />
    </div>
  );
};

type ShopOperatorCardParams = {
  operator: string
}

function ShopOperatorCard(params:ShopOperatorCardParams) {
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-1by1">
          <img src={ getImage('portraits', params.operator) } title={ params.operator } />
        </figure>
      </div>
      <div className="card-content">
        <div className="title is-4">{ params.operator }</div>
        Released
        <div className="title is-5">{ 100 } days ago</div>
      </div>
    </div>
  );
}

type CertShopParams = BannerDurationChartParams & ShopDebutWaitChartParams;
function CertShop(params: CertShopParams) {
  let shopOperators = [
    "Mostima",
    "Blaze",
    "Aak",
    "Ceobe",
    "Bagpipe",
    "Phantom",
    "Weedy"
  ];
  let shopOperatorCardColumns = shopOperators.map((op) => {
    return (
      <div className="column">
        <ShopOperatorCard operator={ op } />
      </div>
    );
  });
  return (
    <div className="section">
      <div className="title">
        Certficate Shop
      </div>
      <div className="block">
        <div className="container">
          <div className="columns is-mobile">
            { shopOperatorCardColumns }
          </div>
        </div>
      </div>
      <div className="block">
        <div className="message is-info">
          <div className="message-header">
            Analysis 
          </div>
          <div className="message-body">
            <div className="block rounded">
              <p>
                Since April 2021, a non-limited 6* operator, that was never in the certificate shop before, makes a debut, at a rate of once every 3 banners.
              </p>
              <p>
                The operators debut happens sequentially, starting with the oldest non-debuted operator.
                Since a new 6* operator is released more often than once every 3 banners, the wait time for shop debut will continue to increase until this pattern changes.
              </p>
            </div>
            <div className="block columns is-desktop">
              <div className="column is-full-tablet is-half-desktop">
                <BannerDurationChart debutBannerDurationData={ params.debutBannerDurationData }
                                     nonDebutBannerDurationData={ params.nonDebutBannerDurationData } />
              </div>
              <div className="column is-full-tablet is-half-desktop">
                <ShopDebutWaitChart certShop5StarDelayData={ params.certShop5StarDelayData }
                                    certShop6StarDelayData={ params.certShop6StarDelayData } />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        TODO: Featured operator wait histogram<br />
        TODO: Shop operator wait histogram
      </div>
    </div>
  );
}

type OperatorDemographyParams = {
  genderData: HistoricalAggregateDataPoint[],
  raceData: HistoricalAggregateDataPoint[],
  factionData: HistoricalAggregateDataPoint[]
};

function transformAggregateDataForPie(data: HistoricalAggregateDataPoint[], sliceLimit: number = 12) {
  if (data.length === 0) {
    return [];
  }
  let latestDataPoint = data[data.length - 1];
  var slices = Object.keys(latestDataPoint.data)
      .map((key) => { return { label: key, value: latestDataPoint.data[key] }})
      .sort((s1, s2) => { return s1.value < s2.value ? 1 : -1; });

  if (slices.length > sliceLimit) {
    let otherCount = slices.slice(sliceLimit).reduce((total, slice) => { return total + slice.value; }, 0);
    slices = slices.slice(0, sliceLimit).concat({ label: 'Other', value: otherCount });
  }
  return slices;
}

function transformAggregateDataForLineOption(dataPoints: HistoricalAggregateDataPoint[]) {
  let data = dataPoints.map((dp) => { return { ...dp.data, time: dp.time }; });
  let series = Object.keys(dataPoints[data.length - 1].data).map((key) => { return {xKey: 'time', yKey: key }; });
  let result = {
    data: data,
    series: series 
  };
  return result;
}

function OperatorDemography(params: OperatorDemographyParams) {
  let genderPieData = transformAggregateDataForPie(params.genderData);
  let genderPieOptions = {
    title: {
      text: 'Gender Distribution'
    },
    data: genderPieData,
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        innerRadiusOffset: -30
      }
    ]
  };

  let racePieData = transformAggregateDataForPie(params.raceData);
  let racePieOptions = {
    title: {
      text: 'Race Distribution'
    },
    data: racePieData,
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        innerRadiusOffset: -30
      }
    ]
  };

  let factionPieData = transformAggregateDataForPie(params.factionData);
  let factionPieOptions = {
    title: {
      text: 'Faction Distribution'
    },
    data: factionPieData,
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        innerRadiusOffset: -30
      }
    ]
  };

  let genderLineOptions = {
    ...transformAggregateDataForLineOption(params.genderData),
    title: {
      text: 'Number of Operators by Gender'
    },
    axes: [
      {
        type: 'time',
        position: 'bottom',
        tick: { count: agCharts.time.month.every(3) }
      },
      {
        type: 'number',
        position: 'left'
      }
    ]
  };

  return (
    <div className="section">
      <div className="title">
        Demographics 
      </div>
      <div className="columns is-desktop">
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={genderPieOptions} />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={racePieOptions} />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={factionPieOptions} />
          </div>
        </div>
      </div>
      <div className="box" style={{height: 500}}>
        <AgChartsReact options={genderLineOptions} />
      </div>

    </div>
  );
}

type AnalyticsPageParams = {
  akdata: AKData
};
export function AnalyticsPage(params: AnalyticsPageParams) {
  return (
    <>
    <CertShop debutBannerDurationData={ params.akdata.debutBannerDuration(Region.EN) }
              nonDebutBannerDurationData={ params.akdata.nonDebutBannerDuration(Region.EN) }
              certShop5StarDelayData={ params.akdata.certificateShop5StarDelay() }
              certShop6StarDelayData={ params.akdata.certificateShop6StarDelay() } />
    <OperatorDemography genderData={ params.akdata.historicalGenderData() } raceData={ params.akdata.historicalRaceData() } factionData={ params.akdata.historicalFactionData() } />
    </>
  );
}
