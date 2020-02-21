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

// A function that determines the JavaScript memory size of data objects
export function memorySizeOf(obj) {
  let bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (const key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
        default:
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KiB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MiB';
    else return (bytes / 1073741824).toFixed(3) + ' GiB';
  }

  return formatByteSize(sizeOf(obj));
}
