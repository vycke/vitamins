export type MetaDataType = string | number | boolean | undefined;

export interface BaseError extends Error {
  status?: number;
  type?: string;
}

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
  timestamp: string;
  metadata?: HashMap<MetaDataType>;
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
  crumb(message: string, category: string, meta?: HashMap<MetaDataType>): void;
  send(error: Error, tags?: string[]): void;
  clear(): void;
  logs: Node[];
  trail: BreadCrumb[];
};

export type Environment = {
  get(): HashMap<MetaDataType>;
};

export type Arg = any;
