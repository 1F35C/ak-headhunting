import { Operator } from './Types';
import { useAKData } from './DataContext';
import { CertShopOperators } from './Elements';
import { getOperatorImage } from './util';

type OperatorDuration = {
  op: Operator
  duration: number
}

type OperatorDurationTable = {
  durationColumnTitle: string
  data: OperatorDuration[]
  average: number
}
function OperatorDurationTable(params: OperatorDurationTable) {
  let max = params.data[0].duration;
  let rows = params.data.map(od => {
    return (
      <tr key={ od.op.name }>
        <td><span><img src={ getOperatorImage(od.op.name) } />{ od.op.name }</span></td>
        <td><span>{ od.duration }d<progress className="progress is-primary" value={ od.duration } max={ max }>{ od.duration }</progress></span></td>
      </tr>
    );
  });
  return (
    <table className="table is-fullwidth is-striped operator-table">
      <thead>
        <tr>
          <th>Operator</th>
          <th>{params.durationColumnTitle }</th>
        </tr>
      </thead>
      <tbody>
      { rows }
      <tr key="average">
        <td><span>AVERAGE</span></td>
        <td><span>{ params.average }d<progress className="progress" value={ params.average } max={ max }>{ params.average }</progress></span></td>
      </tr>
      </tbody>
    </table>
  );
}

export function HomePage() {
  let akData = useAKData();
  let latestOperator = akData.latestOperator();
  let [shopOperators, predictions] = akData.recentAndUpcomingShopOperators(0, 10);

  let featured6Star = akData.overdueFeatured(6).map(op => {
    return {
      op: op,
      duration: akData.featuredWait(op)
    };
  });
  let shop6Star = akData.overdueShop(6).map(op => {
    return {
      op: op,
      duration: akData.shopWait(op)
    };
  });
  let featured5Star = akData.overdueFeatured(5).map(op => {
    return {
      op: op,
      duration: akData.featuredWait(op)
    };
  });
  let shop5Star = akData.overdueShop(5).map(op => {
    return {
      op: op,
      duration: akData.shopWait(op)
    };
  });

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Operators on Record</p>
                <p className="title">{ Object.keys(akData.operators()).length }</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Banners on Record</p>
                <p className="title">{ akData.banners().length }</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Latest Operator Delay (vs. CN)</p>
                <p className="title is-spaced">123d</p>
                <p className="subtitle is-6">({ latestOperator.name })</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h1 className="title">Upcoming Shop Debut</h1>
        <CertShopOperators
            operators={ shopOperators }
            predictions={ predictions }
            focus="left" />
      </div>
      <div className="section">
        <h1 className="title">Overdue Operators</h1>
        <div className="box six-star-bordered">
          <h1 className="subtitle">6-Star</h1>
          <div className="columns">
            <div className="column">
              <OperatorDurationTable durationColumnTitle="Featured Banner Wait"
                                     data={ featured6Star }
                                     average={ akData.getFeaturedAverage(6) } />
            </div>
            <div className="column">
              <OperatorDurationTable durationColumnTitle="Shop Wait"
                                     data={ shop6Star }
                                     average={ akData.getShopAverage(6) } />
            </div>
          </div>
        </div>
        <div className="box five-star-bordered">
          <h1 className="subtitle">5-Star</h1>
          <div className="columns">
            <div className="column">
              <OperatorDurationTable durationColumnTitle="Featured Banner Wait"
                                     data={ featured5Star }
                                     average={ akData.getFeaturedAverage(5) } />
            </div>
            <div className="column">
              <OperatorDurationTable durationColumnTitle="Shop Wait"
                                     data={ shop5Star }
                                     average={ akData.getShopAverage(5) } />
            </div>
          </div>
        </div>
      </div>
      <div className="section">
      </div>
      <div className="section">
      </div>
    </>
  );
}
