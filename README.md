# Promise Observer

[![npm version](https://badgen.net/bundlephobia/minzip/pietile-promise-observer)](https://bundlephobia.com/result?p=pietile-promise-observer@1.0.0@latest)

As Promise can't be canceled we can just unsubscribe from its result when don't need it.

## Usage example

```tsx
import { PromiseObserver } from "./PromiseObserver";

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

| name                                                  | description                         |
| :---------------------------------------------------- | :---------------------------------- |
| subscribe(promise: Promise<T>, callback: Callback<T>) | Subscribe to promise result         |
| unsubscribe()                                         | Unsubscribe from Promise            |
| isSubscribed()                                        | Is awaiting for any promise result? |

## License

Pietile Promise Observer is MIT License.
