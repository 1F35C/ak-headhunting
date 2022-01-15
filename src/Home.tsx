import { useAKData } from './DataContext';

type OperatorDurationTable = {
  durationColumnTitle: string
}
function OperatorDurationTable(params: OperatorDurationTable) {
  return (
    <table className="table">
      <thead>
        <th>Operator</th>
        <th>{params.durationColumnTitle }</th>
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

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Operators on Record</p>
                <p className="title">321</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Banners on Record</p>
                <p className="title">123</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">CN Delay for latest operator</p>
                <p><h1 className="title">123d</h1></p>
                <p className="subtitle">(Ch'en the Holungday)</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Upcoming Birthday</p>
                <p><h1 className="title">Kroos</h1></p>
                <p className="subtitle">(December 07)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h1 className="title">Overdue Operators</h1>
        <div className="columns">
          <div className="column">
            <OperatorDurationTable durationColumnTitle="Days since Featured" />
          </div>
          <div className="column">
            <OperatorDurationTable durationColumnTitle="Days since Shop Apprearance" />
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
