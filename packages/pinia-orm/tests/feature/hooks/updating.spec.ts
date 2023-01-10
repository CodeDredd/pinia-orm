import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str } from '../../../src/decorators'
import {
  assertState,
  fillState,
} from '../../helpers'

describe('feature/hooks/updating', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static updating(model: Model) {
        model.name = 'John'
      }
    }

    const updatingMethod = vi.spyOn(User, 'updating')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    useRepo(User).save([])

    expect(updatingMethod).toBeCalledTimes(0)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })
  })

  it('is able to change values', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static updating(model: Model) {
        model.name = 'John'
      }
    }

    const creatingMethod = vi.spyOn(User, 'creating')
    const updatingMethod = vi.spyOn(User, 'updating')
    const savingMethod = vi.spyOn(User, 'saving')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 10 },
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })

    useRepo(User).save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'John Doe 2', age: 40 },
    ])

    useRepo(User).where('id', 1).update({ age: 100 })

    expect(creatingMethod).toHaveBeenCalledTimes(0)
    expect(updatingMethod).toHaveBeenCalledTimes(3)
    expect(savingMethod).toHaveBeenCalledTimes(2)

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 100 },
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

      static updating(model: Model) {
        model.name = 'John'
        return false
      }
    }

    const updatingMethod = vi.spyOn(User, 'updating')

    fillState({
      users: {
        1: { id: 1, name: 'John', age: 50 },
      },
    })

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(updatingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 50 },
      },
    })
  })
})
