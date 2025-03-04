import { describe, expect, it } from 'vitest'
import { Model, useRepo } from '../../../src'
import { Attr, BelongsToMany, Num } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/belongs_to_many_save', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
    roles!: Role

    @BelongsToMany(() => Role, () => SuperRoleUser, 'user_id', 'role_id')
    superRoles!: Role
  }

  class Role extends Model {
    static entity = 'roles'

    @Num(0) declare id: number
    declare pivot: RoleUser | SuperRoleUser
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) role_id!: number | null
    @Attr(null) user_id!: number | null
    @Attr(null) level!: number | null
  }

  class SuperRoleUser extends Model {
    static entity = 'superRoleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) role_id!: number | null
    @Attr(null) user_id!: number | null
    @Attr(false) super!: boolean
  }

  it('saves a model to the store with "belongs to many" relation', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      {
        id: 1,
        roles: [{ id: 1, pivot: { level: 1 } }, { id: 2 }, { id: 4 }],
        superRoles: [{ id: 2, pivot: { super: true } }],
      },
      {
        id: 2,
        roles: [{ id: 1, pivot: { level: 2 } }],
        superRoles: [{ id: 1 }, { id: 3, pivot: { super: true } }],
      },
    ])

    assertState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
        4: { id: 4 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[4,1]': { role_id: 4, user_id: 1, level: null },
        '[1,2]': { role_id: 1, user_id: 2, level: 2 },
      },
      superRoleUser: {
        '[2,1]': { role_id: 2, user_id: 1, super: true },
        '[1,2]': { role_id: 1, user_id: 2, super: false },
        '[3,2]': { role_id: 3, user_id: 2, super: true },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
    })

    assertState({
      users: {
        1: { id: 1 },
      },
    })
  })

  it('can handle relations to itself', () => {
    class ClientRetailer extends Model {
      static entity = 'client_retailers'

      static primaryKey = ['retailerId', 'supplierId']

      static fields () {
        return {
          supplierId: this.number(null),
          retailerId: this.number(null),
          retailerCode: this.string(null),
        }
      }
    }
    class Client extends Model {
      static entity = 'clients'

      static fields () {
        return {
          id: this.number(0),
          name: this.string(null),
          retailers: this.belongsToMany(Client, ClientRetailer, 'supplierId', 'retailerId'),
          suppliers: this.belongsToMany(Client, ClientRetailer, 'retailerId', 'supplierId'),
        }
      }
    }
    const clientRepo = useRepo(Client)

    clientRepo.save([
      {
        id: 1,
        name: 'Client 1',
        retailers: [
          {
            id: 4,
            pivot: {
              retailerCode: '401',
            },
          },
          {
            id: 5,
            pivot: {
              retailerCode: '501',
            },
          },
        ],
      },
      {
        id: 2,
        name: 'Client 2',
        retailers: [
          {
            id: 3,
            pivot: {
              retailerCode: '302',
            },
          },
          {
            id: 5,
            pivot: {
              retailerCode: '502',
            },
          },
        ],
      },
      {
        id: 3,
        name: 'Client 3',
      },
      {
        id: 4,
        name: 'Client 4',
        retailers: [
          {
            id: 1,
            pivot: {
              retailerCode: '104',
            },
          },
          {
            id: 5,
            pivot: {
              retailerCode: '504',
            },
          },
        ],
      },
      {
        id: 5,
        name: 'Client 5',
      },
    ])

    const client = clientRepo.withAll().first()

    expect(client.pivot).toBe(undefined)

    assertState({
      client_retailers: {
        '[1,4]': { 'supplierId': 4, 'retailerId': 1, 'retailerCode': '104' },
        '[3,2]': { 'supplierId': 2, 'retailerId': 3, 'retailerCode': '302' },
        '[5,2]': { 'supplierId': 2, 'retailerId': 5, 'retailerCode': '502' },
        '[4,1]': { 'supplierId': 1, 'retailerId': 4, 'retailerCode': '401' },
        '[5,4]': { 'supplierId': 4, 'retailerId': 5, 'retailerCode': '504' },
        '[5,1]': { 'supplierId': 1, 'retailerId': 5, 'retailerCode': '501' },

      },
      clients: {
        1: {
          'id': 1,
          'name': 'Client 1',
        },
        2: {
          'id': 2,
          'name': 'Client 2',
        },
        3: {
          'id': 3,
          'name': 'Client 3',
        },
        4: {
          'id': 4,
          'name': 'Client 4',
        },
        5: {
          'id': 5,
          'name': 'Client 5',
        },
      },
    })
  })
})
