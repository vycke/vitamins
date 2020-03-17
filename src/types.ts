export type Primitive = boolean | number | string | object | symbol | undefined;

export type HashMap<T> = {
  [key: string]: T;
};

type CallbackFunction = (errors: ErrorNode[], actions: ActionNode[]) => void;

export type TrackerOptions = {
  namespace: string;
  version: string;
  debug: boolean;
  numberOfActions?: number;
  onError?: CallbackFunction;
};

export type Logs = {
  actions: ActionNode[];
  errors: ErrorNode[];
};

export type ActionNode = {
  tag: string;
  message: string;
  timestamp: string;
  sessionId?: string;
  metadata?: HashMap<Primitive>;
};

export type ErrorNode = {
  timestamp: string;
  error: Error;
  tag: string;
  sessionId?: string;
  metadata?: HashMap<Primitive>;
  actions?: ActionNode[];
};

export type Tracker = {
  action(message: string, tag: string, metadata?: any): void;
  error(error: Error, tag: string, metadata?: any): void;
  clear(): void;
  get(): Logs;
};
