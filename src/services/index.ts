import * as entity from './entity';
export * from './entity';
export const feedUrl = 'wss://www.cryptofacilities.com/ws/v1';
export const feedName = 'book_ui_1';
export const feedSnapshotName = feedName + '_snapshot';

export const getMarketGroupingOptions = (market: entity.Market): number[] => {
  switch (market) {
    case entity.Market.eth:
      return [0.05, 0.1, 0.25];
    case entity.Market.xbt:
      return [0.5, 1, 2.5];
    default:
      throw 'unknown market';
  }
};

export const getSubscriptionMessage = (
  market: entity.Market,
  action: entity.SubscribeAction
): string => {
  return JSON.stringify({
    event: action,
    feed: feedName,
    product_ids: [market],
  });
};

export const parseMessage = (message: string): entity.IMessage => {
  let result = JSON.parse(message);
  if (result['event']) {
    return new entity.EventMessage(result['event'], result['product_ids']);
  } else if (result['feed'] === feedName) {
    //delta data
    return new entity.DataMessage(
      entity.MessageType.delta,
      result['product_id'],
      result['bids'],
      result['asks']
    );
  } else if (result['feed'] === feedSnapshotName) {
    //snapshot
    return new entity.DataMessage(
      entity.MessageType.snapshot,
      result['product_id'],
      result['bids'],
      result['asks']
    );
  }
};
