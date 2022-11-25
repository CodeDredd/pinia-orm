import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../../src'
import { Attr, BelongsToMany, HasOne, Num, Str } from '../../../../src/decorators'

describe('feature/relations/constraints/constraints', () => {
  class Type extends Model {
    static entity = 'types'

    @Attr() declare id: number
    @Attr() declare phoneId: number
    @Str('') declare name: string
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() declare id: number
    @Attr() declare userId: number
    @Attr() declare roleId: number
    @Str('') declare number: string

    @HasOne(() => Type, 'phoneId')
    declare type: Type | null
  }

  class Role extends Model {
    static entity = 'roles'

    @Num(0) declare id: number
    declare pivot: RoleUser

    @HasOne(() => Phone, 'roleId')
    declare phone: Phone | null
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) declare role_id: number | null
    @Attr(null) declare user_id: number | null
    @Attr(null) declare level: number | null
  }

  class User extends Model {
    static entity = 'users'

    @Attr() declare id: number
    @Str('') declare name: string

    @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
    declare roles: Role[]

    @HasOne(() => Phone, 'userId')
    declare phone: Phone | null
  }

  it('can add constraints to the relationship query', () => {
    const usersRepo = useRepo(User)
    const phonesRepo = useRepo(Phone)

    usersRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    phonesRepo.save([
      { id: 1, userId: 1, number: '123' },
      { id: 2, userId: 2, number: '345' },
      { id: 3, userId: 3, number: '789' },
    ])

    const users = usersRepo
      .with('phone', (query) => {
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
      { id: 1, name: 'John Doe', roles: [{ id: 1, pivot: { level: 1 }, phone: { id: 4, number: '999' } }, { id: 2 }, { id: 4 }] },
      { id: 2, name: 'John Doe', roles: [{ id: 1, pivot: { level: 2 } }] },
      { id: 3, name: 'Johnny Doe' },
    ])

    phonesRepo.save([
      { id: 1, userId: 1, number: '123' },
      { id: 2, userId: 2, number: '345' },
      { id: 3, userId: 3, number: '789' },
    ])
    typesRepo.save([
      { id: 1, phoneId: 1, name: 'iPhone' },
      { id: 2, phoneId: 2, name: 'Android' },
    ])

    const users = usersRepo
      .with('phone', (query) => {
        query.with('type')
      })
      .with('roles', (query) => {
        query.with('phone')
      })
      .get()

    expect(users[0].phone!.type!.id).toBe(1)
    expect(users[0].roles.length).toBe(3)
    expect(users[0].roles[0].phone!.number).toBe('999')
    expect(users[1].phone!.type!.id).toBe(2)
    expect(users[2].phone!.type).toBe(null)
  })
})
