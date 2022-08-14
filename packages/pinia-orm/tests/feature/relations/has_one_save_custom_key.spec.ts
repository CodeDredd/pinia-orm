import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasOne, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has one" relation with custom primary key', () => {
    class Phone extends Model {
      static entity = 'phones'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') number!: string
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId')
        phone!: Phone | null
    }

    const usersRepo = useRepo(User)

    usersRepo.save({
      userId: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' },
      },
    })
  })

  it('inserts "has one" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId', 'userId')
        phone!: Phone | null
    }

    class Phone extends Model {
      static entity = 'phones'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') number!: string
    }

    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 2, number: '123-4567-8912' },
      },
    })
  })
})
