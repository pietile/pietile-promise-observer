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

export class PromiseObserver {
  static WARN_ON_ERROR = false;

  private subscription?: { callback?: Callback<any> };

  isSubscribed(): boolean {
    return !!this.subscription;
  }

  subscribe<T>(
    promise: Promise<T>,
    callback: Callback<T>,
    unsubscribedCallback?: Callback<T>
  ): Promise<T> {
    this.unsubscribe();

    const subscription = {
      callback,
    };

    const process = (result: PromiseResult<T>): boolean => {
      if (!subscription.callback) {
        if (unsubscribedCallback) {
          unsubscribedCallback(result);
        }

        return false;
      }

      const { callback: subscriptionCallback } = subscription;
      this.unsubscribe();

      subscriptionCallback(result);

      return true;
    };

    promise
      .then((value: T) => {
        process({ value, error: null });
      })
      .catch((error: Error) => {
        const subscribed = process({ value: null, error });

        if (!subscribed && PromiseObserver.WARN_ON_ERROR) {
          console.warn(error);
        }
      });

    this.subscription = subscription;

    return promise;
  }

  unsubscribe(): void {
    if (!this.subscription) {
      return;
    }

    this.subscription.callback = undefined;
    this.subscription = undefined;
  }
}
