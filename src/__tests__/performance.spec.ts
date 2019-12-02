import { debounce, throttle } from '../performance';

jest.useFakeTimers();

it('debounce', () => {
  const mockFn = jest.fn((x) => x);
  const fn = debounce(mockFn, 10);

  fn();
  expect(mockFn).not.toBeCalled();
  jest.advanceTimersByTime(10);
  expect(mockFn).toHaveBeenCalledTimes(1);
  fn();
  jest.advanceTimersByTime(5);
  fn(10);
  jest.advanceTimersByTime(5);
  expect(mockFn).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(5);
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toBeCalledWith(10);
});

it('test', () => {
  const mockFn = jest.fn((x) => x);
  const fn = throttle(mockFn, 10);

  fn();
  expect(mockFn).not.toBeCalled();
  jest.advanceTimersByTime(10);
  expect(mockFn).toHaveBeenCalledTimes(1);
  fn();
  jest.advanceTimersByTime(5);
  fn(10);
  jest.advanceTimersByTime(5);
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toBeCalledWith(10);
});
