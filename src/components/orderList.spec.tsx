import { groupOrders } from './orderList';

describe('OrderList test suit', () => {
  test('groupOrders works as expected', () => {
    let orders = [
      [2562.4, 1],
      [2562.35, 1],
      [2562.3, 1],
      [2562.25, 1],
      [2562.2, 1],
      [2562.15, 1],
      [2560.15, 1],
    ];

    let groupResult = groupOrders(orders, 0.05);
    expect(groupResult).toEqual(orders);

    groupResult = groupOrders(orders, 0.1);
    let expected = [
      [2562.4, 1],
      [2562.3, 2],
      [2562.2, 2],
      [2562.1, 1],
      [2560.1, 1],
    ];
    expect(groupResult).toEqual(expected);

    groupResult = groupOrders(orders, 0.25);
    expected = [
      [2562.25, 4],
      [2562, 2],
      [2560, 1],
    ];
    expect(groupResult).toEqual(expected);
  });
});
