export type MetaDataType = string | number | boolean;
export type HashMap<T> = {
  [key: string]: T;
};

export type ErrorNode = {
  name: string;
  message: string;
  stack?: string[];
};

export type BreadCrumb = {
  category: string;
  message: string;
  timestamp?: string;
};

export type TrackerConfig = {
  namespace: string;
  version: string;
};

export type Node = {
  timestamp: string;
  error: ErrorNode;
  tags?: string[];
  breadcrumbs?: BreadCrumb[];
  metadata?: HashMap<MetaDataType>;
};

export type Tracker = {
  crumb(message: string, category: string): void;
  send(error: Error, tags?: string[]): void;
  search(tags: string[]): Node[];
  clear(): void;
  logs: Node[];
  trail: BreadCrumb[];
};

export type Environment = {
  get(): HashMap<MetaDataType>;
};

export type Arg = any;
