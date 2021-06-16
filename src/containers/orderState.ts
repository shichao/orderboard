import {
  DataMessage,
  getMarketGroupingOptions,
  Market,
  OrderSet,
  updateOrderSet,
} from '@src/services';
import { Reducer, ReducerAction } from 'react';

export type OrderState = {
  market?: Market;
  group?: number;
  bids?: OrderSet;
  asks?: OrderSet;
};

export enum OrderStateActionType {
  init = 'init',
  group = 'group',
  update = 'update',
}

export type OrderStateAction =
  | {
      type: OrderStateActionType.init | OrderStateActionType.update;
      payload: DataMessage;
    }
  | {
      type: OrderStateActionType.group;
      payload: number;
    };

export const reducer: Reducer<OrderState, OrderStateAction> = (
  state: OrderState,
  action: OrderStateAction
) => {
  switch (action.type) {
    case OrderStateActionType.init:
      return {
        market: action.payload.product_id,
        group: getMarketGroupingOptions(action.payload.product_id)[0],
        asks: action.payload.asks,
        bids: action.payload.bids,
      };
    case OrderStateActionType.group:
      return { ...state, group: action.payload };
    case OrderStateActionType.update:
      if (state.market === action.payload.product_id) {
        return {
          ...state,
          asks: updateOrderSet(state.asks, action.payload.asks),
          bids: updateOrderSet(state.bids, action.payload.bids),
        };
      } else {
        return state;
      }
    default:
      throw Error();
  }
};
