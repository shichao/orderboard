export enum Market {
  xbt = 'PI_XBTUSD',
  eth = 'PI_ETHUSD',
}

export enum SubscribeAction {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
}

export enum MessageType {
  info = 'info',
  subscribed = 'subscribed',
  unsubscribed = 'unsubscribed',
  snapshot = 'snapshot',
  delta = 'delta',
}

export interface IMessage {
  type: MessageType;
}

export class Order {
  price: number;
  size: number;

  constructor(price: number, size: number) {
    this.price = price;
    this.size = size;
  }
}

//key is price, value is size
export type OrderSet = {
  [key: number]: Order;
};

//{"event":"info","version":1}
//{"event":"subscribed","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}
//{"event":"unsubscribed","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}
export class EventMessage implements IMessage {
  type: MessageType;
  product_ids?: Market[];
  constructor(type: MessageType, product_ids?: Market[]) {
    this.product_ids = product_ids;
    this.type = type;
  }
}

//{"numLevels":25,"feed":"book_ui_1_snapshot","bids":[[2559.7,2825.0],[2559.4,5514.0],[2559.05,8036.0],[2559.0,1000.0],[2558.8,4361.0],[2558.75,600.0],[2558.6,250.0],[2558.55,5302.0],[2558.4,3494.0],[2558.35,2347.0],[2558.2,5810.0],[2558.1,155972.0],[2557.9,11129.0],[2557.85,15059.0],[2557.75,4995.0],[2557.55,4082.0],[2557.4,3955.0],[2557.35,2500.0],[2557.3,62.0],[2557.2,4001.0],[2557.0,22316.0],[2556.85,4046.0],[2556.7,6145.0],[2556.65,3887.0],[2556.55,5000.0]],"asks":[[2560.7,600.0],[2560.75,3885.0],[2560.85,3875.0],[2561.0,4236.0],[2561.1,15745.0],[2561.15,17989.0],[2561.2,16200.0],[2561.25,1105.0],[2561.3,25089.0],[2561.35,4097.0],[2561.45,16634.0],[2561.55,3930.0],[2561.65,27099.0],[2561.7,4995.0],[2561.75,3080.0],[2561.9,250.0],[2561.95,250.0],[2562.0,250.0],[2562.05,6584.0],[2562.15,140533.0],[2562.2,2812.0],[2562.25,250.0],[2562.3,3143.0],[2562.35,250.0],[2562.4,6695.0]],"product_id":"PI_ETHUSD"}
//
export class DataMessage implements IMessage {
  type: MessageType;
  product_id: Market;
  bids: OrderSet;
  asks: OrderSet;
  constructor(
    type: MessageType,
    product_id: Market,
    bids: OrderSet,
    asks: OrderSet
  ) {
    this.type = type;
    this.product_id = product_id;
    this.bids = bids;
    this.asks = asks;
  }
}
