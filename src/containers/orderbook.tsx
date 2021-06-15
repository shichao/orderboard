import { GroupOptions } from '@src/components';
import {
  Market,
  getMarketGroupingOptions,
  getSubscriptionMessage,
  SubscribeAction,
  feedUrl,
  parseMessage,
  MessageType,
  DataMessage,
} from '@src/services';
import * as React from 'react';
import { Alert, Card } from 'react-bootstrap';

export type OrderBookProps = {
  market?: Market;
};

export const OrderBook = (props: OrderBookProps) => {
  //states
  const [socket, setSocket] = React.useState<WebSocket>(new WebSocket(feedUrl));
  const [isSocketOpen, setIsSocketOpen] = React.useState<boolean>();
  const [market, setMarket] = React.useState<Market>(
    props.market ?? Market.xbt
  );
  const [group, setGroup] = React.useState<number>(
    getMarketGroupingOptions(market)[0]
  );
  const [snapshot, setSnapshot] = React.useState<DataMessage>();

  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [error, setError] = React.useState<string>();

  //effects
  React.useEffect(() => {
    //init
    socket.onopen = (event) => {
      setIsSocketOpen(true);
    };
    socket.onmessage = onMessageReceived;
    socket.onclose = (event) => {
      //leave for further diagnostic use
      setIsSocketOpen(false);
    };
    socket.onerror = (event) => {
      setError(`WebSocket error observed: ${JSON.stringify(event)}`);
    };

    //dispose
    return () => {
      console.log('dispose');
    };
  }, [socket]);

  React.useEffect(() => {
    if (isSocketOpen) {
      setIsLoading(true);
      socket.send(getSubscriptionMessage(market, SubscribeAction.subscribe));
    }
  }, [isSocketOpen]);

  //methods
  const onMessageReceived = (event: MessageEvent<any>) => {
    let msg = parseMessage(event.data);
    if (msg) {
      switch (msg.type) {
        case MessageType.info:
        case MessageType.subscribed:
        case MessageType.unsubscribed:
          console.log(msg);
          break;
        case MessageType.snapshot:
          setSnapshot(msg as DataMessage);
          setMarket((msg as DataMessage).product_id);
          setIsLoading(false);
          break;
        case MessageType.delta:
          break;
      }
    }
  };

  const groupChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setGroup(+e.target.value);
    }
  };

  const toggleFeed = () => {
    setIsLoading(true);
    if (socket && isSocketOpen) {
      socket.send(getSubscriptionMessage(market, SubscribeAction.unsubscribe));
    }
    let newMarket = market === Market.xbt ? Market.eth : Market.xbt;
    socket.send(getSubscriptionMessage(newMarket, SubscribeAction.subscribe));
  };

  const reboot = () => {
    setError(undefined);
    //some other logic to reset board
  };
  //render
  return (
    <>
      {error !== undefined && (
        <Alert variant="danger" onClose={reboot} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      {error === undefined && (
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
                disabled={isLoading}
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
            <button
              type="button"
              className="btn btn-info"
              onClick={toggleFeed}
              disabled={isLoading}
            >
              Toggle Feed
            </button>
            <button
              type="button"
              className="btn btn-danger ml-1"
              disabled={isLoading}
              onClick={() => {
                socket.send(
                  getSubscriptionMessage(market, SubscribeAction.subscribe)
                );
              }}
            >
              Add Feed
            </button>
            <button
              type="button"
              className="btn btn-danger ml-1"
              disabled={isLoading}
              onClick={() => {
                socket.send(
                  getSubscriptionMessage(market, SubscribeAction.unsubscribe)
                );
              }}
            >
              Kill Feed
            </button>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};
