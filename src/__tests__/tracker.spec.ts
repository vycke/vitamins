import createTracker from '../tracker';
import { createNode } from '../utils';

const config = {
  version: '1.0',
  namespace: 'test'
};

const testLog = [
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

// Retrieving values from local storage
describe('sync with local storage', () => {
  let tracker;
  beforeEach(() => {
    localStorage.setItem('vitamins_test_1.0', JSON.stringify(testLog));
    tracker = createTracker(config);
  });

  afterEach(() => localStorage.removeItem('vitamins_test_1.0'));

  it('init', () => {
    expect(tracker.trail).toEqual([]);
    expect(tracker.logs.length).toBe(1);
  });
});

// window events handlers
describe('window events', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  afterEach(() => localStorage.removeItem('vitamins_test_1.0'));

  it('add error and unload', () => {
    const error = new Error('test');
    tracker.send(error);
    window.dispatchEvent(new Event('beforeunload'));
    expect(
      JSON.parse(localStorage.getItem('vitamins_test_1.0') || '').length
    ).toBe(1);
  });

  it('Throw error in window', () => {
    window.dispatchEvent(
      new ErrorEvent('error', {
        error: new Error('AAAHHHH'),
        message: 'A monkey is throwing bananas at me!',
        lineno: 402,
        colno: 1,
        filename: 'closet.html'
      })
    );
    expect(tracker.logs.length).toBe(1);
  });

  it('Throw error in window', () => {
    window.dispatchEvent(new Event('unhandledrejection'));
    expect(tracker.logs.length).toBe(1);
  });
});

describe('tracker features', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  it('init', () => {
    expect(tracker.trail).toEqual([]);
    expect(tracker.logs).toEqual([]);
  });

  it('crumbs', () => {
    tracker.crumb('test crumb', 'UI');
    expect(tracker.trail.length).toBe(1);
    tracker.crumb('test crumb', 'Network');
    expect(tracker.trail.length).toBe(2);
  });

  it('error with no tags', () => {
    tracker.crumb('test crumb', 'UI');
    expect(tracker.trail.length).toBe(1);
    const error = new Error('test');
    tracker.send(error);
    expect(tracker.trail.length).toBe(0);
    expect(tracker.logs.length).toBe(1);
  });

  it('error with tags and crumbs', () => {
    tracker.crumb('test crumb', 'UI');
    expect(tracker.trail.length).toBe(1);
    const error = new Error('test');
    tracker.send(error, ['UI']);
    expect(tracker.trail.length).toBe(0);
    expect(tracker.logs.length).toBe(1);
    expect(tracker.search(['Network']).length).toBe(0);
    expect(tracker.search(['UI']).length).toBe(1);
    expect(tracker.logs[0].breadcrumbs.length).toBe(1);
    tracker.send(error, ['Network']);
    expect(tracker.search(['UI']).length).toBe(1);
    expect(tracker.search(['UI', 'Network']).length).toBe(2);
  });

  it('error without tags and crumbs', () => {
    expect(tracker.trail.length).toBe(0);
    expect(tracker.logs.length).toBe(0);
    const error = new Error('test');
    tracker.send(error);
    expect(tracker.trail.length).toBe(0);
    expect(tracker.logs.length).toBe(1);
    expect(tracker.search(['UI']).length).toBe(0);
  });

  it('too many crumbs', () => {
    for (let i = 0; i < 30; i++) {
      tracker.crumb(i.toString(), 'UI');
      if (i + 1 <= 20) expect(tracker.trail.length).toBe(i + 1);
      else expect(tracker.trail.length).toBe(20);
    }

    expect(tracker.trail[0].message).toBe('29');
  });

  it('clear logs', () => {
    const error = new Error('test');
    tracker.send(error, ['UI']);
    expect(tracker.logs.length).toBe(1);
    tracker.clear();
    expect(tracker.logs.length).toBe(0);
  });

  it('create node', () => {
    const error = new Error('test');
    delete error.stack;
    expect(error.stack).toBe(undefined);
    const node = createNode(error, {});
    expect(node.error.stack).toBe(undefined);
  });
});
