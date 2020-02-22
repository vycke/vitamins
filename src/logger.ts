import { Primitive } from './types';

export default function logger(tag = '', ...messages: Primitive[]): void {
  if (process.env.NODE_ENV === 'development')
    console.log(
      `%c[${new Date().toLocaleTimeString()}] ${tag.toUpperCase()}:`,
      'color: fuchsia',
      ...messages.filter((m) => m !== undefined)
    );
}
