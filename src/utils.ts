import { HashMap, MetaDataType, Environment, Node } from './types';

export function createNode(
  error: Error,
  metadata: HashMap<MetaDataType>,
  tags?: string[]
): Node {
  const errorNode = {
    message: error.message,
    name: error.name,
    stack: error.stack?.split('\r\n').filter((l) => l !== '')
  };

  return {
    timestamp: new Date().toISOString(),
    error: errorNode,
    metadata,
    ...(tags && { tags })
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
