import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Bool, Cast } from '../../../src/decorators'
import { BooleanCast } from '../../../src/casts'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_Boolean', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast to boolean', () => {
    class User extends Model {
      static entity = 'users'

      @Bool(false) isPublished!: boolean

      static casts() {
        return {
          isPublished: BooleanCast,
        }
      }
    }

    expect(new User({ isPublished: 1 }, { mutator: 'get' }).isPublished).toBe(true)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => BooleanCast)
      @Bool(true)
        isPublished!: boolean
    }

    expect(new User({ isPublished: true }, { mutator: 'get' }).isPublished).toBe(true)
    expect(new User({ isPublished: 0 }, { mutator: 'get' }).isPublished).toBe(false)
    expect(new User({ isPublished: '1' }, { mutator: 'get' }).isPublished).toBe(true)
    expect(new User({ isPublished: null }, { mutator: 'get' }).isPublished).toBe(false)
    expect(new User({ isPublished: '' }, { mutator: 'get' }).isPublished).toBe(false)
    expect(new User({ isPublished: 'tt12' }, { mutator: 'get' }).isPublished).toBe(true)
    expect(new User({ isPublished: {} }, { mutator: 'get' }).isPublished).toBe(false)
    expect(new User({ mutator: 'get' }).isPublished).toBe(true)
  })

  it('accepts "null" when the "nullable" option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => BooleanCast)
      @Bool(null, { nullable: true })
        isPublished!: boolean | null
    }

    expect(new User({ mutator: 'get' }).isPublished).toBe(null)
    expect(new User({ isPublished: 'value' }, { mutator: 'get' }).isPublished).toBe(true)
    expect(new User({ isPublished: 1 }, { mutator: 'get' }).isPublished).toBe(true)
    expect(new User({ isPublished: true }, { mutator: 'get' }).isPublished).toBe(true)
    expect(new User({ isPublished: null }, { mutator: 'get' }).isPublished).toBe(null)
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Bool(false) isPublished!: boolean

      static casts() {
        return {
          isPublished: BooleanCast,
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      isPublished: 1,
    })

    assertState({
      users: {
        1: { id: 1, isPublished: true },
      },
    })

    expect(userRepo.find(1)?.isPublished).toBe(true)
  })
})
