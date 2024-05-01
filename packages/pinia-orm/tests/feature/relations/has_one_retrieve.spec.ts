import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasOne, Str } from '../../../src/decorators'
import { assertModel } from '../../helpers'

describe('feature/relations/has_one_retrieve', () => {
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

  it('can eager load has one relation', () => {
    const usersRepo = useRepo(User)
    const phonesRepo = useRepo(Phone)

    usersRepo.save({ id: 1, name: 'John Doe' })
    phonesRepo.save({ id: 1, userId: 1, number: '123-4567-8912' })

    const user = usersRepo.with('phone').first()!

    expect(user).toBeInstanceOf(User)
    expect(user.phone).toBeInstanceOf(Phone)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        userId: 1,
        number: '123-4567-8912',
      },
    })
  })

  it('can eager load missing relation as `null`', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({ id: 1, name: 'John Doe' })

    const user = usersRepo.with('phone').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      phone: null,
    })
  })
})
