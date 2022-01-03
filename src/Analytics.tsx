import { AgChartsReact } from 'ag-charts-react';
import { AKData, HistoricalGenderDataPoint } from './AKData';

type GenderSectionParams = {
  historicalData: HistoricalGenderDataPoint[]
};

function transformHistoricalGenderPieData(data: HistoricalGenderDataPoint[]) {
  if (data.length === 0) {
    return [];
  }
  let latestDataPoint = data[data.length - 1];
  return [
      { label: 'Male', value: latestDataPoint.male },
      { label: 'Female', value: latestDataPoint.female },
      { label: 'N/A', value: latestDataPoint.unknown }
  ];
}

function GenderSection(params: GenderSectionParams) {
  let pieData = transformHistoricalGenderPieData(params.historicalData);
  let pieOptions = {
    data: pieData,
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
      <AgChartsReact options={pieOptions} />;
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
    <GenderSection historicalData={ params.akdata.historicalGenderData() }/>
    </>
  );
}
