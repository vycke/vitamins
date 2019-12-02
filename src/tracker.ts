import { BreadCrumb, TrackerConfig, Tracker, Node } from './types';
import { environment, createNode, freeze } from './utils';

const MAX_NUM_BREADCRUMBS = 20;
const KEEP_ALIVE = 48;
const LOCAL_TAG = 'vitamins';

export default function createTracker(config: TrackerConfig): Tracker {
  // internal data
  const _tag = `${LOCAL_TAG}_${config.namespace}_${config.version}`;
  const _meta = environment(config);
  let _crumbs: BreadCrumb[] = [];
  // logs older than the keep alive period (in hours) are removed on load
  let _logs: Node[] = JSON.parse(localStorage.getItem(_tag) || '[]').filter(
    (l: Node) => {
      const today = new Date();
      today.setHours(today.getHours() - KEEP_ALIVE);
      return l.timestamp >= today.toISOString();
    }
  );

  // function to add a crumb to the internal list
  function addCrumb(crumb: BreadCrumb): void {
    if (_crumbs.length >= MAX_NUM_BREADCRUMBS) _crumbs.pop();
    const timestamp = new Date().toISOString();
    _crumbs.unshift({ timestamp, ...crumb });
  }

  // function to create a new node for the logs and add it to the logs
  function addNode(error: Error, tags?: string[]): void {
    const node: Node = createNode(error, _meta.get(), tags);

    if (_crumbs.length > 0) {
      node.breadcrumbs = _crumbs;
      _crumbs = [];
    }

    _logs.push(node);
  }

  // Listener to window events for storing the logs
  window.addEventListener('beforeunload', function() {
    localStorage.setItem(_tag, JSON.stringify(_logs));
  });

  // Listeners to window events for capturation errors
  window.addEventListener('error', function(event) {
    addNode(event.error, ['window']);
  });

  // Listeners to window events for capturation errors
  window.addEventListener('unhandledrejection', function(event) {
    const error = new Error(JSON.stringify(event.reason));
    addNode(error, ['promise']);
  });

  return {
    crumb: addCrumb,
    log: addNode,
    clear(): void {
      _logs = [];
    },
    get crumbs(): BreadCrumb[] {
      return _crumbs;
    },
    get logs(): Node[] {
      return freeze([..._logs]);
    },
    search(tags: string[]): Node[] {
      return _logs.filter((log: Node) =>
        log.tags?.some((t) => tags.includes(t))
      );
    }
  };
}
