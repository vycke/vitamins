import {
  ActionNode,
  Tracker,
  ErrorNode,
  TrackerOptions,
  O,
  Primitive,
} from './types';

// Helper function used to create a unique sesson ID
function uuid(): string {
  return 'xxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

function logger(tag: string, ...messages: Primitive[]): void {
  console.log(
    `%c[${new Date().toLocaleTimeString()}] ${tag.toUpperCase()}:`,
    'color: fuchsia',
    ...messages.filter((m) => m !== undefined)
  );
}

export default function tracker(options: TrackerOptions): Tracker {
  // configurations set once the tracker is initiated
  const sessionId: string = uuid();
  // The actual data of the tracker
  let _actions: ActionNode[] = [];

  // function that creates a new action node
  function addAction(message: string, tag: string, metadata?: O): void {
    const timestamp = new Date().toISOString();
    if (options.debug) logger(tag, message, metadata);
    _actions.unshift({ timestamp, message, tag });
  }

  // function that creates a new error node
  function addError(error: Error, metadata: O): void {
    const node: ErrorNode = {
      timestamp: new Date().toISOString(),
      sessionId,
      error: { message: error.message, name: error.name, stack: error.stack },
      metadata: {
        ...metadata,
        location: window.location.href,
        agent: navigator.userAgent,
        language: navigator.language,
        version: options.version,
      },
      actions: _actions.slice(0, 10),
    };

    if (options.debug) logger('error', node);
    options.onError?.(node);
  }

  // Listeners to window events for capturation errors
  window.addEventListener('error', function (event) {
    addError(event.error, { type: 'window' });
  });

  // Listeners to window events for capturation errors
  window.addEventListener('unhandledrejection', function (event) {
    const error = new Error(JSON.stringify(event.reason));
    addError(error, { type: 'promise' });
  });

  return {
    error: addError,
    action: addAction,
    get: (): ActionNode[] => _actions,
    clear: () => (_actions = []),
  };
}
