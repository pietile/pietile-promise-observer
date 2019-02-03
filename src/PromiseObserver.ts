export type Callback<T> = (e: Error | null, value?: T) => void;

export class PromiseObserver<T> {
  private subscription?: { callback?: Callback<T> };

  isSubscribed() {
    return this.subscription !== undefined;
  }

  subscribe(promise: Promise<T>, callback: Callback<T>) {
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

        subscriptionCallback(null, value);
      })
      .catch((e: Error) => {
        if (!subscription.callback) {
          return;
        }

        const { callback: subscriptionCallback } = subscription;
        this.unsubscribe();

        subscriptionCallback(e);
      });

    this.subscription = subscription;
  }

  unsubscribe() {
    if (!this.subscription) {
      return;
    }

    this.subscription.callback = undefined;
    this.subscription = undefined;
  }
}
