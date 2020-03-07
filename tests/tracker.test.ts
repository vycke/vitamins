import createTracker from '../src/tracker';

const config = {
  version: '1.0',
  debug: false,
  namespace: 'test'
};

const actions = [
  {
    timestamp: '1970-01-01T00:00:00.000Z',
    message: 'test',
    tag: 'test'
  },
  {
    timestamp: new Date().toISOString(),
    message: 'test',
    tag: 'test'
  }
];

const errors = [
  {
    timestamp: '1970-01-01T00:00:00.000Z',
    error: {
      name: 'type_error',
      message: 'test error'
    },
    tags: ['UI']
  },
  {
    timestamp: new Date().toISOString(),
    error: {
      name: 'type_error',
      message: 'test error'
    },
    tags: ['UI']
  }
];

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

const mockFn = jest.fn((x) => x);

/**
 *
 * Actual beginning of the tests
 *
 */

it('using the initial-nodes and before-unload', () => {
  const tracker = createTracker(
    { ...config, beforeUnload: mockFn },
    { actions, errors }
  );

  expect(tracker.get().actions.length).toBe(2);
  expect(tracker.get().errors.length).toBe(2);

  expect(mockFn.mock.calls.length).toBe(0);
  window.dispatchEvent(new Event('beforeunload'));
  expect(mockFn.mock.calls.length).toBe(1);
});

it('onError callback option', () => {
  const tracker = createTracker({ ...config, onError: mockFn });
  expect(mockFn.mock.calls.length).toBe(1);
  tracker.error(new Error('test'), ['test']);
  expect(mockFn.mock.calls.length).toBe(2);
});

// window events handlers
describe('window events', () => {
  it('Throw error in window', () => {
    const tracker = createTracker(config);
    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('AAAHHHH'),
        message: 'A monkey is throwing bananas at me!',
        lineno: 402,
        colno: 1,
        filename: 'closet.html'
      })
    );
    expect(tracker.get().errors.length).toBe(1);
    expect(tracker.get().errors[0].error.message).toBe('AAAHHHH');
  });

  it('Throw error in window', () => {
    const tracker = createTracker(config);
    window.dispatchEvent(new Event('unhandledrejection'));
    expect(tracker.get().errors.length).toBe(1);
  });

  it('Unload without callback', () => {
    const tracker = createTracker(config);
    window.dispatchEvent(new Event('beforeunload'));
    expect(tracker.get().errors.length).toBe(0);
  });
});

describe('tracker configuration', () => {
  it('default max number of actions ', () => {
    const tracker = createTracker(config);
    for (let i = 0; i < 202; i++) {
      tracker.action(i.toString(), 'UI');
      if (i + 1 <= 200) expect(tracker.get().actions.length).toBe(i + 1);
      else expect(tracker.get().actions.length).toBe(200);
    }

    expect(tracker.get().actions[0].message).toBe('201');
  });

  it('default max number of errors', () => {
    const tracker = createTracker(config);
    for (let i = 0; i < 52; i++) {
      tracker.error(new Error(i.toString()));
      if (i + 1 <= 50) expect(tracker.get().errors.length).toBe(i + 1);
      else expect(tracker.get().errors.length).toBe(50);
    }
  });

  it('custom number of actions & errors', () => {
    const tracker = createTracker({
      ...config,
      maxNumberOfActions: 1,
      maxNumberOfErrors: 1
    });
    tracker.error(new Error('1'));
    tracker.error(new Error('2'));

    expect(tracker.get().actions.length).toBe(0);
    expect(tracker.get().errors.length).toBe(1);
  });
});

describe('tracker features', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  it('init', () => {
    expect(tracker.get().actions).toEqual([]);
    expect(tracker.get().errors).toEqual([]);
  });

  it('actions', () => {
    tracker.action('test log', 'UI');
    expect(tracker.get().actions.length).toBe(1);
    tracker.action('test log', 'Network', { test: 'test' });
    expect(tracker.get().actions.length).toBe(2);
  });

  it('error with no tags', () => {
    tracker.action('test crumb', 'UI');
    expect(tracker.get().actions.length).toBe(1);
    const error = new Error('test');
    tracker.error(error);
    expect(tracker.get().actions.length).toBe(1);
    expect(tracker.get().errors.length).toBe(1);
  });

  it('error with tags and crumbs', () => {
    tracker.action('test crumb', 'UI');
    expect(tracker.get().actions.length).toBe(1);
    const error = new Error('test');
    tracker.error(error, ['UI']);
    expect(tracker.get().actions.length).toBe(1);
    expect(tracker.get().errors.length).toBe(1);
    expect(tracker.get().errors[0].actions.length).toBe(1);
    expect(tracker.get().errors[0].tags.length).toBe(1);
  });

  it('error without tags and crumbs', () => {
    expect(tracker.get().actions.length).toBe(0);
    expect(tracker.get().errors.length).toBe(0);
    const error = new Error('test');
    tracker.error(error);
    expect(tracker.get().actions.length).toBe(0);
    expect(tracker.get().errors.length).toBe(1);
  });

  it('too many crumbs', () => {
    for (let i = 0; i < 202; i++) {
      tracker.action(i.toString(), 'UI');
      if (i + 1 <= 200) expect(tracker.get().actions.length).toBe(i + 1);
      else expect(tracker.get().actions.length).toBe(200);
    }

    expect(tracker.get().actions[0].message).toBe('201');
  });

  it('clear actions', () => {
    const error = new Error('test');
    tracker.error(error, ['UI']);
    expect(tracker.get().errors.length).toBe(1);
    tracker.clear();
    expect(tracker.get().errors.length).toBe(0);
  });
});

it('debug mode', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation();
  jest.resetModules(); // this is important - it clears the cache

  const myTracker = createTracker({ ...config, debug: true });
  expect(console.log).toHaveBeenCalledTimes(0);
  myTracker.action('test', 'test');
  expect(console.log).toHaveBeenCalledTimes(1);
  myTracker.error(new Error('test'));
  expect(console.log).toHaveBeenCalledTimes(2);
  spy.mockRestore();
});
