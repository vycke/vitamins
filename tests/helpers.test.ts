import { debounce, throttle, memorySizeOf } from '../src/helpers';

jest.useFakeTimers();

const fakeObj = {
  key1: 'test',
  key2: true,
  key3: false,
  key4: 10
};

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

it('memorySizeOf', () => {
  expect(memorySizeOf('test')).toBe(8);
  expect(memorySizeOf(true)).toBe(4);
  expect(memorySizeOf(false)).toBe(4);
  expect(memorySizeOf(10)).toBe(8);
  expect(memorySizeOf(fakeObj)).toBe(24);
  expect(memorySizeOf(JSON.stringify(fakeObj))).toBe(100);
  expect(memorySizeOf([fakeObj, fakeObj])).toBe(48);
  expect(memorySizeOf(Symbol('test'))).toBe(0);
  expect(memorySizeOf(JSON.stringify([fakeObj, fakeObj]))).toBe(206);
});
