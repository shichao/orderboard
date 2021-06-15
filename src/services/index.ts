import * as entity from './entity';

export * from './entity';

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
    feed: 'book_ui_1',
    product_ids: [market],
  });
};
