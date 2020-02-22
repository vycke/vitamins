import createTracker from '../src/tracker';

const config = {
  version: '1.0',
  namespace: 'test'
};

const testLogs = [
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

const testErrors = [
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
    localStorage.setItem('vitamins_errors', JSON.stringify(testErrors));
    localStorage.setItem('vitamins_logs', JSON.stringify(testLogs));
    tracker = createTracker(config);
  });

  afterEach(() => {
    localStorage.removeItem('vitamins_errors');
    localStorage.removeItem('vitamins_logs');
  });

  it('init', () => {
    expect(tracker.logs().length).toBe(2);
    expect(tracker.errors().length).toBe(2);
  });
});

// window events handlers
describe('window events', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  afterEach(() => {
    localStorage.removeItem('vitamins_errors');
    localStorage.removeItem('vitamins_logs');
  });

  it('add error and unload', () => {
    const error = new Error('test');
    tracker.error(error);
    window.dispatchEvent(new Event('beforeunload'));
    expect(
      JSON.parse(localStorage.getItem('vitamins_errors') || '').length
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
    expect(tracker.errors().length).toBe(1);
  });

  it('Throw error in window', () => {
    window.dispatchEvent(new Event('unhandledrejection'));
    expect(tracker.errors().length).toBe(1);
  });
});

describe('tracker features', () => {
  let tracker;
  beforeEach(() => {
    tracker = createTracker(config);
  });

  it('init', () => {
    expect(tracker.logs()).toEqual([]);
    expect(tracker.errors()).toEqual([]);
  });

  it('crumbs', () => {
    tracker.log('test crumb', 'UI');
    expect(tracker.logs().length).toBe(1);
    tracker.log('test crumb', 'Network', { test: 'test' });
    expect(tracker.logs().length).toBe(2);
  });

  it('error with no tags', () => {
    tracker.log('test crumb', 'UI');
    expect(tracker.logs().length).toBe(1);
    const error = new Error('test');
    tracker.error(error);
    expect(tracker.logs().length).toBe(2);
    expect(tracker.errors().length).toBe(1);
  });

  it('error with tags and crumbs', () => {
    tracker.log('test crumb', 'UI');
    expect(tracker.logs().length).toBe(1);
    const error = new Error('test');
    tracker.error(error, ['UI']);
    expect(tracker.logs().length).toBe(2);
    expect(tracker.errors().length).toBe(1);
    expect(tracker.errors()[0].crumbs.length).toBe(1);
    expect(tracker.errors()[0].tags.length).toBe(1);
  });

  it('error without tags and crumbs', () => {
    expect(tracker.logs().length).toBe(0);
    expect(tracker.errors().length).toBe(0);
    const error = new Error('test');
    tracker.error(error);
    expect(tracker.logs().length).toBe(1);
    expect(tracker.errors().length).toBe(1);
  });

  it('too many crumbs', () => {
    for (let i = 0; i < 202; i++) {
      tracker.log(i.toString(), 'UI');
      if (i + 1 <= 200) expect(tracker.logs().length).toBe(i + 1);
      else expect(tracker.logs().length).toBe(200);
    }

    expect(tracker.logs()[0].message).toBe('201');
  });

  it('clear logs', () => {
    const error = new Error('test');
    tracker.error(error, ['UI']);
    expect(tracker.errors().length).toBe(1);
    tracker.clear();
    expect(tracker.errors().length).toBe(0);
  });
});
