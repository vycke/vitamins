export type Primitive = boolean | number | string | object | symbol | undefined;

export type HashMap<T> = {
  [key: string]: T;
};

export type TrackerOptions = {
  namespace: string;
  version: string;
  numberOfCrumbsAttached?: number;
  maxLogSize?: number;
  maxErrorSize?: number;
  beforeUnload?: Function;
  onChange?: Function;
};

export type InitialNodes = {
  logs: LogNode[];
  errors: ErrorNode[];
};

export type LogNode = {
  tag: string;
  message: string;
  timestamp: string;
  sessionId?: string;
  metadata?: HashMap<Primitive>;
};

export type ErrorNode = {
  timestamp: string;
  error: Error;
  sessionId?: string;
  tags?: string[];
  environment?: HashMap<string>;
  crumbs?: LogNode[];
};

export type Storage = { errors: ErrorNode[]; logs: LogNode[] };

export type Tracker = {
  log(message: string, tag: string, metadata?: any): void;
  error(error: Error, tags?: string[]): void;
  clear(): void;
  get(): Storage;
};
