import { Arg } from './types';

// A debounce function delays a callback for a certain period of time
// When it is invoked again, it restarts it delay
export function debounce(func: Function, delay: number): Function {
  let _timer: number;

  return function(...args: Arg[]): void {
    const _args = args;
    if (_timer) clearTimeout(_timer);
    _timer = window.setTimeout(() => func.apply(this, _args), delay);
  };
}

// A throttle function delays a callback for a certain period of time
// It will always execute the callback after the initial delay, but the used
// arguments are updated when it is invoked while waiting for the delay.
export function throttle(func: Function, delay: number): Function {
  let _timer: number;
  let _args: Arg[];

  function execute(): void {
    func(..._args);
    _timer = 0;
  }

  return function(...args: Arg[]): void {
    _args = args;
    if (!_timer) _timer = window.setTimeout(execute, delay);
  };
}

// export function memory();
