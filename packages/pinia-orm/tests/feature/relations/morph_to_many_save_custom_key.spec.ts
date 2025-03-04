import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphToMany, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morph_to_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to many" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'morphToManyId'

      @Num(0) declare morphToManyId: number
      @MorphToMany(() => Role, () => Roleable, 'roleId', 'rolableId', 'rolableType')
      declare permissions: Role[]
    }

    class Role extends Model {
      static entity = 'roles'

      @Num(0) declare id: number
    }

    class Roleable extends Model {
      static entity = 'roleables'

      static primaryKey = ['roleId', 'rolableId', 'rolableType']

      @Attr(null) declare roleId: number | null
      @Attr(null) declare rolableId: number | null
      @Str('') declare rolableType: number | null
      @Attr(null) declare level: number | null
    }

    useRepo(User).save([
      {
        morphToManyId: 1,
        permissions: [{ id: 1, pivot: { level: 1 } }, { id: 2 }],
      },
      {
        morphToManyId: 2,
        permissions: [{ id: 2 }],
      },
    ])

    assertState({
      users: {
        1: { morphToManyId: 1 },
        2: { morphToManyId: 2 },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleables: {
        '[1,1,"users"]': { roleId: 1, rolableId: 1, rolableType: 'users', level: 1 },
        '[2,1,"users"]': { roleId: 2, rolableId: 1, rolableType: 'users', level: null },
        '[2,2,"users"]': { roleId: 2, rolableId: 2, rolableType: 'users', level: null },
      },
    })
  })

  it('inserts nested "morph to many" relation correctly', () => {
    class Contact extends Model {
      static entity = 'contacts'

      static fields () {
        return {
          id: this.uid(),
          userId: this.attr(null),
          user: this.belongsTo(User, 'userId'),
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.uid(),
          groups: this.morphToMany(Group, Groupable, 'groupId', 'groupableId', 'groupableType'),
          prename: this.string('naame'),
        }
      }
    }

    class Group extends Model {
      static entity = 'groups'

      static fields () {
        return {
          id: this.uid(),
          name: this.string('group'),
        }
      }
    }

    class Groupable extends Model {
      static entity = 'groupables'
      static primaryKey = ['groupId', 'groupableId', 'groupableType']

      static fields () {
        return {
          groupId: this.attr(null),
          groupableId: this.attr(null),
          groupableType: this.string(''),
        }
      }
    }

    useRepo(Contact).save({
      id: 1,
      user: {
        id: 1,
        prename: 'blub',
        groups: [{
          id: 1,
          name: 'hoho',
        }],
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
      groupables: {
        '[1,1,"users"]': { groupId: 1, groupableId: 1, groupableType: 'users' },
      },
    })
  })

  it('inserts "morph to many" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'belongsToManyId'

      @Num(0) belongsToManyId!: number
      @MorphToMany(() => Role, () => Roleable, 'roleId', 'rolableId', 'rolableType')
      permissions!: Role
    }

    class Role extends Model {
      static entity = 'roles'

      static primaryKey = 'newRoleId'

      @Num(0) newRoleId!: number
    }

    class Roleable extends Model {
      static entity = 'rolables'

      static primaryKey = ['roleId', 'rolableId', 'rolableType']

      @Attr(null) declare roleId: number | null
      @Attr(null) declare rolableId: number | null
      @Str('') declare rolableType: number | null
      @Attr(null) declare level: number | null
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
      rolables: {
        '[1,1,"users"]': { roleId: 1, rolableId: 1, rolableType: 'users', level: 1 },
        '[2,1,"users"]': { roleId: 2, rolableId: 1, rolableType: 'users', level: null },
        '[2,2,"users"]': { roleId: 2, rolableId: 2, rolableType: 'users', level: null },
      },
    })
  })
})
