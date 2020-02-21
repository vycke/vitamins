import createTracker from '../src/tracker';
import { createNode } from '../src/utils';
import { HttpError } from '../src/errors';

const config = {
  version: '1.0',
  namespace: 'test'
};

const testTrail = [
  {
    timestamp: '1970-01-01T00:00:00.000Z',
    message: 'test',
    category: 'test'
  },
  {
    timestamp: new Date().toISOString(),
    message: 'test',
    category: 'test'
  }
];

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
    localStorage.setItem('vitamins_test_errors', JSON.stringify(testLog));
    localStorage.setItem('vitamins_test_crumbs', JSON.stringify(testTrail));
    tracker = createTracker(config);
  });

  afterEach(() => {
    localStorage.removeItem('vitamins_test_errors');
    localStorage.removeItem('vitamins_test_crumbs');
  });

  it('init', () => {
    expect(tracker.crumbs.length).toBe(1);
    expect(tracker.errors.length).toBe(1);
  });
});

// window events handlers
describe('window events', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  afterEach(() => {
    localStorage.removeItem('vitamins_test_errors');
    localStorage.removeItem('vitamins_test_crumbs');
  });

  it('add error and unload', () => {
    const error = new Error('test');
    tracker.send(error);
    window.dispatchEvent(new Event('beforeunload'));
    expect(
      JSON.parse(localStorage.getItem('vitamins_test_errors') || '').length
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
    expect(tracker.errors.length).toBe(1);
  });

  it('Throw error in window', () => {
    window.dispatchEvent(new Event('unhandledrejection'));
    expect(tracker.errors.length).toBe(1);
  });
});

describe('tracker features', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  it('init', () => {
    expect(tracker.crumbs).toEqual([]);
    expect(tracker.errors).toEqual([]);
  });

  it('crumbs', () => {
    tracker.crumb('test crumb', 'UI');
    expect(tracker.crumbs.length).toBe(1);
    tracker.crumb('test crumb', 'Network', { test: 'test' });
    expect(tracker.crumbs.length).toBe(2);
  });

  it('error with no tags', () => {
    tracker.crumb('test crumb', 'UI');
    expect(tracker.crumbs.length).toBe(1);
    const error = new Error('test');
    tracker.send(error);
    expect(tracker.crumbs.length).toBe(1);
    expect(tracker.errors.length).toBe(1);
  });

  it('error with tags and crumbs', () => {
    tracker.crumb('test crumb', 'UI');
    expect(tracker.crumbs.length).toBe(1);
    const error = new HttpError('test', 404);
    tracker.send(error, ['UI']);
    expect(tracker.crumbs.length).toBe(1);
    expect(tracker.errors.length).toBe(1);
    expect(tracker.errors[0].breadcrumbs.length).toBe(1);
    expect(tracker.errors[0].tags.length).toBe(2);
  });

  it('error without tags and crumbs', () => {
    expect(tracker.crumbs.length).toBe(0);
    expect(tracker.errors.length).toBe(0);
    const error = new Error('test');
    tracker.send(error);
    expect(tracker.crumbs.length).toBe(0);
    expect(tracker.errors.length).toBe(1);
  });

  it('too many crumbs', () => {
    for (let i = 0; i < 502; i++) {
      tracker.crumb(i.toString(), 'UI');
      if (i + 1 <= 500) expect(tracker.crumbs.length).toBe(i + 1);
      else expect(tracker.crumbs.length).toBe(500);
    }

    expect(tracker.crumbs[0].message).toBe('501');
  });

  it('clear logs', () => {
    const error = new Error('test');
    tracker.send(error, ['UI']);
    expect(tracker.errors.length).toBe(1);
    tracker.clear();
    expect(tracker.errors.length).toBe(0);
  });

  it('create node', () => {
    const error = new Error('test');
    delete error.stack;
    expect(error.stack).toBe(undefined);
    const node = createNode(error, {});
    expect(node.error.stack).toBe(undefined);
  });
});
