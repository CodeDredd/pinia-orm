import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast } from '../../../src/decorators'
import { ArrayCast } from '../../../src/casts'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_Array', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast to array', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) declare id: number
      @Attr('{}') declare meta: Record<string, any>

      static casts () {
        return {
          meta: ArrayCast,
        }
      }
    }

    expect(new User({ meta: '{"name":"John", "age":30, "car":null}' }, { operation: 'get' }).meta).toStrictEqual({
      name: 'John',
      age: 30,
      car: null,
    })

    expect(new User({ meta: false }, { operation: 'get' }).meta).toStrictEqual(false)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) declare id: number
      @Cast(() => ArrayCast) @Attr('{}') declare meta: Record<string, any>
    }

    expect(new User({ meta: '{"name":"John", "age":30, "car":null}' }, { operation: 'get' }).meta).toStrictEqual({
      name: 'John',
      age: 30,
      car: null,
    })
    expect(new User().meta).toMatchObject({})
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) declare id: number
      @Attr({}) declare meta: Record<string, any>

      static casts () {
        return {
          meta: ArrayCast,
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

  it('should cast with object as default', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) declare id: number
      @Attr({ name: 'Test', age: 12, car: null }) declare meta: Record<string, any>

      static casts () {
        return {
          meta: ArrayCast,
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.cache()?.clear()
    userRepo.save({
      id: 1,
    })

    assertState({
      users: {
        1: { id: 1, meta: '{"name":"Test","age":12,"car":null}' },
      },
    })

    expect(userRepo.find(1)?.meta).toStrictEqual({
      name: 'Test',
      age: 12,
      car: null,
    })
  })
})
