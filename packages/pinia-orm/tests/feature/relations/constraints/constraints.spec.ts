import { describe, expect, it } from 'vitest'

import { Attr, HasOne, Model, Str, useRepo } from '../../../../src'

describe('feature/relations/constraints/constraints', () => {
  class Type extends Model {
    static entity = 'types'

    @Attr() id!: number
    @Attr() phoneId!: number
    @Str('') name!: string
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') number!: string

    @HasOne(() => Type, 'phoneId')
    type!: Type | null
  }

  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone | null
  }

  it('can add constraints to the relationship query', () => {
    const usersRepo = useRepo(User)
    const phonesRepo = useRepo(Phone)

    usersRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' }
    ])

    phonesRepo.save([
      { id: 1, userId: 1, number: '123' },
      { id: 2, userId: 2, number: '345' },
      { id: 3, userId: 3, number: '789' }
    ])

    const users = usersRepo
      .with('phone', query => {
        query.where('number', '345')
      })
      .get()

    expect(users[0].phone).toBe(null)
    expect(users[1].phone!.number).toBe('345')
    expect(users[2].phone).toBe(null)
  })

  it('can load nested relationships', () => {
    const usersRepo = useRepo(User)
    const phonesRepo = useRepo(Phone)
    const typesRepo = useRepo(Type)

    usersRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' }
    ])

    phonesRepo.save([
      { id: 1, userId: 1, number: '123' },
      { id: 2, userId: 2, number: '345' },
      { id: 3, userId: 3, number: '789' }
    ])
    typesRepo.save([
      { id: 1, phoneId: 1, name: 'iPhone' },
      { id: 2, phoneId: 2, name: 'Android' }
    ])

    const users = usersRepo
      .with('phone', query => {
        query.with('type')
      })
      .get()

    expect(users[0].phone!.type!.id).toBe(1)
    expect(users[1].phone!.type!.id).toBe(2)
    expect(users[2].phone!.type).toBe(null)
  })
})
