import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast, Num } from '../../../src/decorators'
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
          count: 'number',
        }
      }
    }

    expect(new User({ count: '1' }).count).toBe(1)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('number')
      @Num(0)
        count!: number
    }

    expect(new User({ count: true }).count).toBe(1)
    expect(new User({ count: false }).count).toBe(0)
    expect(new User({ count: 1 }).count).toBe(1)
    expect(new User({ count: '1.43' }).count).toBe(1.43)
    expect(new User().count).toBe(0)
  })

  it('accepts null when the nullable option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('number')
      @Num(null, { nullable: true })
        count!: number | null
    }

    expect(new User().count).toBe(null)
    expect(new User({ count: 'value' }).count).toBe(NaN)
    expect(new User({ count: 1 }).count).toBe(1)
    expect(new User({ count: true }).count).toBe(1)
    expect(new User({ count: {} }).count).toBe(0)
    expect(new User({ count: '333' }).count).toBe(333)
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Num(0) count!: number

      static casts() {
        return {
          count: 'number',
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
