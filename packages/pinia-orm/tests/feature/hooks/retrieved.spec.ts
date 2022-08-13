import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str } from '../../../src/decorators'
import {
  fillState,
} from '../../helpers'

describe('feature/hooks/retrieved', () => {
  it('is not triggered when trying to retrieve a non existing record', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static retrieved(model: Model) {
        model.name = 'John'
      }
    }

    const retrievedMethod = vi.spyOn(User, 'retrieved')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    useRepo(User).where('id', 2).first()

    expect(retrievedMethod).toBeCalledTimes(0)
  })

  it('is being called multiple times with all', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static retrieved() {
        // Doing retrieved stuff
      }
    }

    const retrievedMethod = vi.spyOn(User, 'retrieved')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 10 },
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })

    useRepo(User).all()

    expect(retrievedMethod).toHaveBeenCalledTimes(2)
  })

  it('is being called with find', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
      @Num(0) age!: number

      static retrieved() {
        // Doing retrieved stuff
      }
    }

    const retrievedMethod = vi.spyOn(User, 'retrieved')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 10 },
        2: { id: 2, name: 'John Doe', age: 10 },
      },
    })

    useRepo(User).find(1)

    expect(retrievedMethod).toHaveBeenCalledOnce()
  })
})
