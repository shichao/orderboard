import { isAssertionExpression } from 'typescript';
import { getSubscriptionMessage, parseMessage } from '.';
import {
  DataMessage,
  EventMessage,
  Market,
  MessageType,
  SubscribeAction,
} from './entity';

describe('Entity tests', () => {
  test('getSubscriptionMessage method works as expected', () => {
    let message = getSubscriptionMessage(Market.xbt, SubscribeAction.subscribe);
    let expected = JSON.stringify({
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: ['PI_XBTUSD'],
    });
    expect(message).toEqual(expected);
  });

  test('parseMessage method works as expected', () => {
    let info_str = JSON.stringify({ event: 'info', version: 1 });
    let subscribed_str = JSON.stringify({
      event: 'subscribed',
      feed: 'book_ui_1',
      product_ids: ['PI_ETHUSD'],
    });
    let unsubscribed_str = JSON.stringify({
      event: 'unsubscribed',
      feed: 'book_ui_1',
      product_ids: ['PI_ETHUSD'],
    });
    let snapshot_str = JSON.stringify({
      numLevels: 25,
      feed: 'book_ui_1_snapshot',
      bids: [
        [2559.7, 2825.0],
        [2559.4, 5514.0],
        [2559.05, 8036.0],
        [2559.0, 1000.0],
        [2558.8, 4361.0],
        [2558.75, 600.0],
        [2558.6, 250.0],
        [2558.55, 5302.0],
        [2558.4, 3494.0],
        [2558.35, 2347.0],
        [2558.2, 5810.0],
        [2558.1, 155972.0],
        [2557.9, 11129.0],
        [2557.85, 15059.0],
        [2557.75, 4995.0],
        [2557.55, 4082.0],
        [2557.4, 3955.0],
        [2557.35, 2500.0],
        [2557.3, 62.0],
        [2557.2, 4001.0],
        [2557.0, 22316.0],
        [2556.85, 4046.0],
        [2556.7, 6145.0],
        [2556.65, 3887.0],
        [2556.55, 5000.0],
      ],
      asks: [
        [2560.7, 600.0],
        [2560.75, 3885.0],
        [2560.85, 3875.0],
        [2561.0, 4236.0],
        [2561.1, 15745.0],
        [2561.15, 17989.0],
        [2561.2, 16200.0],
        [2561.25, 1105.0],
        [2561.3, 25089.0],
        [2561.35, 4097.0],
        [2561.45, 16634.0],
        [2561.55, 3930.0],
        [2561.65, 27099.0],
        [2561.7, 4995.0],
        [2561.75, 3080.0],
        [2561.9, 250.0],
        [2561.95, 250.0],
        [2562.0, 250.0],
        [2562.05, 6584.0],
        [2562.15, 140533.0],
        [2562.2, 2812.0],
        [2562.25, 250.0],
        [2562.3, 3143.0],
        [2562.35, 250.0],
        [2562.4, 6695.0],
      ],
      product_id: 'PI_ETHUSD',
    });
    let delta_str = JSON.stringify({
      feed: 'book_ui_1',
      product_id: 'PI_ETHUSD',
      bids: [],
      asks: [
        [2561.1, 15745.0],
        [2561.2, 16200.0],
      ],
    });

    let info_msg = parseMessage(info_str);
    expect(info_msg.type).toBe(MessageType.info);

    let subscribed_msg = parseMessage(subscribed_str);
    expect(subscribed_msg.type).toBe(MessageType.subscribed);
    expect((subscribed_msg as EventMessage).product_ids.length).toBe(1);
    expect((subscribed_msg as EventMessage).product_ids[0]).toBe(Market.eth);

    let unsubscribed_msg = parseMessage(unsubscribed_str);
    expect(unsubscribed_msg.type).toBe(MessageType.unsubscribed);
    expect((unsubscribed_msg as EventMessage).product_ids.length).toBe(1);
    expect((unsubscribed_msg as EventMessage).product_ids[0]).toBe(Market.eth);

    let snapshot_msg = parseMessage(snapshot_str);
    expect(snapshot_msg.type).toBe(MessageType.snapshot);
    expect((snapshot_msg as DataMessage).product_id).toEqual(Market.eth);
    expect((snapshot_msg as DataMessage).asks.length).toBe(25);
    expect((snapshot_msg as DataMessage).bids.length).toBe(25);

    let delta_msg = parseMessage(delta_str);
    expect(delta_msg.type).toBe(MessageType.delta);
    expect((delta_msg as DataMessage).product_id).toEqual(Market.eth);
    expect((delta_msg as DataMessage).asks.length).toBe(2);
    expect((delta_msg as DataMessage).bids.length).toBe(0);
  });
});
