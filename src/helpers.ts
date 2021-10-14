import { Primitive } from './types';

type Fn = (...args: Primitive[]) => unknown;

// A debounce function delays a callback for a certain period of time
// When it is invoked again, it restarts it delay
export function debounce(func: Fn, delay: number): Fn {
  let _timer: number;

  return function (...args: Primitive[]): void {
    const _args = args;
    if (_timer) clearTimeout(_timer);
    _timer = window.setTimeout(() => func(..._args), delay);
  };
}

// A throttle function delays a callback for a certain period of time
// It will always execute the callback after the initial delay, but the used
// arguments are updated when it is invoked while waiting for the delay.
export function throttle(func: Fn, delay: number): Fn {
  let _timer: number;
  let _args: Primitive[];

  function execute(): void {
    func(..._args);
    _timer = 0;
  }

  return function (...args: Primitive[]): void {
    _args = args;
    if (!_timer) _timer = window.setTimeout(execute, delay);
  };
}
