import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_Array', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast to array', () => {
    class User extends Model {
      static entity = 'users'

      @Attr('{}') meta!: Record<string, any>

      static casts() {
        return {
          meta: 'array',
        }
      }
    }

    expect(new User({ meta: '{"name":"John", "age":30, "car":null}' }).meta).toStrictEqual({
      name: 'John',
      age: 30,
      car: null,
    })
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('array')
      @Attr('{}')
        meta!: Record<string, any>
    }

    expect(new User({ meta: '{"name":"John", "age":30, "car":null}' }).meta).toStrictEqual({
      name: 'John',
      age: 30,
      car: null,
    })
    expect(new User().meta).toMatchObject({})
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr(false) meta!: Record<string, any>

      static casts() {
        return {
          meta: 'array',
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      meta: {
        name: 'John',
        age: 30,
        car: null,
      },
    })

    assertState({
      users: {
        1: { id: 1, meta: '{"name":"John","age":30,"car":null}' },
      },
    })

    expect(userRepo.find(1)?.meta).toStrictEqual({
      name: 'John',
      age: 30,
      car: null,
    })
  })
})
