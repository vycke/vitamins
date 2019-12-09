export class HttpError extends Error {
  // You have to extend Error, set the __proto__ to Error, and use
  // Object.setPrototypeOf in order to have a proper custom error type in JS.
  // Because JS/TS are dumb sometimes, and all three are needed to make this
  // work in all browsers.
  __proto__ = Error;
  public status?: number;
  public type: string;

  constructor(message: string, status?: number, type = 'HttpError') {
    super(message);
    this.status = status;
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServerError extends HttpError {
  __proto__ = Error;

  constructor(message: string) {
    super(message, 503, 'ServerError');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends HttpError {
  __proto__ = Error;

  constructor(message: string) {
    super(message, 408, 'NetworkError');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PermissionError extends Error {
  __proto__ = Error;
  public type: string;

  constructor(message: string) {
    super(message);
    this.type = 'PermissionError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends Error {
  __proto__ = Error;
  public type: string;

  constructor(message: string) {
    super(message);
    this.type = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
