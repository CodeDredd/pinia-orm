import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str } from '../../../src/decorators'
import { fillState } from '../../helpers'

describe('feature/repository/retrieves_group_by', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('can group records using the "groupByy" modifier', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'James', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.groupBy('name').get<'group'>()

    const expected = {
      James: [
        { id: 1, name: 'James', age: 40 },
        { id: 2, name: 'James', age: 30 },
      ],
      David: [
        { id: 3, name: 'David', age: 20 },
      ],
    }

    expect(users).toEqual(expected)
  })

  it('can group records by combining multiple properties to "groupBy"', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'James', age: 30 },
        3: { id: 3, name: 'Andy', age: 20 },
        4: { id: 4, name: 'David', age: 20 },
        5: { id: 5, name: 'David', age: 20 },
      },
    })

    const users = userRepo.groupBy('name', 'age').get<'group'>()

    const expected = {
      '[James,40]': [
        { id: 1, name: 'James', age: 40 },
      ],
      '[James,30]': [
        { id: 2, name: 'James', age: 30 },
      ],
      '[Andy,20]': [
        { id: 3, name: 'Andy', age: 20 },
      ],
      '[David,20]': [
        { id: 4, name: 'David', age: 20 },
        { id: 5, name: 'David', age: 20 },
      ],
    }

    expect(Object.keys(users)).toHaveLength(4)
    expect(users).toEqual(expected)
  })
})
