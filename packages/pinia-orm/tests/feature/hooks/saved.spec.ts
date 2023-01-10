import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/hooks/saved', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saved() {
        // Doing saved stuff
      }
    }

    const savedMethod = vi.spyOn(User, 'saved')

    useRepo(User).save([])

    expect(savedMethod).toBeCalledTimes(0)

    assertState({})
  })

  it('is being called', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saved() {
        // Doing saved stuff
      }
    }

    const savedMethod = vi.spyOn(User, 'saved')

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(savedMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })
  })

  it('is able to change values with new method', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() declare id: string
      @Str('') declare name: string
      @Num(0) declare age: number

      static saved(model: Model) {
        model.name = 'John'
      }
    }

    mockUid(['uid1'])

    const savedMethod = vi.spyOn(User, 'saved')

    useRepo(User).new()

    expect(savedMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John', age: 0 },
      },
    })
  })
})
