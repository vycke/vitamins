import {
  ActionNode,
  Tracker,
  ErrorNode,
  HashMap,
  TrackerOptions,
  Logs,
  Primitive
} from './types';

// Helper function used to create a unique sesson ID
function uuid(): string {
  return 'xxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

function logger(tag, ...messages: Primitive[]): void {
  console.log(
    `%c[${new Date().toLocaleTimeString()}] ${tag.toUpperCase()}:`,
    'color: fuchsia',
    ...messages.filter((m) => m !== undefined)
  );
}

export default function tracker(
  options: TrackerOptions,
  initialNodes?: Logs
): Tracker {
  // configurations set once the tracker is initiated
  const sessionId: string = uuid();
  const _env: HashMap<string> = {
    agent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    version: options.version,
    namespace: options.namespace
  };

  // The actual data of the tracker
  let _actions: ActionNode[] = initialNodes?.actions || [];
  let _errors: ErrorNode[] = initialNodes?.errors || [];

  // Listener to window events for storing the logs
  window.addEventListener('beforeunload', function() {
    options.beforeUnload?.(_errors, _actions);
  });

  // Clears the logs and errors
  function clear(): void {
    _actions = [];
    _errors = [];
  }

  // function that creates a new action node
  function addAction(message: string, tag: string, metadata?: any): void {
    const timestamp = new Date().toISOString();
    if (options.debug) logger(tag, message, metadata);
    if (_actions.length >= (options.maxNumberOfActions || 200)) _actions.pop();
    _actions.unshift({ timestamp, message, tag, metadata, sessionId });
  }

  // function that creates a new error node
  function addError(error: Error, tags?: string[]): void {
    const node: ErrorNode = {
      timestamp: new Date().toISOString(),
      sessionId,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      },
      tags: tags || [],
      environment: { ..._env, location: window.location.href },
      actions: _actions.slice(0, 10)
    };

    if (_errors.length >= (options.maxNumberOfErrors || 50)) _errors.pop();
    _errors.unshift(node);
    options.onError?.(_errors, _actions);
    if (options.debug) logger('error', node);
  }

  // Listeners to window events for capturation errors
  window.addEventListener('error', function(event) {
    addError(event.error, ['window']);
  });

  // Listeners to window events for capturation errors
  window.addEventListener('unhandledrejection', function(event) {
    const error = new Error(JSON.stringify(event.reason));
    addError(error, ['promise']);
  });

  return {
    error: addError,
    action: addAction,
    clear,
    get: (): Logs => ({ actions: _actions, errors: _errors })
  };
}
