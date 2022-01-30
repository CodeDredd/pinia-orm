import { isFunction } from '../support/Utils'

export type EventArgs<T> = T extends any[] ? T : never

export type EventListener<T, K extends keyof T> = (
  ...args: EventArgs<T[K]>
) => void

export type EventSubscriberArgs<T> = {
  [K in keyof T]: { event: K; args: EventArgs<T[K]> }
}[keyof T]

export type EventSubscriber<T> = (arg: EventSubscriberArgs<T>) => void

/**
 * Events class for listening to and emitting of events.
 *
 * @public
 */
export class Events<T> {
  /**
   * The registry for listeners.
   */
  protected listeners: { [K in keyof T]?: EventListener<T, K>[] }

  /**
   * The registry for subscribers.
   */
  protected subscribers: EventSubscriber<T>[]

  /**
   * Creates an Events instance.
   */
  constructor() {
    this.listeners = Object.create(null)
    this.subscribers = []
  }

  /**
   * Register a listener for a given event.
   *
   * @returns A function that, when called, will unregister the handler.
   */
  on<K extends keyof T>(event: K, callback: EventListener<T, K>): () => void {
    if (!event || !isFunction(callback)) {
      return () => {} // Non-blocking noop.
    }

    ;(this.listeners[event] = this.listeners[event]! || []).push(callback)

    return () => {
      if (callback) {
        this.off(event, callback)
        ;(callback as any) = null // Free up memory.
      }
    }
  }

  /**
   * Register a one-time listener for a given event.
   *
   * @returns A function that, when called, will self-execute and unregister
   *          the handler.
   */
  once<K extends keyof T>(
    event: K,
    callback: EventListener<T, K>
  ): EventListener<T, K> {
    const fn = (...args: EventArgs<T[K]>) => {
      this.off(event, fn)

      return callback(...args)
    }

    this.on(event, fn)

    return fn
  }

  /**
   * Unregister a listener for a given event.
   */
  off<K extends keyof T>(event: K, callback: EventListener<T, K>): void {
    const stack = this.listeners[event]

    if (!stack) {
      return
    }

    const i = stack.indexOf(callback)

    i > -1 && stack.splice(i, 1)

    stack.length === 0 && delete this.listeners[event]
  }

  /**
   * Register a handler for wildcard event subscriber.
   *
   * @returns A function that, when called, will unregister the handler.
   */
  subscribe(callback: EventSubscriber<T>): () => void {
    this.subscribers.push(callback)

    return () => {
      const i = this.subscribers.indexOf(callback)

      i > -1 && this.subscribers.splice(i, 1)
    }
  }

  /**
   * Call all handlers for a given event with the specified args(?).
   */
  emit<K extends keyof T>(event: K, ...args: EventArgs<T[K]>): void {
    const stack = this.listeners[event]

    if (stack) {
      stack.slice().forEach((listener) => listener(...args))
    }

    this.subscribers.slice().forEach((sub) => sub({ event, args }))
  }

  /**
   * Remove all listeners for a given event.
   */
  protected removeAllListeners<K extends keyof T>(event: K): void {
    event && this.listeners[event] && delete this.listeners[event]
  }
}
