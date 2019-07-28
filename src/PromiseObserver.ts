export type PromiseResult<T> =
  | {
      value: null;
      error: Error;
    }
  | {
      value: T;
      error: null;
    };

export type Callback<T> = (result: PromiseResult<T>) => void;

export class PromiseObserver<T> {
  private subscription?: { callback?: Callback<T> };

  isSubscribed(): boolean {
    return !!this.subscription;
  }

  subscribe(promise: Promise<T>, callback: Callback<T>): void {
    this.unsubscribe();

    const subscription = {
      callback
    };

    promise
      .then((value: T) => {
        if (!subscription.callback) {
          return;
        }

        const { callback: subscriptionCallback } = subscription;
        this.unsubscribe();

        subscriptionCallback({ value, error: null });
      })
      .catch((error: Error) => {
        if (!subscription.callback) {
          return;
        }

        const { callback: subscriptionCallback } = subscription;
        this.unsubscribe();

        subscriptionCallback({ value: null, error });
      });

    this.subscription = subscription;
  }

  unsubscribe(): void {
    if (!this.subscription) {
      return;
    }

    this.subscription.callback = undefined;
    this.subscription = undefined;
  }
}
