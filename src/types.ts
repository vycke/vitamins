export type O = Record<string, unknown>;
export type Primitive = boolean | number | string | O | symbol | undefined;

export type TrackerOptions = {
  namespace: string;
  version: string;
  debug: boolean;
  onError?: (error: ErrorNode) => void;
};

export type ActionNode = {
  tag: string;
  message: string;
  timestamp: string;
};

export type ErrorNode = {
  timestamp: string;
  error: Error;
  tag: string;
  sessionId: string;
  actions: ActionNode[];
  agent: string;
  vendor: string;
  language: string;
  version: string;
  location: string;
};

export type Tracker = {
  action(message: string, tag: string, metadata?: O): void;
  error(error: Error, tag: string): void;
  get(): ActionNode[];
};
