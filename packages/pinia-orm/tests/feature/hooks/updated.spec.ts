import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str } from '../../../src/decorators'
import {
  assertState,
  fillState,
} from '../../helpers'

describe('feature/hooks/updated', () => {
  it('does nothing when passing in an empty array', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static updated(model: Model) {
        model.name = 'John'
      }
    }

    const updatedMethod = vi.spyOn(User, 'updated')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    useRepo(User).save([])

    expect(updatedMethod).toBeCalledTimes(0)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })
  })

  it('is being called', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static updated() {
        // Doing updated stuff
      }
    }

    const createdMethod = vi.spyOn(User, 'created')
    const updatedMethod = vi.spyOn(User, 'updated')
    const savedMethod = vi.spyOn(User, 'saved')

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

    expect(createdMethod).toHaveBeenCalledTimes(0)
    expect(updatedMethod).toHaveBeenCalledTimes(3)
    expect(savedMethod).toHaveBeenCalledTimes(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 100 },
        2: { id: 2, name: 'John Doe 2', age: 40 },
      },
    })
  })
})
