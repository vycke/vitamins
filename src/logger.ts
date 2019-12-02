import { MetaDataType } from './types';

export default function logger(message: MetaDataType, tag = ''): void {
  if (process.env.NODE_ENV === 'development')
    console.log(
      `%c[${new Date().toLocaleTimeString()}] ${tag.toUpperCase()}:`,
      'color: fuchsia',
      message
    );
}
