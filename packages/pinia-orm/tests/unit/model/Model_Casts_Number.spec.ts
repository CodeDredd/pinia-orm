import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast, Num } from '../../../src/decorators'
import { NumberCast } from '../../../src/casts'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_Number', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast to number', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) count!: number

      static casts() {
        return {
          count: NumberCast,
        }
      }
    }

    expect(new User({ count: '1' }, { mutator: 'get' }).count).toBe(1)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => NumberCast)
      @Num(0)
        count!: number
    }

    expect(new User({ count: true }, { mutator: 'get' }).count).toBe(1)
    expect(new User({ count: false }, { mutator: 'get' }).count).toBe(0)
    expect(new User({ count: 1 }, { mutator: 'get' }).count).toBe(1)
    expect(new User({ count: '1.43' }, { mutator: 'get' }).count).toBe(1.43)
    expect(new User({ mutator: 'get' }).count).toBe(0)
  })

  it('throws warning with null when the notnotNullable option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => NumberCast)
      @Num(null, { notnotNullable: true })
        count!: number | null
    }

    expect(new User({ mutator: 'get' }).count).toBe(null)
    expect(new User({ count: 'value' }, { mutator: 'get' }).count).toBe(NaN)
    expect(new User({ count: 1 }, { mutator: 'get' }).count).toBe(1)
    expect(new User({ count: true }, { mutator: 'get' }).count).toBe(1)
    expect(new User({ count: {} }, { mutator: 'get' }).count).toBe(0)
    expect(new User({ count: '333' }, { mutator: 'get' }).count).toBe(333)
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Num(0) count!: number

      static casts() {
        return {
          count: NumberCast,
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      count: '444',
    })

    assertState({
      users: {
        1: { id: 1, count: 444 },
      },
    })

    expect(userRepo.find(1)?.count).toBe(444)
  })
})
