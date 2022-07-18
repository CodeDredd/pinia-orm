import { describe, expect, it, vi } from 'vitest'

import { Model, Num, Str, useRepo } from '../../../src'
import { assertState } from '../../helpers'

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
})
