import { isAssertionExpression } from 'typescript';
import { getSubscriptionMessage } from '.';
import { Market, SubscribeAction } from './entity';

describe('Entity tests', () => {
  test('getSubscriptionMessage method works as expected', () => {
    let message = getSubscriptionMessage(Market.xbt, SubscribeAction.subscribe);
    let expected = JSON.stringify({
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: ['PI_XBTUSD'],
    });
    expect(message).toEqual(expected);
  });
});
