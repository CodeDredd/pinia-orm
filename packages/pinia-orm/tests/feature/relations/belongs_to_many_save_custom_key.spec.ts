import { beforeEach, describe, expect, it } from 'vitest'
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

  it('inserts "belongs to many" relation with shared instance data', () => {
    const classes = [
      {
        id: 1,
        name: 'The Jedis',
      },
      {
        id: 2,
        name: 'Jedi Council',
      },
      {
        id: 3,
        name: 'Dark Forces',
      },
    ]

    const students = [
      {
        id: 1,
        name: 'Luke Skywalker',
        classes: [classes[0], classes[1], classes[2]],
      },
      {
        id: 2,
        name: 'Darth Vader',
        classes: [classes[0], classes[1], classes[2]],
      },
      {
        id: 3,
        name: 'Yoda',
        classes: [classes[0], classes[1], classes[2]],
      },
      {
        id: 4,
        name: 'Clone Trooper 0815',
        classes: [classes[0], classes[1], classes[2]],
      },
    ]

    class Class extends Model {
      static entity = 'classes'

      @Num(0)
      declare id: number

      @Str('')
      declare name: string
    }

    class Student extends Model {
      static entity = 'students'

      @Num(0)
      declare id: number

      @Str('')
      declare name: string

      @BelongsToMany(() => Class, () => StudentClass, 'student_id', 'class_id')
      declare classes: Class[]
    }

    class StudentClass extends Model {
      static entity = 'studentsClasses'

      static primaryKey = ['student_id', 'class_id']

      @Num(0)
      declare student_id: number

      @Num(0)
      declare class_id: number
    }

    const repo = useRepo(Student)
    repo.save(students)

    const data = repo.with('classes').get()
    data.forEach((students) => {
      expect(students.classes.length).toBe(3)
    })
  })
})
