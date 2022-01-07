import { AgChartsReact } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AKData, HistoricalNumericDataPoint, HistoricalAggregateDataPoint } from './AKData';

type CertShopParams = {
  delayData: HistoricalNumericDataPoint[]
};

function CertShop(params: CertShopParams) {
  let certShopDelayOptions = {
    data: params.delayData,
    series: [
      {
        xKey: 'time',
        yKey: 'value'
      }
    ],
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
        Cert shop
      </div>
      <AgChartsReact options={certShopDelayOptions} />
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
  console.log(result);
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
    <div className="section">
      <div className="title">
        Certificate Shop Debut
      </div>
      Last: Ceobe (Release date, Debut date)<br />
      Next: Bagpipe (Release date)
    </div>
    <CertShop delayData={ params.akdata.certificateShopDelay() } />
    <div className="section">
      <div className="title">
        Operators that are overdue for certificate eshop
      </div>
    </div>
    <div className="section">
      <div className="title">
        Operators with Upcoming Skins
      </div>
    </div>
    <OperatorDemography genderData={ params.akdata.historicalGenderData() } raceData={ params.akdata.historicalRaceData() } factionData={ params.akdata.historicalFactionData() } />
    </>
  );
}
