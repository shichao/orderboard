import { AlignmentType, Color, GroupOptions, OrderList } from '@src/components';
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
import { Alert, Card, Col, Nav, Navbar, Row } from 'react-bootstrap';
import { OrderStateActionType, reducer } from './orderState';

export type OrderBookProps = {
  market?: Market;
};

export const OrderBook = (props: OrderBookProps) => {
  const [state, dispatch] = React.useReducer(reducer, {
    market: props.market ?? Market.xbt,
  });
  //states
  const [socket, setSocket] = React.useState<WebSocket>();
  const [isSocketOpen, setIsSocketOpen] = React.useState<boolean>();
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [error, setError] = React.useState<string>();

  //effects
  React.useEffect(() => {
    //init
    let socket = new WebSocket(feedUrl);

    socket.onopen = (event) => {
      setIsSocketOpen(true);
    };
    socket.onmessage = onMessageReceived;
    socket.onclose = (event) => {
      //leave for further diagnostic use
      setIsSocketOpen(false);
    };
    socket.onerror = (event) => {
      console.log(event);
    };

    setSocket(socket);

    //dispose
    return () => {
      console.log('dispose');
    };
  }, []);

  React.useEffect(() => {
    if (isSocketOpen) {
      setIsLoading(true);
      socket.send(
        getSubscriptionMessage(state.market, SubscribeAction.subscribe)
      );
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
          //console.log(msg);
          break;
        case MessageType.warning:
        case MessageType.alert:
          console.log(msg);
          break;
        case MessageType.snapshot:
          let snapshot = msg as DataMessage;
          dispatch({ type: OrderStateActionType.init, payload: snapshot });
          setIsLoading(false);
          break;
        case MessageType.delta:
          let delta = msg as DataMessage;
          dispatch({ type: OrderStateActionType.update, payload: delta });
          break;
      }
    }
  };

  const groupChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      dispatch({ type: OrderStateActionType.group, payload: +e.target.value });
    }
  };

  const toggleFeed = () => {
    setIsLoading(true);
    if (socket && isSocketOpen) {
      socket.send(
        getSubscriptionMessage(state.market, SubscribeAction.unsubscribe)
      );
    }
    let newMarket = state.market === Market.xbt ? Market.eth : Market.xbt;
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
        <div className="d-flex flex-column h-100">
          <Navbar bg={'dark'} variant="dark">
            <Navbar.Brand>Order Book</Navbar.Brand>
            <Nav className="mr-auto" />
            <Nav>
              <GroupOptions
                value={state.group}
                groups={getMarketGroupingOptions(state.market)}
                onChange={groupChanged}
                disabled={isLoading}
              />
            </Nav>
          </Navbar>
          <div className="h-100 overflow-hidden bg-dark">
            <Row className="h-100">
              <Col className="p-0">
                <OrderList
                  alignment={AlignmentType.rightToLeft}
                  orders={state.asks}
                  group={state.group}
                  color={Color.Red}
                />
              </Col>
              <Col className="p-0">
                <OrderList
                  alignment={AlignmentType.leftToRight}
                  orders={state.bids}
                  group={state.group}
                  color={Color.Green}
                />
              </Col>
            </Row>
          </div>
          <Navbar bg={'dark'} variant="dark" className="justify-content-center">
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
                  getSubscriptionMessage(
                    state.market,
                    SubscribeAction.unsubscribe
                  )
                );
              }}
            >
              Kill Feed
            </button>
          </Navbar>
        </div>

        /*
        <Card
          bg="dark"
          text="white"
          style={{ height: 600 }}
          className="mb-2 w-100 overflow-hidden"
        >
          <Card.Header className="d-flex flex-row justify-content-between">
            <div className="p-2">Order Book</div>
            <div className="p-2">
              <GroupOptions
                value={state.group}
                groups={getMarketGroupingOptions(state.market)}
                onChange={groupChanged}
                disabled={isLoading}
              />
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <Row>
              <Col className="p-0">
                <OrderList
                  alignment={AlignmentType.rightToLeft}
                  orders={state.asks}
                  group={state.group}
                  color={Color.Red}
                />
              </Col>
              <Col className="p-0">
                <OrderList
                  alignment={AlignmentType.leftToRight}
                  orders={state.bids}
                  group={state.group}
                  color={Color.Green}
                />
              </Col>
            </Row>
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
                  getSubscriptionMessage(
                    state.market,
                    SubscribeAction.unsubscribe
                  )
                );
              }}
            >
              Kill Feed
            </button>
          </Card.Footer>
        </Card>*/
      )}
    </>
  );
};
