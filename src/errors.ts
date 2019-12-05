export class HttpError extends Error {
  // You have to extend Error, set the __proto__ to Error, and use
  // Object.setPrototypeOf in order to have a proper custom error type in JS.
  // Because JS/TS are dumb sometimes, and all three are needed to make this
  // work in all browsers.
  __proto__ = Error;
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServerError extends HttpError {
  __proto__ = Error;

  constructor(message: string) {
    super(message, 503);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends HttpError {
  __proto__ = Error;

  constructor(message: string) {
    super(message, 408);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PermissionError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
