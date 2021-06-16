import * as React from 'react';

export enum AlignmentType {
  leftToRight = 0,
  rightToLeft = 1,
}

export type OrderListProps = {
  orders: number[][];
  alignment: AlignmentType;
  group: number;
};

//we have two decimal maximumly
const dedecimal = (value: number) => {
  return +(value * 100).toFixed(0);
};

const endecimal = (value: number) => {
  return +(value / 100).toFixed(2);
};

export const groupOrders = (orders: number[][], group: number): number[][] => {
  if (orders?.length > 1) {
    let result = [];
    let seed = [0, 0];

    orders.forEach((order, idx) => {
      //test if current order's price is multiple of group;
      let price_int = dedecimal(order[0]);
      let remainder = price_int % dedecimal(group);
      let groupLevel = endecimal(price_int - remainder);

      if (groupLevel < seed[0]) {
        if (seed[0] > 0 && seed[1] > 0) result.push(seed);
        seed = [groupLevel, order[1]];
      } else {
        seed[0] = groupLevel;
        seed[1] += order[1];
      }
    });
    if (seed[0] > 0 && seed[1] > 0) {
      result.push(seed);
      seed = [0, 0];
    }
    return result;
  }
  return orders;
};

export const OrderList = (props: OrderListProps) => {
  const getHeader = () => {
    return props.alignment === AlignmentType.leftToRight ? (
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
    if (props.orders?.length > 0) {
      return (
        <tbody>
          {groupOrders(props.orders, props.group).map((val, idx) =>
            props.alignment === AlignmentType.leftToRight ? (
              <tr key={idx}>
                <td className="text-right pr-5">{(sum += val[1])}</td>
                <td className="text-right pr-5">{val[1]}</td>
                <td className="text-right pr-5">{val[0].toFixed(2)}</td>
              </tr>
            ) : (
              <tr key={idx}>
                <td className="text-left pl-5">{val[0].toFixed(2)}</td>
                <td className="text-left pl-5">{val[1]}</td>
                <td className="text-left pl-5">{(sum += val[1])}</td>
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
      {props.orders?.length > 0 && (
        <table className="table table-dark float-end">
          {getHeader()}
          {getBody()}
        </table>
      )}
    </>
  );
};
