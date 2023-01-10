import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/hooks/creating', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static creating(model: Model) {
        model.name = 'John'
      }
    }

    const creatingMethod = vi.spyOn(User, 'creating')

    useRepo(User).save([])

    expect(creatingMethod).toBeCalledTimes(0)

    assertState({})
  })

  it('is able to change values', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static creating(model: Model) {
        model.name = 'John'
      }
    }

    const creatingMethod = vi.spyOn(User, 'creating')
    const updatingMethod = vi.spyOn(User, 'updating')
    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'John Doe 2', age: 40 },
    ])

    expect(creatingMethod).toHaveBeenCalledTimes(2)
    expect(updatingMethod).toHaveBeenCalledTimes(0)
    expect(savingMethod).toHaveBeenCalledTimes(2)

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 30 },
        2: { id: 2, name: 'John', age: 40 },
      },
    })
  })

  it('is stopping record to be saved', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static creating(model: Model) {
        model.name = 'John'
        return false
      }
    }

    const creatingMethod = vi.spyOn(User, 'creating')

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(creatingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {},
    })
  })

  it('is stopping record to be saved with new method', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() declare id: string
      @Str('') declare name: string
      @Num(0) declare age: number

      static creating(model: Model) {
        model.name = 'John'
        return false
      }
    }

    mockUid(['uid1'])

    const creatingMethod = vi.spyOn(User, 'creating')

    useRepo(User).new()

    expect(creatingMethod).toHaveBeenCalledOnce()

    assertState({})
  })
})
