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
  crumb(crumb: BreadCrumb): void;
  log(error: Error, tags?: string[]): void;
  search(tags: string[]): Node[];
  clear(): void;
  logs: Node[];
  crumbs: BreadCrumb[];
};

export type Environment = {
  get(): HashMap<MetaDataType>;
};

export type Arg = any;
