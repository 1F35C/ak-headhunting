import React, { useState, useEffect } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import {
  getImage,
  Operator,
  AKData,
  Region,
  ReleaseInfo,
  HistoricalNumericDataPoint,
  PeriodicAggregateData,
  HistoricalAnnotatedNumericDataPoint,
  HistogramDatum,
  AggregateData,
  AggregateData2D,
  HistoricalAggregateDataPoint
} from './AKData';
import { daysSince } from './util';
import { useAKData } from './DataContext';

type AnyDict = { [id: string]: any }

type BannerParams = {
  globalReleaseDelayData: HistoricalAggregateDataPoint[]
  quarterlyOperatorReleaseData: PeriodicAggregateData[]
}
function transformPeriodicAggregateData(data: PeriodicAggregateData[]): AnyDict[] {
  return data.map(datum => {
    return {
      ...datum.data,
      period: datum.period
    }
  });
}

function Banner(params: BannerParams) {
  return (
   <div className="section">
      <div className="title">
        Operator Releases
      </div>
      <div className="columns">
        <div className="column is-full">
          <LineChart data={ params.globalReleaseDelayData } title="Operator Release Delay between China and Global" />
        </div>
      </div>
      <div className="columns">
        <div className="column is-full">
          <GroupedBarChart data={ transformPeriodicAggregateData(params.quarterlyOperatorReleaseData) }
                           groupLabel="period"
                           labels={ ['event', 'limited', 'standard'] }
                           title="Operator Releases" />
        </div>
      </div>
    </div>
  );
}

type BannerDurationChartParams = {
  debutBannerDurationData: HistoricalAnnotatedNumericDataPoint[],
  nonDebutBannerDurationData: HistoricalNumericDataPoint[]
}
function BannerDurationChart(params: BannerDurationChartParams) {
  let options = {
    title: {
      text: 'Banner Durations for Debut/Regular Banners'
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
        yName: 'Debut',
        labelKey: 'label',
        marker: { shape: 'circle', size: 8, stroke: '#f03a5f', fill: '#f03a5f' }
      },
      {
        data: params.nonDebutBannerDurationData,
        type: 'scatter',
        xKey: 'time',
        yName: 'Regular',
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
      text: 'Shop Debut Wait Time'
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
  operator: Operator,
  prediction: number
}

function shopOperatorStatus(releaseInfo: ReleaseInfo, prediction: number) {
  if (releaseInfo.shop.length === 0) {
    return (
      <>
      Expected<br />
      <strong>in { -daysSince(prediction) }d</strong>
      </>
    );
  } else if (releaseInfo.shop[0].start < Date.now() && Date.now() < releaseInfo.shop[0].end) {
    return (
      <>
      Currently Active
      </>
    );
  }
  return (
    <>
    Debuted<br />
    <strong>{ daysSince(releaseInfo.shop[0].start) }d ago</strong>
    </>
  ); 

}

function ShopOperatorCard(params:ShopOperatorCardParams) {
  let releaseInfo = params.operator.EN;
  let daysSinceRelease = daysSince(releaseInfo.released);
  let status = shopOperatorStatus(releaseInfo, params.prediction);
  return (
    <div className="card operator-card">
      <div className="card-image">
        <figure className="image is-1by1">
          <img src={ getImage('portraits', params.operator.name) }
               title={ params.operator.name }
               style={ { pointerEvents: 'none' } }
               alt="" />
        </figure>
      </div>
      <div className="card-content">
        <div className="title is-4">{ params.operator.name }</div>
        <p>
        Released<br />
        <strong>{ daysSinceRelease }d ago</strong>
        </p>
        { status }
        <p>
        </p>
      </div>
    </div>
  );
}

type DragGrab = {
  grabX: number,
  scrollX: number
}

type CertShopOperatorsParams = {
  operators: Operator[],
  predictions: number[]
}
function CertShopOperators(params: CertShopOperatorsParams) {
  let [dragGrab, setDragGrab] = useState<DragGrab | null>(null);

  let shopOperatorCardColumns = params.operators.map((op, idx) => {
    return (
      <div className="column" key={ op.name }>
        <ShopOperatorCard operator={ op } prediction={ params.predictions[idx] }/>
      </div>
    );
  });

  useEffect(() => {
    const container = document.getElementById("operator-card-container");
    if (!container) {
      throw new Error("Operator card container not found");
    }

    // Center container
    let scrollAmount = (container.scrollWidth - container.offsetWidth) / 2;
    container.scrollLeft = scrollAmount;

    (() => {
      // Use closure to keep the scope tight for these variable
      let dragGrab: DragGrab | null = null;
      const container = document.getElementById("operator-card-container");

      if (!container) {
        throw new Error('container could not be found');
      }

      const mouseMove = (ev: MouseEvent) => {
        if (dragGrab === null) {
          return false;
        }
        container.scrollLeft = dragGrab.scrollX - (ev.clientX - dragGrab.grabX);
        return false;
      };

      const mouseUp = (ev: MouseEvent) => {
        setDragGrab(null);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
      };

      const mouseDown = (ev: MouseEvent) => {
        dragGrab = {
          grabX: ev.clientX,
          scrollX: container.scrollLeft
        };
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
      };

      container.addEventListener('mousedown', mouseDown);
    })();
  }, []);
  

  return (
    <div id="operator-card-container">
      <div className="columns is-mobile">
        { shopOperatorCardColumns }
      </div>
    </div>
  );
}

type CertShopParams = BannerDurationChartParams & ShopDebutWaitChartParams;
function CertShop(params: CertShopParams) {
  let akData = useAKData();
  let [shopOperators, predictions] = akData.recentAndUpcomingShopOperators(Region.EN, 6, 6);
  
  return (
    <div className="section">
      <div className="title">
        Certficate Shop
      </div>
      <div className="block">
        <CertShopOperators operators={ shopOperators } predictions={ predictions } />
      </div>
      <div className="block">
        <div className="message is-info">
          <div className="message-header">
            Rationale
          </div>
          <div className="message-body">
            <div className="block rounded">
              <p>
                Since April 2021, a non-limited 6* operator, one that was never in the certificate shop before, makes a debut at a rate of once every 3 banners.
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

function transformAggregateDataForPie(data: AggregateData, sliceLimit: number = 12) {
  if (data.length === 0) {
    return [];
  }
  var slices = Object.keys(data)
      .map(key => { return { label: key, value: data[key] }})
      .sort((s1, s2) => { return s1.value < s2.value ? 1 : -1; });

  if (slices.length > sliceLimit) {
    let otherCount = slices.slice(sliceLimit).reduce((total, slice) => { return total + slice.value; }, 0);
    slices = slices.slice(0, sliceLimit).concat({ label: 'Other', value: otherCount });
  }
  return slices;
}

function transformAggregateDataForLineOption(dataPoints: HistoricalAggregateDataPoint[], yKeys: string[] = []) {
  let data = dataPoints.map(dp => { return { ...dp.data, time: dp.time }; });
  if (yKeys.length === 0) {
    yKeys = Object.keys(dataPoints[data.length - 1].data);
  }
  let series = yKeys.map(key => { return {xKey: 'time', yKey: key }; });
  let options: AnyDict = {
    data: data,
    series: series 
  };
  if (yKeys.length === 1) {
    options['legend'] = {enabled: false}
  }
  return options;
}

function transformAggregateData2DForBar(data: AggregateData2D, yKeys: string[] = []) {
  if (yKeys.length === 0) {
    let yKeySet = new Set<string>();
    Object.keys(data).forEach(key => {
      Object.keys(data[key]).forEach(subkey => {
        yKeySet.add(subkey);
      });
    });
    yKeys = Array.from(yKeySet);
  }

  let flattened = Object.keys(data).map(key => {
    let entry: { [id:string]: any } = {
      'key': key,
      ...data[key]
    };
    yKeys.forEach(yKey => {
      if (! (yKey in entry)) {
        entry[yKey] = 0;
      }
    });
    return entry;
  });

  return {
    data: flattened,
    series: [
      {
        type: 'column',
        xKey: 'key',
        yKeys: Array.from(yKeys)
      }
    ]
  };
}

function getLast(series: HistoricalAggregateDataPoint[]): AggregateData {
  if (series.length === 0) return {};
  return series[series.length - 1].data;
}

type PieChartParams = {
  data: AggregateData 
  title: string
}
function PieChart(params: PieChartParams) {
  let options = {
    title: {
      text: params.title
    },
    data: transformAggregateDataForPie(params.data),
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        innerRadiusOffset: -30
      }
    ]
  };

  return (
    <AgChartsReact options={ options } />
  );
}

type LineChartParams = {
  data: HistoricalAggregateDataPoint[]
  labels?: string[]
  title: string
}
function LineChart(params: LineChartParams) {
  let options = {
    ...transformAggregateDataForLineOption(params.data, params.labels),
    title: {
      text: params.title
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
    <AgChartsReact options={ options } />
  );
}

type StackedBarChartParams = {
  data: AggregateData2D
  labels: string[]
  title: string
};
function StackedBarChart(params: StackedBarChartParams) {
  let options = {
    ...transformAggregateData2DForBar(params.data, params.labels),
    title: {
      text: params.title
    }
  };

  return (
    <AgChartsReact options={ options } />
  );
}

type HistogramChartParams = {
  data: HistogramDatum[]
  title: string
  binCount?: number
}

type GroupedBarChartParams = {
  data: AnyDict[]
  groupLabel: string
  labels: string[]
  title: string
};

function GroupedBarChart(params: GroupedBarChartParams) {
  let options = {
    title: {
      text: params.title
    },
    data: params.data,
    series: [
      {
        type: 'column',
        xKey: params.groupLabel,
        yKeys: params.labels,
        grouped: true
      }
    ]
  };
  return (
    <AgChartsReact options={ options } />
  );
}

function HistogramChart(params: HistogramChartParams) {
  let options = {
    title: {
      text: params.title
    },
    data: params.data,
    series: [
      {
        type: 'histogram',
        xKey: 'value',
        binCount: params.binCount || 10
      }
    ],
    legend: { enabled: false }
  };
  return (
    <AgChartsReact options={ options } />
  );
}

type OperatorDemographyParams = {
  genderData: HistoricalAggregateDataPoint[],
  raceData: AggregateData,
  factionData: AggregateData,
  rarityData: HistoricalAggregateDataPoint[],
  classData: HistoricalAggregateDataPoint[],
  classRarityData: AggregateData2D,
  rarityGenderData: AggregateData2D,
  classGenderData: AggregateData2D,
  heightData: HistogramDatum[]
};
function OperatorDemography(params: OperatorDemographyParams) {

  return (
    <div className="section">
      <div className="title">
        Operator Demographics 
      </div>
      <div className="title is-4">Classification</div>
      <div className="columns is-desktop">
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <PieChart data={ getLast(params.rarityData) }
                      title="Rarity Distribution" />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <PieChart data={ getLast(params.classData) }
                      title="Class Distribution" />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <StackedBarChart data={ params.classRarityData }
                             labels={ ['1', '2', '3', '4', '5', '6'] }
                             title="Rarity Distribution by Class" />
          </div>
        </div>
      </div>
      <div className="columns is-desktop">
        <div className="column is-full-tablet is-half-desktop">
          <div className="box" style={{height: 500}}>
            <LineChart data={ params.rarityData }
                       labels={ ['1', '2', '3', '4', '5', '6'] }
                       title="Rarity Distribution over Time" />
          </div>
        </div>
        <div className="column is-full-tablet is-half-desktop">
          <div className="box" style={{height: 500}}>
            <LineChart data={ params.classData }
                       title="Class Distribution over Time" />
          </div>
        </div>
      </div>

      <div className="title is-4">Gender</div>

      <div className="columns is-desktop">
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <PieChart data={ getLast(params.genderData) }
                      title="Gender Distribution" />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <StackedBarChart data={ params.rarityGenderData }
                             labels={ ['Female', 'Male', 'Conviction'] }
                             title="Operator Genders by Rarity" />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <StackedBarChart data={ params.classGenderData }
                             labels={ ['Female', 'Male', 'Conviction'] }
                             title="Operator Genders by Rarity" />
          </div>
        </div>
      </div>
      <div className="columns is-desktop">
        <div className="column is-full-tablet is-full">
          <div className="box" style={{height: 500}}>
            <LineChart data={ params.genderData }
                       labels={ ['Female', 'Male', 'Conviction'] }
                       title="Gender Distribution Over Time" />
          </div>
        </div>
      </div>

      <div className="title is-4">Profile</div>

      <div className="columns is-desktop">
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <PieChart data={ params.factionData }
                      title="Faction Distribution" />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <PieChart data={ params.raceData }
                      title="Race Distribution" />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <HistogramChart data={ params.heightData }
                            title="Height Distribution" />
          </div>
        </div>
      </div>

    </div>
  );
}

export function AnalyticsPage() {
  let akData = useAKData();
  return (
    <>
    <CertShop debutBannerDurationData={ akData.debutBannerDuration(Region.EN) }
              nonDebutBannerDurationData={ akData.nonDebutBannerDuration(Region.EN) }
              certShop5StarDelayData={ akData.certificateShop5StarDelay(Region.EN) }
              certShop6StarDelayData={ akData.certificateShop6StarDelay(Region.EN) } />
    <Banner globalReleaseDelayData={ akData.releaseDelayData(Region.EN) }
            quarterlyOperatorReleaseData={ akData.quarterlyOperatorReleaseData(Region.EN) } />
    <OperatorDemography genderData={ akData.historicalGenderData(Region.EN) }
                        raceData={ akData.raceData() }
                        factionData={ akData.factionData() }
                        rarityData={ akData.historicalRarityData(Region.EN) }
                        classData={ akData.historicalClassData(Region.EN) }
                        classRarityData={ akData.classRarityData() }
                        rarityGenderData={ akData.rarityGenderData() }
                        classGenderData={ akData.classGenderData() }
                        heightData={ akData.heightData() } />
    </>
  );
}
