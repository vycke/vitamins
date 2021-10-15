import createTracker from '../src/tracker';
import { Tracker } from '../src/types';

const mockFn = jest.fn((a) => a);
const meta = { type: 'test' };

const config = {
  version: '1.0',
  debug: false,
  namespace: 'test',
  onError: mockFn,
};

// add this interface
interface ErrorEventInit {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  error: Error;
  // ...put the properties here...
}

// edit this declare var's new signature
declare let ErrorEvent: {
  new (type: string, eventInitDict?: ErrorEventInit): ErrorEvent;
  prototype: ErrorEvent;
};
/**
 *
 * Actual beginning of the tests
 *
 */
it('onError callback option', () => {
  const tracker = createTracker(config);
  expect(mockFn.mock.calls.length).toBe(0);
  tracker.error(new Error('test'), meta);
  expect(mockFn.mock.calls.length).toBe(1);
});

// window events handlers
describe('window events', () => {
  it('Throw error in window', () => {
    createTracker(config);
    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('AAAHHHH'),
        message: 'A monkey is throwing bananas at me!',
        lineno: 402,
        colno: 1,
        filename: 'closet.html',
      })
    );
    expect(mockFn.mock.calls.length).toBe(3);
  });

  it('Throw error in window', () => {
    createTracker(config);
    window.dispatchEvent(new Event('unhandledrejection'));
    expect(mockFn.mock.calls.length).toBe(6);
  });

  it('Unload without callback', () => {
    createTracker(config);
    window.dispatchEvent(new Event('beforeunload'));
    expect(mockFn.mock.calls.length).toBe(6);
  });
});

describe('tracker features', () => {
  let tracker: Tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  it('init', () => {
    expect(tracker.get()).toEqual([]);
  });

  it('actions', () => {
    tracker.action('test log', 'UI');
    expect(tracker.get().length).toBe(1);
    tracker.action('test log', 'Network', { test: 'test' });
    expect(tracker.get().length).toBe(2);
  });

  it('error with no tags', () => {
    tracker.action('test crumb', 'UI');
    expect(tracker.get().length).toBe(1);
    const error = new Error('test');
    tracker.error(error, meta);
    expect(tracker.get().length).toBe(1);
  });

  it('error with tags crumbs and metadata', () => {
    tracker.action('test crumb', 'UI');
    expect(tracker.get().length).toBe(1);
    const error = new Error('test');
    tracker.error(error, meta);
    expect(tracker.get().length).toBe(1);
    tracker.error(error, meta);
    expect(mockFn.mock.calls.length).toBe(9);
  });

  it('error without tags and crumbs', () => {
    expect(mockFn.mock.calls.length).toBe(9);
    const error = new Error('test');
    tracker.error(error, meta);
    expect(mockFn.mock.calls.length).toBe(10);
  });
});

it('debug mode', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation();
  jest.resetModules(); // this is important - it clears the cache

  const myTracker = createTracker({ ...config, debug: true });
  expect(console.log).toHaveBeenCalledTimes(0);
  myTracker.action('test', 'test');
  expect(console.log).toHaveBeenCalledTimes(1);
  myTracker.error(new Error('test'), meta);
  expect(console.log).toHaveBeenCalledTimes(2);
  spy.mockRestore();
});
