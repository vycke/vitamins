# Vitamins - JavaScript error tracking libary

![](https://github.com/kevtiq/vitamins/workflows/test/badge.svg)
[![Node version](https://img.shields.io/npm/v/vitamins.svg?style=flat)](https://www.npmjs.com/package/vitamins)
[![NPM Downloads](https://img.shields.io/npm/dm/vitamins.svg?style=flat)](https://www.npmjs.com/package/vitamins)
[![Minified size](https://img.shields.io/bundlephobia/min/vitamins?label=minified)](https://www.npmjs.com/package/vitamins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Vitamins is a smalls dependency free front-end library for working on your application health. It core features logging of front-end errors (looking at you, JavaScript), and have some helper-functions that can improve your performance.

## Error tracking

- Breadcrumbs
- Sync with localstorage
- Captures all errors and unhandled promise rejections

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
