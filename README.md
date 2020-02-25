# Vitamins - JavaScript system tracking libary

![](https://github.com/kevtiq/vitamins/workflows/test/badge.svg)
[![Node version](https://img.shields.io/npm/v/vitamins.svg?style=flat)](https://www.npmjs.com/package/vitamins)
[![NPM Downloads](https://img.shields.io/npm/dm/vitamins.svg?style=flat)](https://www.npmjs.com/package/vitamins)
[![Minified size](https://img.shields.io/bundlephobia/min/vitamins?label=minified)](https://www.npmjs.com/package/vitamins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Vitamins is a smalls dependency free front-end library that can help you take control over your application reliability and health. It core features are a uniform logger, a system tracker for logs and errors and some helper functions around performance Combined, they give you control to analyze and improve your front-end application.

## The system tracker

### Configuration

You create a system tracker object by using the `tracker` function for the package.

```js
import { tracker } from 'vitamins';
const myTracker = tracker(options, init?);
myTracker.log('my log message', 'test');
```

the `options` is an object that can have the following attributes. From these attributes, `namespace` and `version` are required.

- `namespace: string`: your application name. Will be attached to errors as `metadata`;
- `version: string`: your application version number. Will be attached to errors as `metadata`;
- `debug: boolean`: when this is `true`, every log is also printed to the `console.log` for easy debugging;
- `maxLogSize?: number`: the maximum number of log nodes stored in memory. Default is 200;
- `maxErrorSize?: number`: the maximum number of error nodes stored in memory. Default is 50;
- `numberOfCrumbsAttached?: number`: the number of log nodes attached to an error as a breadcrumb trail. default is 10;
- `beforeUnload(logs, errors)?: function`: a function that is executed right before `window.onbeforeunload` event is triggered;
- `onChange(logs, errors)?: function`: a function that is executed on every change in the logs and errors.

Optionally, you can provide initial logs and errors as well. This can be useful when you store them in the `localStorage` and you want to load them in memory on start. This is an object of the structure `{ logs, errors }`.

### Using the tracker

When initialized, the `tracker` function gives back an object with the following properties:

- `log(message: string, tag: string, metadata?: any)`: stores a new log node in memory;
- `error(error: Error, tags?: string[])`: creates and stores an error node in memory. A log node is created as well. Optionally, you can add an array of tags. Some example tags are: 'request', '404', '503' etc.;
- `clear()`: removes all logs and errors from memory;
- `get()`: gives back an object (`{ logs, errors }`) with all logs and errors currently in memory.

By default, the `tracker` function captures and logs all `error` and `unhandledrejection` events on `window` level.

### Data structures

A log node and error node have the following structures:

```ts
type LogNode = {
  tag: string;
  message: string;
  timestamp: string;
  sessionId?: string;
  metadata?: any;
};

type ErrorNode = {
  timestamp: string;
  error: Error;
  sessionId?: string;
  tags?: string[];
  environment?: any;
  crumbs?: LogNode[];
};
```

The `environment` of the `ErrorNode` holds the `namespace`, `version`, `user agent`, `platform`, `location`, and `language`.

### Integrating the tracker in your application

Many of the errors you will encounter will be due to edge cases in your business logic. Ideally, your user does not get to see a screen with a big red error message. You want to show your own error page. However, catching all these errors can be a hassle. Many of the front-end frameworks do have a way to help you with this. Below you can see a React example, by creating an error boundary component that wraps your app.

```js
import React from 'react';
import { tracker } from 'vitamins';

const myTracker = tracker({ ... });

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    myTracker.error(error);
  }

  render() {
    if (this.state.hasError && this.props.errorPage)
      return this.props.errorPage;
    else if (this.state.hasError) return <h1>Something went wrong.</h1>;

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Example usage

Some examples on how the system tracker can be used to measure the reliability of of your application;

- Capturing all errors with uniform tags (e.g. HTTP status code, was it a request, GraphQL query/mutation, etc). With the added metadata, you can analyse which errors occurs when, how often and how critical they are;
- Page navigation to gather usage statistics;
- Outgoing requests, including request name, and request size;
- Incoming responses, including request name, response size, and response time (use `performance.now()`);
- When data is retrieved from cache instead of sending a request (to measure the effectiveness of your cache);
- When critical core-features are used (e.g. session management is updated, your Pub/Sub is used, etc).

## Reliability helpers

Performance is very important for your application, but more importantly, for your users. There exists many ways to improve the performance, but some helper functions can get you a long way. Vitamins comes with several of these functions.

### debounce and throttle

Sometimes you will find yourself in a situation where a partical function is being executed many times, but it is impacting performance. Take for instance live searching. On each change of the input in the searchbar, the results are updated. However, these results do not live in the front-end, but an API call has to be made. Or what do you thing about updating multiple canvas elements while dragging a different element. `Debounce` and `throttle` are here to save you. You can find a visualisation [here](http://demo.nimius.net/debounce_throttle/), and [here](https://css-tricks.com/debouncing-throttling-explained-examples/).

- `debounce(func, delay)`: the original function (`func`) is called after the caller has stopped calling the debounced function within a certain period of time (`delay`);
- `throttle(func, delay)`: the original function (`func`) be called at most once per specified period (`delay`).

### Memory size

The `memorySizeOf()` function calculates the estimated size in bytes of variables and objects for keeping them in memory. It can take any type of value as input and calculates memory for `object`, `string`, `number`, `boolean`.
