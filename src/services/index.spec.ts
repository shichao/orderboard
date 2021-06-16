import { parseOrderSet, updateOrderSet } from '.';

describe('Message parser tests', () => {
  test('parseOrderSet works as expected', () => {
    let orders = [
      [1, 1],
      [2, 2],
      [0.5, 10],
      [3, 3],
      [4, 4],
      [6, 6],
      [5, 15],
    ];
    let orderList = parseOrderSet(orders);

    expect(orderList).not.toBeNull();
    let expectedKeys = [0.5, 1, 2, 3, 4, 5, 6];
    expect(
      Object.keys(orderList)
        .sort()
        .map((i) => +i)
    ).toEqual(expectedKeys);
  });

  test('updateOrderSet works as expected', () => {
    let src_orders = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 15],
    ];
    let source = parseOrderSet(src_orders);

    let delta_orders = [
      [1, 10],
      [2, 0],
      [5, 1],
    ];
    let delta = parseOrderSet(delta_orders);

    let updated = updateOrderSet(source, delta);

    let prices = [1, 3, 4, 5];
    let sizes = [10, 3, 4, 1];
    expect(Object.keys(updated).map((v) => +v)).toEqual(prices);
    expect(Object.values(updated).map((v) => v.size)).toEqual(sizes);
  });

  test('updateOrderSet will not create new object if no delta', () => {
    let src_orders = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 15],
    ];
    let source = parseOrderSet(src_orders);
    let updated = updateOrderSet(source, undefined);
    expect(Object.is(source, updated)).toBe(true);
  });
});
