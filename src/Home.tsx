import { useAKData } from './DataContext';

export function HomePage() {
  let akData = useAKData();

  return (
    <>
      <div className="section">
        <div className="level">
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Number of Operator</p>
              <p className="title"></p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Number of Banners</p>
              <p className="title">123</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">CN Delay for latest operator</p>
              <p className="title">123d</p>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h1 className="title">Overdue Operators</h1>
        <div className="columns">
          <div className="column">
            <table className="table">
              <thead>
                <th>Operator</th>
                <th>Days since Featured</th>
              </thead>
              <tbody>
                <tr>
                  <td>Kroos</td>
                  <td>150d</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="column">
            <table className="table">
              <thead>
                <th>Operator</th>
                <th>Days since Shop</th>
              </thead>
              <tbody>
                <tr>
                  <td>Kroos</td>
                  <td>150d</td>
                </tr>
              </tbody>
            </table>
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
