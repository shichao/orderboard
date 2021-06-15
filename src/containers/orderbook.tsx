import { GroupOptions } from '@src/components';
import { Market, getMarketGroupingOptions } from '@src/services';
import * as React from 'react';
import { Card } from 'react-bootstrap';

export type OrderBookProps = {
  market?: Market;
};

export const OrderBook = (props: OrderBookProps) => {
  //states
  const [market, setMarket] = React.useState<Market>(
    props.market ?? Market.xbt
  );
  const [group, setGroup] = React.useState<number>(
    getMarketGroupingOptions(market)[0]
  );

  //effects
  React.useEffect(() => {}, [market]);

  //methods
  const groupChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setGroup(+e.target.value);
    }
  };
  //render
  return (
    <Card
      bg="dark"
      text="white"
      style={{ width: '18rem' }}
      className="mb-2 w-100"
    >
      <Card.Header className="d-flex flex-row justify-content-between">
        <div className="p-2">Order Book</div>
        <div className="p-2">
          <GroupOptions
            value={group}
            groups={getMarketGroupingOptions(market)}
            onChange={groupChanged}
          />
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <table className="table table-dark">
          <thead className="text-secondary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-center mr-1">
        <button type="button" className="btn btn-info">
          Toggle Feed
        </button>
        <button type="button" className="btn btn-danger ml-1">
          Kill Feed
        </button>
      </Card.Footer>
    </Card>
  );
};
