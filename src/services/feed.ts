import { isInterfaceDeclaration } from 'typescript';
import { Market, Order } from './entity';

class Feed {
  private market: Market;
  private readonly socket: WebSocket;

  private bids: Order[];
  private asks: Order[];

  constructor(market: Market = Market.xbt) {
    this.market = market;
    this.socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1');
  }

  private init = (market) => {
    //1. setup websocket
  };
}
