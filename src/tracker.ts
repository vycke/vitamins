import {
  LogNode,
  Tracker,
  ErrorNode,
  HashMap,
  TrackerOptions,
  InitialNodes,
  Storage
} from './types';
import logger from './logger';

// Helper function used to create a unique sesson ID
function uuid(): string {
  return 'xxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

export default function tracker(
  options: TrackerOptions,
  initialNodes?: InitialNodes
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
  let _logs: LogNode[] = initialNodes?.logs || [];
  let _errors: ErrorNode[] = initialNodes?.errors || [];

  // Listener to window events for storing the logs
  window.addEventListener('beforeunload', function() {
    options.beforeUnload?.(_logs, _errors);
  });

  // Clears the logs and errors
  function clear(): void {
    _logs = [];
    _errors = [];
  }

  // function that creates a new log node
  function addLogNode(message: string, tag: string, metadata?: any): void {
    const timestamp = new Date().toISOString();
    logger(tag, message, metadata);
    if (_logs.length >= (options.maxLogSize || 200)) _logs.pop();
    _logs.unshift({ timestamp, message, tag, metadata, sessionId });
    options.onChange?.(_logs, _errors);
  }

  // function that creates a new error node
  function addErrorNode(error: Error, tags?: string[]): void {
    const node: ErrorNode = {
      timestamp: new Date().toISOString(),
      sessionId,
      error,
      tags: tags || [],
      environment: { ..._env, location: window.location.href },
      crumbs: _logs.slice(0, options.numberOfCrumbsAttached || 10)
    };

    if (_errors.length >= (options.maxErrorSize || 50)) _errors.pop();
    _errors.unshift(node);
    addLogNode(node.error.message, 'error', { error: node });
  }

  // Listeners to window events for capturation errors
  window.addEventListener('error', function(event) {
    addErrorNode(event.error, ['window']);
  });

  // Listeners to window events for capturation errors
  window.addEventListener('unhandledrejection', function(event) {
    const error = new Error(JSON.stringify(event.reason));
    addErrorNode(error, ['promise']);
  });

  return {
    error: addErrorNode,
    log: addLogNode,
    clear,
    get: (): Storage => ({ logs: _logs, errors: _errors })
  };
}
