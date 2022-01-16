import { Operator } from './AKData';
import { useAKData } from './DataContext';

type OperatorDuration = {
  op: Operator
  duration: number
}

type OperatorDurationTable = {
  durationColumnTitle: string
  data: OperatorDuration[]
}
function OperatorDurationTable(params: OperatorDurationTable) {
  let rows = params.data.map(od => {
    return (
      <tr>
        <td>{ od.op.name }</td>
        <td>{ od.duration }d</td>
      </tr>
    );
  });
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Operator</th>
          <th>{params.durationColumnTitle }</th>
        </tr>
      </thead>
      <tbody>
      { rows }
      </tbody>
    </table>
  );
}

export function HomePage() {
  let akData = useAKData();
  let latestOperator = akData.latestOperator();

  let featured6Star = akData.overdueFeatured(6).map(op => {
    return {
      op: op,
      duration: akData.lastFeatured(op)
    };
  });
  let shop6Star = akData.overdueShop(6).map(op => {
    return {
      op: op,
      duration: akData.lastInShop(op)
    };
  });
  let featured5Star = akData.overdueFeatured(5).map(op => {
    return {
      op: op,
      duration: akData.lastFeatured(op)
    };
  });
  let shop5Star = akData.overdueShop(5).map(op => {
    return {
      op: op,
      duration: akData.lastInShop(op)
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
                <p className="title">123d</p>
                <p />
                <p className="subtitle">({ latestOperator.name })</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h1 className="title">Upcoming Shop Debut</h1>
      </div>
      <div className="section">
        <h1 className="title">Overdue Operators</h1>
        <div className="columns is-desktop">
          <div className="column">
            <div className="box six-star-bordered">
              <h1 className="subtitle">6-Star</h1>
              <div className="columns is-desktop">
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Last Featured"
                                         data={ featured6Star } />
                </div>
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Last in Shop"
                                         data={ shop6Star } />
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="box five-star-bordered">
              <h1 className="subtitle">5-Star</h1>
              <div className="columns is-desktop">
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Last Featured"
                                         data={ featured5Star } />
                </div>
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Last in Shop"
                                         data={ shop5Star } />
                </div>
              </div>
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
