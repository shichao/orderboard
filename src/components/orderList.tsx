import * as React from 'react';

export enum AlignmentType {
  leftToRight = 0,
  rightToLeft = 1,
}

export type OrderListProps = {
  orders: number[][];
  alignment: AlignmentType;
  groupBy: number;
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
          {props.orders.map((val, idx) =>
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
