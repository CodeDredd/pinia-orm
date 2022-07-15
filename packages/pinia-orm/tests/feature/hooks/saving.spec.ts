import { describe, expect, it, vi } from 'vitest'

import { Model, Num, Str, useRepo } from '../../../src'
import { assertState } from '../../helpers'

describe('feature/hooks/saving', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saving(model: Model) {
        model.name = 'John'
      }
    }

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save([])

    expect(savingMethod).toBeCalledTimes(0)

    assertState({})
  })

  it('is able to change values', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saving(model: Model) {
        model.name = 'John'
      }
    }

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(savingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 30 },
      },
    })
  })

  it('is stopping record to be saved', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static saving(model: Model) {
        model.name = 'John'
        return false
      }
    }

    const savingMethod = vi.spyOn(User, 'saving')

    useRepo(User).save({ id: 1, name: 'John Doe', age: 30 })

    expect(savingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {},
    })
  })
})
