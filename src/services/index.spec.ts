import { parseOrderSet } from '.';

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
});
