import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, NonEnumerable, Str } from '../../../src/decorators'

describe('unit/decorators/StandardDecorators', () => {
  it('throws a helpful error when called with legacy decorator semantics', () => {
    class User extends Model {
      static entity = 'users'
    }

    // Simulates the call signature of an `experimentalDecorators` compiler.
    expect(() => (Attr('') as any)(User.prototype, 'name')).toThrowError('experimentalDecorators')
    expect(() => (Str('') as any)(User.prototype, 'name')).toThrowError('standard ECMAScript decorator')
  })

  it('registers fields programmatically with setRegistry', () => {
    class User extends Model {
      static entity = 'users'

      declare id: number | null
      declare nickname: string
    }

    User.setRegistry('id', () => User.attr(null))
      .setRegistry('nickname', () => User.string('n/a'))

    const userRepo = useRepo(User)

    userRepo.save({ id: 1 })

    expect(userRepo.find(1)?.nickname).toBe('n/a')
  })

  it('keeps inherited accessor fields non enumerable on subclasses', () => {
    class Base {
      @NonEnumerable
      accessor hidden: string = 'secret'
    }

    class Sub extends Base {
      visible = 'shown'
    }

    const first = new Sub()
    const second = new Sub()

    expect(Object.keys(first)).not.toContain('hidden')
    expect(Object.keys(second)).not.toContain('hidden')
    expect(first.hidden).toBe('secret')
    expect(JSON.parse(JSON.stringify(second))).toEqual({ visible: 'shown' })
  })
})
