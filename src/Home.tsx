import { useAKData } from './DataContext';

type OperatorDurationTable = {
  durationColumnTitle: string
}
function OperatorDurationTable(params: OperatorDurationTable) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Operator</th>
          <th>{params.durationColumnTitle }</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Kroos</td>
          <td>150d</td>
        </tr>
      </tbody>
    </table>
  );
}

export function HomePage() {
  let akData = useAKData();
  let latestOperator = akData.latestOperator();
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
        <h1 className="title">Overdue Operators</h1>
        <div className="columns is-desktop">
          <div className="column">
            <div className="box">
              <div className="columns is-desktop">
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Days since Featured" />
                </div>
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Days since Shop Apprearance" />
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <div className="columns is-desktop">
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Days since Featured" />
                </div>
                <div className="column is-half">
                  <OperatorDurationTable durationColumnTitle="Days since Shop Apprearance" />
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
