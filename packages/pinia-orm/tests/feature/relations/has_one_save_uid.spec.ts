import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasOne, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/has_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has one" relation with parent having "uid" field as the primary key', () => {
    class Phone extends Model {
      static entity = 'phones'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') number!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId')
        phone!: Phone | null
    }

    mockUid(['uid1'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      phones: {
        1: { id: 1, userId: 'uid1', number: '123-4567-8912' },
      },
    })
  })

  it('inserts "has one" relation with child having "uid" as the foreign key', () => {
    class Phone extends Model {
      static entity = 'phones'

      @Uid() id!: string
      @Uid() userId!: string
      @Str('') number!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId')
        phone!: Phone | null
    }

    mockUid(['uid1', 'uid2'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      phone: {
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      phones: {
        uid2: { id: 'uid2', userId: 'uid1', number: '123-4567-8912' },
      },
    })
  })

  it('inserts "has one" relation with child having "uid" as foreign key being primary key', () => {
    class Phone extends Model {
      static entity = 'phones'

      static primaryKey = 'userId'

      @Uid() userId!: string
      @Str('') number!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @HasOne(() => Phone, 'userId')
        phone!: Phone | null
    }

    mockUid(['uid1', 'uid2'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      phone: {
        number: '123-4567-8912',
      },
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      phones: {
        uid1: { userId: 'uid1', number: '123-4567-8912' },
      },
    })
  })
})
