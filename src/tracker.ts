import { LogNode, Tracker, ErrorNode, HashMap, TrackerOptions } from './types';
import logger from './logger';

// global constants
const TAGS = ['vitamins_logs', 'vitamins_errors'];
const DEFAULT_OPTIONS: HashMap<number> = {
  numberOfCrumbsAttached: 10,
  maxErrorSize: 50,
  maxLogSize: 200
};

function getEnvironment(options: TrackerOptions): HashMap<string> {
  return {
    agent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    version: options.version,
    namespace: options.namespace,
    location: window.location.href
  };
}

export default function tracker(options: TrackerOptions): Tracker {
  // configurations set once the tracker is initiated
  const _options: TrackerOptions = { ...DEFAULT_OPTIONS, ...options };
  let _logs: LogNode[] = JSON.parse(localStorage.getItem(TAGS[0]) || '[]');
  let _errors: ErrorNode[] = JSON.parse(localStorage.getItem(TAGS[1]) || '[]');

  // Listener to window events for storing the logs
  window.addEventListener('beforeunload', function() {
    _options.onUnload?.(_logs, _errors);
    localStorage.setItem(TAGS[0], JSON.stringify(_logs));
    localStorage.setItem(TAGS[1], JSON.stringify(_errors));
  });

  // Clears the logs and errors
  function clear(): void {
    _logs = [];
    _errors = [];
  }

  // function that creates a new log node
  function addLog(message: string, category: string, metadata?: any): void {
    const timestamp = new Date().toISOString();
    logger(category, message, metadata);
    if (_logs.length >= (_options.maxLogSize as number)) _logs.pop();
    _logs.unshift({ timestamp, message, category, metadata });
  }

  // function that creates a new error node
  function addError(error: Error, tags?: string[]): void {
    const node: ErrorNode = {
      timestamp: new Date().toISOString(),
      error,
      metadata: getEnvironment(_options),
      tags: tags || [],
      crumbs: _logs.slice(0, _options.numberOfCrumbsAttached)
    };

    if (_errors.length >= (_options.maxErrorSize as number)) _errors.pop();
    _errors.unshift(node);
    addLog(node.error.message, 'error', { error: node });
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
    log: addLog,
    clear,
    logs: (): LogNode[] => _logs,
    errors: (): ErrorNode[] => _errors
  };
}
