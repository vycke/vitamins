import {
  HashMap,
  MetaDataType,
  Environment,
  Node,
  BaseError,
  ErrorNode
} from './types';

export function createNode(
  error: BaseError,
  metadata: HashMap<MetaDataType>,
  tags?: string[]
): Node {
  const errorNode: ErrorNode = {
    message: error.message,
    name: error.type || error.name,
    stack: error.stack?.split('\r\n').filter((l) => l !== '')
  };

  const newTags = tags || [];
  if (error.status) newTags.push(error.status.toString());

  return {
    timestamp: new Date().toISOString(),
    error: errorNode,
    metadata,
    tags: newTags
  };
}

export function environment(config: HashMap<MetaDataType>): Environment {
  const _meta: HashMap<MetaDataType> = {
    agent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    version: config.version,
    namespace: config.namespace
  };

  return {
    get(): HashMap<MetaDataType> {
      return { ..._meta, location: window.location.href };
    }
  };
}

// Helper to freeze nested objects, making them immutable
export function freeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(
    (prop) => !Object.isFrozen(obj[prop]) && freeze<object>(obj[prop])
  );

  return obj;
}
