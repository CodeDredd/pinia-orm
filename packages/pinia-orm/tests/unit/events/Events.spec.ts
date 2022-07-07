import { describe, expect, it, vi } from 'vitest'

import { Events } from '../../../src/events/Events'

describe('unit/events/Events', () => {
  interface TEvents {
    test: [boolean]
    trial: []
  }

  it('can register event listeners', () => {
    const events = new Events<TEvents>()

    const spy = vi.fn()

    events.on('test', spy)

    expect(events.listeners).toHaveProperty('test')
    expect(events.listeners.test).toHaveLength(1)
    expect(events.listeners.test).toEqual([spy])
  })

  it('can ignore empty event names', () => {
    const events = new Events<TEvents>()

    ;[0, '', null, undefined].forEach((e) => {
      events.on(e as any, () => {})
    })

    expect(events.listeners).toEqual({})
  })

  it('can ignore non-function handlers', () => {
    const events = new Events<TEvents>()

    ;[0, '', null, undefined].forEach((e) => {
      const cb = events.on('test', e as any)
      cb()
    })

    expect(events.listeners).toEqual({})
  })

  it('can emit events', () => {
    const events = new Events<TEvents>()

    const spy = vi.fn()

    events.on('test', spy)
    events.emit('test', true)

    events.off('test', spy)
    events.emit('test', false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith(true)
    expect(events.listeners).toEqual({})
  })

  it('can noop when removing unknown listeners', () => {
    const events = new Events<TEvents>()

    const spy1 = vi.fn()
    const spy2 = vi.fn()

    expect(events.listeners.test).toBeUndefined()

    events.off('test', spy1)

    expect(events.listeners.test).toBeUndefined()

    events.on('test', spy2)
    events.off('test', spy1)

    expect(events.listeners.test).toEqual([spy2])
  })

  it('can unregister itself', () => {
    const events = new Events<TEvents>()

    const spy = vi.fn()

    events.on('test', spy)
    const unsub = events.on('test', spy)

    expect(events.listeners.test).toHaveLength(2)

    unsub()
    unsub()

    expect(events.listeners.test).toHaveLength(1)
    expect(events.listeners.test).toEqual([spy])
  })

  it('can register one-time listeners', () => {
    const events = new Events<TEvents>()

    const spy1 = vi.fn()
    const spy2 = vi.fn()

    events.once('test', spy1)
    events.on('test', spy2)

    expect(events.listeners.test).toHaveLength(2)

    events.emit('test', true)
    events.emit('test', false)

    expect(events.listeners.test).toHaveLength(1)
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy1).toHaveBeenCalledWith(true)
    expect(spy2).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenLastCalledWith(false)
  })

  it('can emit events to subscribers', () => {
    const events = new Events<TEvents>()

    const spy = vi.fn()

    const unsub = events.subscribe(spy)

    events.emit('test', true)
    unsub()
    events.emit('trial')

    expect(events.subscribers).toEqual([])
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ event: 'test', args: [true] })
  })

  it('can forward events within subscribers', () => {
    const events1 = new Events<TEvents>()
    const events2 = new Events<Pick<TEvents, 'test'>>()

    const spy = vi.fn()

    events2.subscribe(({ event, args }) => {
      events1.emit(event, ...args)
    })

    events1.on('test', spy)
    events2.emit('test', true)

    expect(spy).toHaveBeenLastCalledWith(true)
  })

  it('can remove all event listeners', () => {
    const events = new Events<TEvents>()

    const spy = vi.fn()

    events.on('test', spy)
    events.on('trial', spy)
    events.on('test', spy)

    expect(events.listeners.test).toHaveLength(2)

    events.removeAllListeners('test')

    expect(events.listeners.test).toBeUndefined()
    expect(events.listeners.trial).toHaveLength(1)
  })
})
