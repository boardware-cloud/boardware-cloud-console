export default class EventEmitter<E> {
  private events: Map<E, Array<(...args: any) => void>>;
  private onceEvents: Map<E, Array<(...args: any) => void>>;

  constructor() {
    this.events = new Map<E, Array<(...args: any) => void>>();
    this.onceEvents = new Map<E, Array<(...args: any) => void>>();
  }

  on(event: E, callback: (...args: any) => void): () => void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.push(callback);
    } else {
      this.events.set(event, Array<(...args: any) => void>(callback));
    }
    return (): void => {
      this.off(event, callback);
    };
  }

  once(event: E, callback: (...args: any) => void): () => void {
    const callbacks = this.onceEvents.get(event);
    if (callbacks) {
      callbacks.push(callback);
    } else {
      this.onceEvents.set(event, Array<(...args: any) => void>(callback));
    }
    return (): void => {
      this.off(event, callback);
    };
  }

  emit(event: E, ...args: any): void;
  emit(event: E): void;
  emit(event: E, ...args: any): void {
    const callbacks = this.events.get(event);
    callbacks?.forEach((f) => f(...args));
    let onceCallbacks = this.onceEvents.get(event);
    if (onceCallbacks) {
      onceCallbacks.forEach((f) => f(...args));
      this.onceEvents.delete(event);
    }
  }

  off(event: E, callback: (...args: any) => void) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(
        event,
        callbacks.filter((cb) => cb != callback)
      );
    }
    const onceEventCallbacks = this.onceEvents.get(event);
    if (onceEventCallbacks) {
      this.onceEvents.set(
        event,
        onceEventCallbacks.filter((cb) => cb != callback)
      );
    }
  }
}
