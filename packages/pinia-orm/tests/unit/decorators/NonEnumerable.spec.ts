import { describe, it, expect } from 'vitest'

import { NonEnumerable } from '../../../src'

describe('unit/decorators/NonEnumerable', () => {
  class StdClass {
    visible: string

    @NonEnumerable
    hidden: string

    constructor() {
      this.hidden = 'i am hidden'
      this.visible = 'i am visible'
    }
  }

  it('should describe as an innumerable property', () => {
    const cls = new StdClass()

    expect(cls.propertyIsEnumerable('hidden')).toBe(false)
  })

  it('should appear in own property detection', () => {
    const cls = new StdClass()

    expect(Object.getOwnPropertyNames(cls)).toContain('hidden')
    expect(Object.prototype.hasOwnProperty.call(cls, 'hidden')).toBe(true)
  })

  it('should not appear during property enumeration', () => {
    const cls = new StdClass()

    expect(Object.keys(cls)).not.toContain('hidden')
    expect(Object.values(cls)).not.toContain('i am hidden')
    expect(Object.entries(cls)).toEqual([['visible', 'i am visible']])

    for (const prop in cls) expect(prop).not.toBe('hidden')
  })
})
