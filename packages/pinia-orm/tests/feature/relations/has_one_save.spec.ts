import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasOne, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_one_save', () => {
  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') number!: string
  }

  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasOne(() => Phone, 'userId')
      phone!: Phone | null
  }

  it('inserts a record to the store with "has one" relation', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        userId: 1,
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })
  })

  it('generates missing foreign key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      name: 'John Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      name: 'John Doe',
      phone: null,
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })
})
