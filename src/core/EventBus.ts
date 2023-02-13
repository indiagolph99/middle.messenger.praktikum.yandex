export interface Listener<T extends unknown[] = unknown[]> {
  (...args: T): void;
}

export default class EventBus<
  E extends string = string,
  M extends { [K in E]: unknown[] } = Record<E, unknown[]>,
> {
  private listeners: { [key in E]?: Listener<M[key]>[] } = {};

  on<EventKey extends E>(event: EventKey, callback: Listener<M[EventKey]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    (this.listeners[event] as Listener<M[EventKey]>[])?.push(callback);
  }

  off(event: E, callback: Listener<M[E]>) {
    if (!this?.listeners[event]) {
      throw new Error(`No event: ${event}`);
    }

    this.listeners[event] = this.listeners[event]?.filter(
      (listener) => listener !== callback,
    );
  }

  emit<Event extends E = E>(event: Event, ...args: M[Event]) {
    if (!this?.listeners[event]) {
      throw new Error(`No event registered: ${event}`);
    }

    this.listeners[event]?.forEach((listener) => {
      listener(...args);
    });
  }
}
