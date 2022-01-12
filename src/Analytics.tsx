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
  HistoricalAnnotatedNumericDataPoint,
  AggregateData,
  AggregateData2D,
  HistoricalAggregateDataPoint
} from './AKData';
import { daysSince } from './util';
import { useAKData } from './DataContext';

function BannerWaitChart() {
  let akData = useAKData();
  return (
    <>
    6* banner featured interval
    </>
  );
}

function Banner() {
  return (
   <div className="section">
      <div className="title">
        Banner 
      </div>
      <div className="block">
        <BannerWaitChart />
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
  let [shopOperators, predictions] = akData.recentAndUpcomingShopOperators(10, 10, Region.EN);
  
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
            Analysis 
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

type OperatorDemographyParams = {
  genderData: HistoricalAggregateDataPoint[],
  raceData: AggregateData,
  factionData: AggregateData,
  rarityData: HistoricalAggregateDataPoint[],
  classData: HistoricalAggregateDataPoint[],
  rarityGenderData: AggregateData2D,
  classGenderData: AggregateData2D
};

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

function transformAggregateDataForLineOption(dataPoints: HistoricalAggregateDataPoint[]) {
  let data = dataPoints.map(dp => { return { ...dp.data, time: dp.time }; });
  let series = Object.keys(dataPoints[data.length - 1].data).map(key => { return {xKey: 'time', yKey: key }; });
  return {
    data: data,
    series: series 
  };
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

function OperatorDemography(params: OperatorDemographyParams) {
  let latestRarityData = params.rarityData[params.rarityData.length - 1].data;
  let rarityPieData = transformAggregateDataForPie(latestRarityData);
  let rarityPieOptions = {
    title: {
      text: 'Rarity Distribution'
    },
    data: rarityPieData,
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        innerRadiusOffset: -30
      }
    ]
  };


  let latestGenderData = params.genderData[params.genderData.length - 1].data;
  let genderPieData = transformAggregateDataForPie(latestGenderData);
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

  let latestClassData = params.classData[params.classData.length - 1].data;
  let classPieData = transformAggregateDataForPie(latestClassData);
  let classPieOptions = {
    title: {
      text: 'Class Distribution'
    },
    data: classPieData,
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        innerRadiusOffset: -30
      }
    ]

  };

  let rarityGenderBarChartOptions = {
    ...transformAggregateData2DForBar(params.rarityGenderData, ['Female', 'Male', 'Conviction']),
    title: {
      text: 'Operator Genders by Rarity'
    }
  };

  let classGenderBarChartOptions = {
    ...transformAggregateData2DForBar(params.classGenderData, ['Female', 'Male', 'Conviction']),
    title: {
      text: 'Operator Genders by Class'
    }
  };

  let rarityLineOptions = {
    ...transformAggregateDataForLineOption(params.rarityData),
    title: {
      text: 'Operators by Rarity over Time'
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

  let genderLineOptions = {
    ...transformAggregateDataForLineOption(params.genderData),
    title: {
      text: 'Operators by Gender over Time'
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

  let classLineOptions = {
    ...transformAggregateDataForLineOption(params.classData),
    title: {
      text: 'Operators by Class over Time'
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
        <div className="column is-full-tablet is-half-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ rarityPieOptions } />
          </div>
        </div>
        <div className="column is-full-tablet is-half-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ classPieOptions } />
          </div>
        </div>
      </div>
      <div className="columns is-desktop">
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ factionPieOptions } />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ racePieOptions } />
          </div>
        </div>
      </div>
      <div className="columns is-desktop">
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ genderPieOptions } />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ rarityGenderBarChartOptions } />
          </div>
        </div>
        <div className="column is-full-tablet is-one-third-desktop">
          <div className="box" style={{height: 500}}>
            <AgChartsReact options={ classGenderBarChartOptions } />
          </div>
        </div>
      </div>
      <div className="box" style={{height: 500}}>
        <AgChartsReact options={ rarityLineOptions } />
      </div>
      <div className="box" style={{height: 500}}>
        <AgChartsReact options={ genderLineOptions } />
      </div>
      <div className="box" style={{height: 500}}>
        <AgChartsReact options={ classLineOptions } />
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
    <Banner />
    <OperatorDemography genderData={ params.akdata.historicalGenderData() }
                        raceData={ params.akdata.raceData() }
                        factionData={ params.akdata.factionData() }
                        rarityData={ params.akdata.rarityData() }
                        classData={ params.akdata.classData() }
                        rarityGenderData={ params.akdata.rarityGenderData() }
                        classGenderData={ params.akdata.classGenderData() } />
    </>
  );
}
