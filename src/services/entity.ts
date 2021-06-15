export type Order = {
  price: number;
  size: number;
};

export type Message = {
  bids: Order[]; //seller orders
  asks: Order[]; //buyer orders
};
export enum Market {
  xbt = 'PI_XBTUSD',
  eth = 'PI_ETHUSD',
}

export enum SubscribeAction {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
}
