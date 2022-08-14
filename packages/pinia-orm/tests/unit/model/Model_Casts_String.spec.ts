import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_String', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast to string', () => {
    class User extends Model {
      static entity = 'users'

      @Str('') name!: string

      static casts() {
        return {
          name: 'string',
        }
      }
    }

    expect(new User({ name: 123 }).name).toBe('123')
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('string')
      @Str('test')
        name!: string
    }

    expect(new User({ name: true }).name).toBe('true')
    expect(new User({ name: 1 }).name).toBe('1')
    expect(new User({ name: null }).name).toBe('null')
    expect(new User().name).toBe('test')
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Cast('string')
      @Str(null, { nullable: true })
        str!: string | null
    }

    expect(new User().str).toBe(null)
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe('1')
    expect(new User({ str: true }).str).toBe('true')
    expect(new User({ str: null }).str).toBe(null)
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') name!: string

      static casts() {
        return {
          name: 'string',
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 1234,
    })

    assertState({
      users: {
        1: { id: 1, name: '1234' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('1234')
  })
})
