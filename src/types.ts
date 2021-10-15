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
  metadata: O;
  sessionId: string;
  actions: ActionNode[];
};

export type Tracker = {
  action(message: string, tag: string, metadata?: O): void;
  error(error: Error, tags: O): void;
  get(): ActionNode[];
  clear(): void;
};
