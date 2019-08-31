# Pietile Promise Observer

[![npm version](https://badgen.net/npm/v/pietile-promise-observer?color=56C838)](https://www.npmjs.com/package/pietile-promise-observer)
[![install size](https://badgen.net/packagephobia/install/pietile-promise-observer)](https://packagephobia.now.sh/result?p=pietile-promise-observer)

As Promise can't be canceled we can just unsubscribe from its result when don't need it.

## Installation

Using yarn

```sh
yarn add pietile-promise-observer
```

or using npm

```sh
npm install -S pietile-promise-observer
```

## Usage example

```tsx
import { PromiseObserver, PromiseResult } from "./PromiseObserver";

function asyncAction(): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random());
    }, 1000);
  });
}

function resultHandler(result: PromiseResult<number>): void {
  if (result.error) {
    // Smth wrong happened
    console.log("Error :(", result.error.message);
    return;
  }

  console.log(result.value + 1);
}

const promiseObserver = new PromiseObserver<number>();

promiseObserver.subscribe(asyncAction(), resultHandler);

// Somehwere later ...

promiseObserver.subscribe(asyncAction(), resultHandler);
// or
promiseObserver.unsubscribe();
```

## API

### `new PromiseObserver<T>()`

Create new PromiseObserver for Promises of result `T`.

### `subscribe(promise: Promise<T>, callback: Callback<T>): void`

Subscribe to `promise`. After the `promise` is resolved the `callback` will be called with either
`{ value: null; error: Error; }` or `{ value: T; error: null; }` argument.

### `unsubscribe(): void`

Unsubscribe from subscribed Promise

### `isSubscribed(): boolean`

Is observer awaiting for any promise result?

### `PromiseObserver.WARN_ON_ERROR`

Static property. When true will warn in console on each rejection. Useful for debugging

## License

Pietile Promise Observer is MIT License.
