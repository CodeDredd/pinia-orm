import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Mutate } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('unit/model/Model_Mutators', () => {
  it('should mutate data if mutators are present', () => {
    class User extends Model {
      static entity = 'users'

      @Attr('') name!: string

      static mutators () {
        return {
          name (value: any) {
            return value.toUpperCase()
          },
        }
      }
    }

    expect(new User({ name: 'john doe' }, { operation: 'get' }).name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Mutate((value: any) => value.toUpperCase())
      @Attr('')
        name!: string
    }

    expect(new User({ name: 'john doe' }, { operation: 'get' }).name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators with getter are present', () => {
    class User extends Model {
      static entity = 'users'

      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            get: (value: any) => value.toUpperCase(),
          },
        }
      }
    }

    expect(new User({ name: 'john doe' }, { operation: 'get' }).name).toBe('JOHN DOE')
  })

  it('should not mutate data in the store with get', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            get: (value: any) => value.toUpperCase(),
          },
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('JOHN DOE')
  })

  it('should mutate data in the store with set', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            set: (value: any) => value.toUpperCase(),
          },
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'JOHN DOE' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('JOHN DOE')
  })
})
