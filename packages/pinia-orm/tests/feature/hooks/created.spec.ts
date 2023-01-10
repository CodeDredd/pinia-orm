import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/hooks/created', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static created(model: Model) {
        model.name = 'John'
      }
    }

    const createdMethod = vi.spyOn(User, 'created')

    useRepo(User).save([])

    expect(createdMethod).toBeCalledTimes(0)

    assertState({})
  })

  it('is able to change values', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static created(model: Model) {
        model.name = 'John'
      }
    }

    const createdMethod = vi.spyOn(User, 'created')
    const updatedMethod = vi.spyOn(User, 'updated')
    const savedMethod = vi.spyOn(User, 'saved')

    useRepo(User).save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'John Doe 2', age: 40 },
    ])

    expect(createdMethod).toHaveBeenCalledTimes(2)
    expect(updatedMethod).toHaveBeenCalledTimes(0)
    expect(savedMethod).toHaveBeenCalledTimes(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'John Doe 2', age: 40 },
      },
    })
  })

  it('is able to change values with new method', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() declare id: string
      @Str('') declare name: string
      @Num(0) declare age: number

      static created(model: Model) {
        model.name = 'John'
      }
    }

    mockUid(['uid1'])

    const createdMethod = vi.spyOn(User, 'created')

    useRepo(User).new()

    expect(createdMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John', age: 0 },
      },
    })
  })
})
