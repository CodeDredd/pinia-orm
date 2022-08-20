import { describe, expect, it } from 'vitest'
import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { fillState } from '../../helpers'

describe('feature/repository/destroy_composite_key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['idA', 'idB']

    @Attr() idA!: any
    @Attr() idB!: any
    @Str('') name!: string
  }

  it('throws if the model has composite key', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    expect(() => userRepo.destroy(2)).toThrow()
  })
})
