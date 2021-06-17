import { Order, OrderSet } from '@src/services';
import * as React from 'react';

export enum AlignmentType {
  leftToRight = 0,
  rightToLeft = 1,
}
export enum Color {
  Red = 0,
  Green = 1,
}

export type OrderListProps = {
  orders: OrderSet;
  alignment: AlignmentType;
  group: number;
  color: Color;
};

//we have two decimal maximumly
const dedecimal = (value: number) => {
  return +(value * 100).toFixed(0);
};

const endecimal = (value: number) => {
  return +(value / 100).toFixed(2);
};

export const groupOrders = (orderSet: OrderSet, group: number): Order[] => {
  let result = [];
  let seed = [0, 0];
  let orders = Object.values(orderSet);

  orders
    .sort((a, b) => b.price - a.price)
    .forEach((order, idx) => {
      //test if current order's price is multiple of group;
      let price_int = dedecimal(order.price);
      let remainder = price_int % dedecimal(group);
      let groupLevel = endecimal(price_int - remainder);

      if (groupLevel < seed[0]) {
        if (seed[0] > 0 && seed[1] > 0) {
          result.push(new Order(seed[0], seed[1]));
        }
        seed = [groupLevel, order.size];
      } else {
        seed[0] = groupLevel;
        seed[1] += order.size;
      }
    });
  if (seed[0] > 0 && seed[1] > 0) {
    result.push(new Order(seed[0], seed[1]));
  }
  return result;
};

const getToRightBgSize = (size: number, total: number) => {
  let per = ((size / total) * 100).toFixed(2);
  return `${per}% 100%`;
};
const getToLeftBgSize = (size: number, total: number) => {
  let per = ((1 - size / total) * 100).toFixed(2);
  return `${per}% 100%`;
};

export const OrderList = (props: OrderListProps) => {
  const getHeader = () => {
    return props.alignment === AlignmentType.rightToLeft ? (
      <thead className="text-secondary">
        <tr>
          <th scope="col" className="text-right pr-5">
            TOTAL
          </th>
          <th scope="col" className="text-right pr-5">
            SIZE
          </th>
          <th scope="col" className="text-right pr-5">
            PRICE
          </th>
        </tr>
      </thead>
    ) : (
      <thead className="text-secondary">
        <tr>
          <th scope="col" className="text-left pl-5">
            PRICE
          </th>
          <th scope="col" className="text-left pl-5">
            SIZE
          </th>
          <th scope="col" className="text-left pl-5">
            TOTAL
          </th>
        </tr>
      </thead>
    );
  };

  const getBody = () => {
    let sum = 0;
    let rows = [];
    if (props.orders) {
      //get total
      let orders = groupOrders(props.orders, props.group);
      let total = orders.reduce(
        (p, c) => {
          p.size += c.size;
          return p;
        },
        { price: 0, size: 0 }
      );
      return (
        <tbody>
          {orders.map((order, idx, arr) =>
            props.alignment === AlignmentType.rightToLeft ? (
              <tr
                key={idx}
                className={
                  props.color === Color.Red ? 'redBarToLeft' : 'greenBarToLeft'
                }
                style={{
                  backgroundSize: getToLeftBgSize(sum + order.size, total.size),
                  backgroundColor:
                    props.color === Color.Red ? '#800000' : '#006600',
                }}
              >
                <td className="text-right pr-5">{(sum += order.size)}</td>
                <td className="text-right pr-5">{order.size}</td>
                <td className="text-right pr-5">{order.price.toFixed(2)}</td>
              </tr>
            ) : (
              <tr
                key={idx}
                className={
                  props.color === Color.Red
                    ? 'redBarToRight'
                    : 'greenBarToRight'
                }
                style={{
                  backgroundSize: getToRightBgSize(
                    sum + order.size,
                    total.size
                  ),
                }}
              >
                <td className="text-left pl-5">{order.price.toFixed(2)}</td>
                <td className="text-left pl-5">{order.size}</td>
                <td className="text-left pl-5">{(sum += order.size)}</td>
              </tr>
            )
          )}
        </tbody>
      );
    }
    return rows;
  };

  return (
    <>
      {props.orders && (
        <table className="table table-dark float-end">
          {getHeader()}
          {getBody()}
        </table>
      )}
    </>
  );
};
