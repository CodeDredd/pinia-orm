import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str } from '../../../src/decorators'
import {
  assertState,
  fillState,
} from '../../helpers'

describe('feature/hooks/deleting', () => {
  it('can be destroyed', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static deleting(model: Model) {
        model.name = 'John'
      }
    }

    const deletingMethod = vi.spyOn(User, 'deleting')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    useRepo(User).destroy(1)

    expect(deletingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {},
    })
  })

  it('can be deleted', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static deleting(model: Model) {
        model.name = 'John'
      }
    }

    const deletingMethod = vi.spyOn(User, 'deleting')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 10 },
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })

    useRepo(User).where('id', 1).delete()

    expect(deletingMethod).toHaveBeenCalledTimes(1)

    assertState({
      users: {
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })
  })

  it('is stopping record being deleted', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static deleting(model: Model) {
        model.name = 'John'
        return false
      }
    }

    const deletingMethod = vi.spyOn(User, 'deleting')

    fillState({
      users: {
        1: { id: 1, name: 'John', age: 50 },
      },
    })

    useRepo(User).destroy(1)

    expect(deletingMethod).toHaveBeenCalledOnce()

    assertState({
      users: {
        1: { id: 1, name: 'John', age: 50 },
      },
    })
  })
})
