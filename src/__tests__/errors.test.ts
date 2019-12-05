import {
  HttpError,
  ServerError,
  NetworkError,
  PermissionError,
  ValidationError
} from '../errors';

describe('Custom errors', () => {
  it('Http errors', () => {
    const http1 = new HttpError('Test', 404);
    expect(http1 instanceof HttpError).toBe(true);
    expect(http1.constructor.name).toBe('HttpError');
    expect(http1.status).toBe(404);

    const http2 = new HttpError('Test');
    expect(http2.status).toBe(undefined);
  });

  it('Server errors', () => {
    const server = new ServerError('Test');
    expect(server instanceof ServerError).toBe(true);
    expect(server instanceof HttpError).toBe(true);
    expect(server.constructor.name).toBe('ServerError');
    expect(server.status).toBe(503);
  });

  it('Network errors', () => {
    const server = new NetworkError('Test');
    expect(server instanceof NetworkError).toBe(true);
    expect(server instanceof HttpError).toBe(true);
    expect(server.constructor.name).toBe('NetworkError');
    expect(server.status).toBe(408);
  });

  it('Permission errors', () => {
    const server = new PermissionError('test');
    expect(server instanceof PermissionError).toBe(true);
    expect(server instanceof Error).toBe(true);
    expect(server.message).toBe('test');
    expect(server.constructor.name).toBe('PermissionError');
  });

  it('Validation errors', () => {
    const server = new ValidationError('test');
    expect(server instanceof ValidationError).toBe(true);
    expect(server instanceof Error).toBe(true);
    expect(server.message).toBe('test');
    expect(server.constructor.name).toBe('ValidationError');
  });
});
