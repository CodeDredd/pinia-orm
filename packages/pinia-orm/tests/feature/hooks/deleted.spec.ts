import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str } from '../../../src/decorators'
import {
  assertState,
  fillState,
} from '../../helpers'

describe('feature/hooks/deleted', () => {
  it('is not triggered when trying to delete a non existing record', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static deleted(model: Model) {
        model.name = 'John'
      }
    }

    const deletedMethod = vi.spyOn(User, 'deleted')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    useRepo(User).destroy(2)

    expect(deletedMethod).toBeCalledTimes(0)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })
  })

  it('is being called with destroy', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static deleted() {
        // Doing deleted stuff
      }
    }

    const deletedMethod = vi.spyOn(User, 'deleted')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 10 },
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })

    useRepo(User).destroy([1, 2])

    expect(deletedMethod).toHaveBeenCalledTimes(2)

    assertState({
      users: {},
    })
  })

  it('is being called with delete', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static deleted() {
        // Doing deleted stuff
      }
    }

    const deletedMethod = vi.spyOn(User, 'deleted')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 10 },
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })

    useRepo(User).where('id', 1).delete()

    expect(deletedMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })
  })
})
