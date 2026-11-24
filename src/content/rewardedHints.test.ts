import { expect, test } from 'bun:test';
import { REWARDED_HINTS } from './rewardedHints';

test('rewarded hints cover every room, including the control room', () => {
  expect(Object.keys(REWARDED_HINTS).map(Number)).toEqual(
    Array.from({ length: 15 }, (_, roomNumber) => roomNumber),
  );
});
