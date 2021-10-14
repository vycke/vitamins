/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { debounce, throttle } from '../src/helpers';

jest.useFakeTimers();

it('debounce', () => {
  const mockFn = jest.fn((x) => x);
  const debounced = debounce(mockFn, 10);

  debounced();
  expect(mockFn).not.toBeCalled();
  jest.advanceTimersByTime(10);
  expect(mockFn).toHaveBeenCalledTimes(1);
  debounced();
  jest.advanceTimersByTime(5);
  debounced(10);
  jest.advanceTimersByTime(5);
  expect(mockFn).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(10);
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toBeCalledWith(10);
});

it('throttle', () => {
  const mockFn = jest.fn((x) => x);
  const throttled = throttle(mockFn, 10);

  throttled();
  expect(mockFn).not.toBeCalled();
  jest.advanceTimersByTime(10);
  expect(mockFn).toHaveBeenCalledTimes(1);
  throttled();
  jest.advanceTimersByTime(5);
  throttled(10);
  jest.advanceTimersByTime(5);
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toBeCalledWith(10);
});
