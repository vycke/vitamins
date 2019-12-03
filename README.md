# Vitamins - JavaScript error tracking libary

![](https://github.com/kevtiq/vitamins/workflows/test/badge.svg)
[![Node version](https://img.shields.io/npm/v/vitamins.svg?style=flat)](https://www.npmjs.com/package/vitamins)
[![NPM Downloads](https://img.shields.io/npm/dm/vitamins.svg?style=flat)](https://www.npmjs.com/package/vitamins)
[![Minified size](https://img.shields.io/bundlephobia/min/vitamins?label=minified)](https://www.npmjs.com/package/vitamins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Vitamins is a smalls dependency free front-end library for working on your application health. It core features logging of front-end errors (looking at you, JavaScript), and have some helper-functions that can improve your performance. The tracker aloows you to log any error you want in a consistent way. This makes it possible to analyze errors and solve issues in a better way.

## Error tracking

The tracker even logs all errors and unhandled `Promise` rejections, by listening to `window` events. However, to get a full picture, we need to have the context of the user. What were his/her actions? You can achieve this by creating a trail of breadcrumbs in your code. These are small pieces of information stored in the tracker. When an error is logged, the entire trail is attached to that error and stored in the log.

### Properties

You initiate tracker by providing a `config` object to the `createTracker` function. The configuration should have a `version` and `namespace` indication. After a tracker is initiated, it has the following properties at its disposal:

- `send(error: Error, tags: string[])`: sends a new error to the log;
- `crumb(message: string, category; string)`: adds a breadcrumb to the internal list. Whenever an error is logged, the list of breadcrumbs is added to the logs, as additional context;
- `clear()`: clears the current log and crumb lists;
- `trail`: gives back the current trail of breadcumbs. A trail can have a maximum of 20 breadcrumbs;
- `logs`: gives back the current list of logs.

When you are in development mode (`process.env.NODE_ENV === 'development'`), every invoke of the `crumb` and `send` properties are logged in the console.

### Example

```js
const tracker = createTracker({ version: '1.0', namespace: 'my-application' });

tracker.crumb('/home', 'Navigation');
console.log(tracker.trail); // [ { message: '/home', category: 'Navigation', timestamp: '...' } ]
const error = new Error('page does not exist');
tracker.send(error, ['UI', 'Navigation']);
console.log(tracker.trail); // [ ]
console.log(tracker.logs); // [ { error: error, breadcrumbs: [ { ... } ], ... } ]
```

### Sync with local storage

By default, the log will be stored in the local storage, using your defined `namespace` and `version`. When the application loads, the entire log is retrieved and put in the tracker. Only records of the last 48 hours are kept here. The moment your leave the application, the entire log is saved in the local storage.

## Performance

Performance is very important for your application, but more importantly, for your users. There exists many ways to improve the performance, but some helper functions can get you a long way. Vitamins comes with several of these functions.

### `debounce(func: Function, delay: number)` or `throttle(func: Function, delay: number)`

Sometimes you will find yourself in a situation where a partical function is being executed many times, but it is impacting performance. Take for instance live searching. On each change of the input in the searchbar, the results are updated. However, these results do not live in the front-end, but an API call has to be made. Or what do you thing about updating multiple canvas elements while dragging a different element. `Debounce` and `throttle` are here to save you. You can find a visualisation [here](http://demo.nimius.net/debounce_throttle/), and [here](https://css-tricks.com/debouncing-throttling-explained-examples/).

- `debounce`: the original function (`func`) is called after the caller has stopped calling the debounced function within a certain period of time (`delay`);
- `throttle`: the original function (`func`) be called at most once per specified period (`delay`).

## Hooking up the error tracker to your framework

Many of the errors you will encounter will be due to edge cases in your business logic. Ideally, your user does not get to see a screen with a big red error message. You want to show your own error page. However, catching all these errors can be a hassle. Many of the front-end frameworks do have a way to help you with this. Below you can see a React example, by creating an error boundary component that wraps your app.

```js
import React from 'react';
import { createTracker } from 'vitamins';

const tracker = createTracker({ ... });

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    tracker.log(error);
  }

  render() {
    if (this.state.hasError && this.props.errorPage)
      return this.props.errorPage;
    else if (this.state.hasError) return <h1>Something went wrong.</h1>;

    return this.props.children;
  }
}

export default ErrorBoundary;
``
```
