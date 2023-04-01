import { beforeEach, describe, expect, it } from 'vitest'

import { getActivePinia } from 'pinia'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { graphql } from 'graphql'
import casual from 'casual'
import { assertState } from '../../helpers'
import { Attr, BelongsToMany, Num, Str } from '../../../src/decorators'
import { Model, useRepo } from '../../../src'

describe('feature/relations/belongs_to_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to many" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'belongsToManyId'

      @Num(0) belongsToManyId!: number
      @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
      permissions!: Role
    }

    class Role extends Model {
      static entity = 'roles'

      @Num(0) id!: number
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      @Attr(null) role_id!: number | null
      @Attr(null) user_id!: number | null
      @Attr(null) level!: number | null
    }

    useRepo(User).save([
      {
        belongsToManyId: 1,
        permissions: [{ id: 1, pivot: { level: 1 } }, { id: 2 }],
      },
      {
        belongsToManyId: 2,
        permissions: [{ id: 2 }],
      },
    ])

    assertState({
      users: {
        1: { belongsToManyId: 1 },
        2: { belongsToManyId: 2 },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[2,2]': { role_id: 2, user_id: 2, level: null },
      },
    })
  })

  it('inserts nested "belongs to many" relation correctly', () => {
    class Contact extends Model {
      static entity = 'contacts'

      static fields() {
        return {
          id: this.uid(),
          userId: this.attr(null),
          user: this.belongsTo(User, 'userId'),
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.uid(),
          groups: this.belongsToMany(Group, GroupUser, 'userId', 'groupId'),
          prename: this.string('naame'),
        }
      }
    }

    class Group extends Model {
      static entity = 'groups'

      static fields() {
        return {
          id: this.uid(),
          name: this.string('group'),
        }
      }
    }

    class GroupUser extends Model {
      static entity = 'group_user'
      static primaryKey = ['groupId', 'userId']

      static fields() {
        return {
          groupId: this.attr(null), // Docs say this.attr(null) which throws an error
          userId: this.attr(null),
        }
      }
    }

    useRepo(Contact).save({
      id: 1,
      user: {
        id: 1,
        prename: 'blub',
        groups: [
          {
            id: 1,
            name: 'hoho',
          },
        ],
      },
    })

    assertState({
      contacts: {
        1: { id: 1, userId: 1 },
      },
      users: {
        1: { id: 1, prename: 'blub' },
      },
      groups: {
        1: { id: 1, name: 'hoho' },
      },
      group_user: {
        '[1,1]': { groupId: 1, userId: 1 },
      },
    })
  })

  it('inserts "belongs to many" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'belongsToManyId'

      @Num(0) belongsToManyId!: number
      @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
      permissions!: Role
    }

    class Role extends Model {
      static entity = 'roles'

      static primaryKey = 'newRoleId'

      @Num(0) newRoleId!: number
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      @Attr(null) role_id!: number | null
      @Attr(null) user_id!: number | null
      @Attr(null) level!: number | null
    }

    useRepo(User).save([
      {
        belongsToManyId: 1,
        permissions: [{ newRoleId: 1, pivot: { level: 1 } }, { newRoleId: 2 }],
      },
      {
        belongsToManyId: 2,
        permissions: [{ newRoleId: 2 }],
      },
    ])

    assertState({
      users: {
        1: { belongsToManyId: 1 },
        2: { belongsToManyId: 2 },
      },
      roles: {
        1: { newRoleId: 1 },
        2: { newRoleId: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[2,2]': { role_id: 2, user_id: 2, level: null },
      },
    })
  })

  it('inserts "belongs to many" relation from graphql response', async () => {
    const sourceSchema = `
  type OutsourcingPartner {
    id: Int!
    name: String!
    billingGroups: [BillingGroup]
  }

  type BillingGroup {
    id: Int!
    name: String
    votes: Int
  }

  type Query {
    outsourcingpartners: [OutsourcingPartner]
  }

`

    const schema = makeExecutableSchema({
      typeDefs: sourceSchema,
    })

    let ospIdCounter = 0
    function getOutsourcingpartner() {
      return {
        id: ospIdCounter++,
        name: casual.name,
        billingGroups: [
          {
            id: 1,
            name: 'Dark Forces',
          },
          {
            id: 2,
            name: 'Jedi Council',
          },
          {
            id: 3,
            name: 'The Jedis',
          },
        ],
      }
    }

    const schemaWithMocks = addMocksToSchema({
      schema,
      mocks: {
        OutsourcingPartner: () => {
          return getOutsourcingpartner()
        },
      },
    })

    const query = `
  query {
    outsourcingpartners {
      id
      name
      __typename
      billingGroups {
        id
        name
        __typename
      }
    }
  }
  `
    class BillingGroup extends Model {
      static entity = 'billingGroups'

      @Num(0)
      declare id: number

      @Str('')
      declare name: string
    }

    class OutsourcingPartner extends Model {
      static entity = 'outsourcingPartners'

      @Num(0)
      declare id: number

      @Str('')
      declare name: string

      @BelongsToMany(
        () => BillingGroup,
        () => OutsourcingPartnerBillingGroup,
        'outsourcingPartner_id',
        'billingGroup_id'
      )
      declare billingGroups: BillingGroup[]
    }

    class OutsourcingPartnerBillingGroup extends Model {
      static entity = 'outsourcingPartnerBillingGroups'

      static primaryKey = ['outsourcingPartner_id', 'billingGroup_id']

      @Num(0)
      declare outsourcingPartner_id: number

      @Num(0)
      declare billingGroup_id: number
    }

    const result = await graphql({
      schema: schemaWithMocks,
      source: query,
    })
    console.log('GrapgQL Response: ', result.data.outsourcingpartners)
    const repo = useRepo(OutsourcingPartner)
    repo.save(result.data.outsourcingpartners)
    console.log('State: ', getActivePinia().state.value)

    const data = repo.with('billingGroups').get()
    data.forEach((outsourcingPartner) => {
      expect(outsourcingPartner.billingGroups.length).toBe(3)
    })
  })
})
