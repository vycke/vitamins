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
  onUnload?: Function;
};

export type LogNode = {
  category: string;
  message: string;
  timestamp: string;
  metadata?: HashMap<Primitive>;
};

export type ErrorNode = {
  timestamp: string;
  error: Error;
  tags?: string[];
  crumbs?: LogNode[];
  metadata?: HashMap<Primitive>;
};

export type Tracker = {
  log(message: string, category: string, meta?: any): void;
  error(error: Error, tags?: string[]): void;
  clear(): void;
  errors(): ErrorNode[];
  logs(): LogNode[];
};
