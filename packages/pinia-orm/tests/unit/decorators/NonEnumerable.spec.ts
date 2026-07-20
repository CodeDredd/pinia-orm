import { describe, expect, it } from 'vitest'

import { NonEnumerable } from '../../../src/decorators'

describe('unit/decorators/NonEnumerable', () => {
  class StdClass {
    visible: string

    @NonEnumerable
    accessor hidden: string

    constructor () {
      this.hidden = 'i am hidden'
      this.visible = 'i am visible'
    }
  }

  it('should describe as an innumerable property', () => {
    const cls = new StdClass()

    // eslint-disable-next-line no-prototype-builtins
    expect(cls.propertyIsEnumerable('hidden')).toBe(false)
  })

  it('should still be readable and writable', () => {
    const cls = new StdClass()

    expect(cls.hidden).toBe('i am hidden')

    cls.hidden = 'changed'

    expect(cls.hidden).toBe('changed')
  })

  it('should not appear during property enumeration', () => {
    const cls = new StdClass()

    expect(Object.keys(cls)).not.toContain('hidden')
    expect(Object.values(cls)).not.toContain('i am hidden')
    expect(JSON.parse(JSON.stringify(cls))).toEqual({ visible: 'i am visible' })

    for (const prop in cls) { expect(prop).not.toBe('hidden') }
  })

  it('throws when used without the accessor keyword', () => {
    expect(() => {
      // Simulate a field usage of the decorator.
      (NonEnumerable as any)(undefined, { kind: 'field', name: 'hidden' })
    }).toThrowError('accessor')
  })
})
