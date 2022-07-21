import { beforeEach, describe, expect, it } from 'vitest'

import { Attr, Bool, Cast, Model, useRepo } from '../../../src'
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
          isPublished: 'boolean',
        }
      }
    }

    expect(new User({ isPublished: 1 }).isPublished).toBe(true)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('boolean')
      @Bool(true)
        isPublished!: boolean
    }

    expect(new User({ isPublished: true }).isPublished).toBe(true)
    expect(new User({ isPublished: 0 }).isPublished).toBe(false)
    expect(new User({ isPublished: null }).isPublished).toBe(false)
    expect(new User({ isPublished: '' }).isPublished).toBe(false)
    expect(new User({ isPublished: {} }).isPublished).toBe(false)
    expect(new User().isPublished).toBe(true)
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('boolean')
      @Bool(null, { nullable: true })
        isPublished!: boolean | null
    }

    expect(new User().isPublished).toBe(null)
    expect(new User({ isPublished: 'value' }).isPublished).toBe(true)
    expect(new User({ isPublished: 1 }).isPublished).toBe(true)
    expect(new User({ isPublished: true }).isPublished).toBe(true)
    expect(new User({ isPublished: null }).isPublished).toBe(null)
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Bool(false) isPublished!: boolean

      static casts() {
        return {
          isPublished: 'boolean',
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
