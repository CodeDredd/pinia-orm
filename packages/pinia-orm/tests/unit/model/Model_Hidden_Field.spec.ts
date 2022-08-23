import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Hidden, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('unit/model/Model_Hidden_Field', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should hide the field with "hidden"', () => {
    class User extends Model {
      static entity = 'users'

      static hidden = ['username']

      @Str('') declare name: string
      @Str('') declare username: string
    }
    const user = new User({ name: 'Test', username: 'John' }, { operation: 'get' })

    expect(user.name).toBe('Test')
    expect(user.username).toBe(undefined)
  })

  it('should hide the field with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Str('') declare name: string
      @Hidden() @Str('') declare username: string
    }
    const user = new User({ name: 'Test', username: 'John' }, { operation: 'get' })

    expect(user.name).toBe('Test')
    expect(user.username).toBe(undefined)
  })

  it('should hide the field with "visible"', () => {
    class User extends Model {
      static entity = 'users'

      static visible = ['username']

      @Str('') declare name: string
      @Str('') declare username: string
    }
    const user = new User({ name: 'Test', username: 'John' }, { operation: 'get' })

    expect(user.name).toBe(undefined)
    expect(user.username).toBe('John')
  })

  it('should save all if fields are hidden', () => {
    class User extends Model {
      static entity = 'users'

      static hidden = ['username']

      @Attr(0) declare id: string
      @Str('') declare name: string
      @Str('') declare username: string
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    assertState({
      users: {
        1: { id: 1, name: 'John', username: 'JD' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('John')
    expect(userRepo.find(1)?.username).toBe(undefined)
    expect(userRepo.makeVisible(['username']).find(1)?.username).toBe('JD')
    expect(userRepo.makeHidden(['name']).find(1)?.name).toBe(undefined)
  })
})
