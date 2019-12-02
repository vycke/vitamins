import { Arg } from './types';

// A debounce function delays a callback for a certain period of time
// When it is invoked again, it restarts it delay
export function debounce(cb: Function, wait: number): Function {
  let _timer: number;
  let _args: Arg[];

  function execute(): void {
    cb(..._args);
    _timer = 0;
  }

  return function(...args: Arg[]): void {
    _args = args;
    if (_timer) clearTimeout(_timer);
    _timer = window.setTimeout(execute, wait);
  };
}

// A throttle function delays a callback for a certain period of time
// It will always execute the callback after the initial delay, but the used
// arguments are updated when it is invoked while waiting for the delay.
export function throttle(cb: Function, wait: number): Function {
  let _timer: number;
  let _args: Arg[];

  function execute(): void {
    cb(..._args);
    _timer = 0;
  }

  return function(...args: Arg[]): void {
    _args = args;
    if (!_timer) _timer = window.setTimeout(execute, wait);
  };
}
