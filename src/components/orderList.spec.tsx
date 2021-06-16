import { OrderSet } from '@src/services';
import { groupOrders } from './orderList';

describe('OrderList test suit', () => {
  test('groupOrders works as expected', () => {
    let orders: OrderSet = {
      2562.4: { price: 2562.4, size: 1 },
      2562.35: { price: 2562.35, size: 1 },
      2562.3: { price: 2562.3, size: 1 },
      2562.25: { price: 2562.25, size: 1 },
      2562.2: { price: 2562.2, size: 1 },
      2562.15: { price: 2562.15, size: 1 },
      2560.15: { price: 2560.15, size: 1 },
    };

    let groupResult = groupOrders(orders, 0.05);
    expect(groupResult).toEqual(Object.values(orders));

    groupResult = groupOrders(orders, 0.1);
    let expected = [
      { price: 2562.4, size: 1 },
      { price: 2562.3, size: 2 },
      { price: 2562.2, size: 2 },
      { price: 2562.1, size: 1 },
      { price: 2560.1, size: 1 },
    ];
    expect(groupResult).toEqual(expected);

    groupResult = groupOrders(orders, 0.25);
    expected = [
      { price: 2562.25, size: 4 },
      { price: 2562, size: 2 },
      { price: 2560, size: 1 },
    ];
    expect(groupResult).toEqual(expected);
  });
});
