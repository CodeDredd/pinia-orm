import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../../src'
import { Uid, UidCast } from '../../../../src/packages/uuid/v4'
import { mockUuidV4 } from '../../../helpers'
import { Attr, HasMany, Str } from '../../../../src/decorators'

describe('unit/packages/uuid/uid_v4', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('returns unique non secure id with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
        id!: string
    }

    mockUuidV4(['uid1'])

    expect(new User().id).toBe('uid1')
  })

  it('saves correctly with uid decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() declare id: string
      @Str('') declare name: string
      @HasMany(() => Todo, 'userId') declare todos: Todo[]
    }

    class Todo extends Model {
      static entity = 'todos'

      @Uid() declare id: string
      @Attr(null) declare userId: string
    }

    mockUuidV4(['uid23'])

    useRepo(User).save({ name: 'Test' })

    console.log(useRepo(User).all())

    expect(useRepo(User).all().length).toBe(1)
  })

  it('returns unique non secure id with cast', () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(''),
        }
      }

      static casts() {
        return {
          id: UidCast,
        }
      }
    }

    mockUuidV4(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})
