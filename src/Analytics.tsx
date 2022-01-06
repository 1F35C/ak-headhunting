import { AgChartsReact } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import { AKData, HistoricalGenderDataPoint, HistoricalAggregateDataPoint } from './AKData';

type OperatorDemographyParams = {
  genderData: HistoricalGenderDataPoint[],
  raceData: HistoricalAggregateDataPoint[]
};

function transformHistoricalGenderPieData(data: HistoricalGenderDataPoint[]) {
  if (data.length === 0) {
    return [];
  }
  let latestDataPoint = data[data.length - 1];
  return [
      { label: 'Male', value: latestDataPoint.male },
      { label: 'Female', value: latestDataPoint.female },
      { label: 'Conviction', value: latestDataPoint.unknown }
  ];
}

function transformAggregateDataForPie(data: HistoricalAggregateDataPoint[]) {
  if (data.length === 0) {
    return [];
  }
  let latestDataPoint = data[data.length - 1];
  return Object.keys(latestDataPoint.data).map((key) => { return { label: key, value: latestDataPoint.data[key] }});
}

function OperatorDemography(params: OperatorDemographyParams) {
  console.log(params.raceData);
  let genderPieData = transformHistoricalGenderPieData(params.genderData);
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
        innerRadiusOffset: -50
      }
    ]
  };

  let historicalLineOptions = {
    title: {
      text: 'Number of Operators by Gender'
    },
    series: [
      {
        data: params.genderData,
        xKey: 'time',
        yKey: 'male',
      },
      {
        data: params.genderData,
        xKey: 'time',
        yKey: 'female',
      }
    ],
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
        innerRadiusOffset: -50
      }
    ]
  };

  return (
    <div className="section">
      <div className="title">
        Gender Distribution
      </div>
      <div className="columns">
        <div className="column is-half">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={genderPieOptions} />
          </div>
        </div>
        <div className="column is-half" style={{height: 500}}>
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={historicalLineOptions} />
          </div>
        </div>
      </div>
      <AgChartsReact options={racePieOptions} />
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
    <div className="section">
      <div className="title">
        Certificate shop debut delay graph
      </div>
    </div>
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
    <OperatorDemography genderData={ params.akdata.historicalGenderData() } raceData={ params.akdata.historicalRaceData() }/>
    </>
  );
}
