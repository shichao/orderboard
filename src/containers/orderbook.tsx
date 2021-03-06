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
    initSocket();
  }, []);

  React.useEffect(() => {
    if (isSocketOpen) {
      setIsLoading(true);
      sendMessage(
        getSubscriptionMessage(state.market, SubscribeAction.subscribe)
      );
    }
  }, [isSocketOpen]);

  //methods
  const initSocket = () => {
    let socket = new WebSocket(feedUrl);

    socket.onopen = (event) => {
      setIsSocketOpen(true);
    };
    socket.onmessage = onMessageReceived;
    socket.onclose = (event) => {
      setIsSocketOpen(false);
    };
    socket.onerror = (event) => {
      console.log(event);
    };

    setSocket(socket);
  };
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
      sendMessage(
        getSubscriptionMessage(state.market, SubscribeAction.unsubscribe)
      );
    }
    let newMarket = state.market === Market.xbt ? Market.eth : Market.xbt;
    sendMessage(getSubscriptionMessage(newMarket, SubscribeAction.subscribe));
  };

  const reboot = () => {
    setError(undefined);
    //some other logic to reset board
    if (!isSocketOpen) {
      initSocket();
    }
  };

  const sendMessage = (message: string) => {
    try {
      socket.send(message);
    } catch (err) {
      console.log(err);
    }
  };

  const showError = () => {
    return error || !isSocketOpen;
  };
  //render
  return (
    <>
      {showError() && (
        <Alert variant="danger" onClose={reboot} dismissible>
          {!isSocketOpen && <p>Websocket is closed</p>}
        </Alert>
      )}
      {!showError() && (
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
                socket.close();
              }}
            >
              Kill Feed
            </button>
          </Navbar>
        </div>
      )}
    </>
  );
};
