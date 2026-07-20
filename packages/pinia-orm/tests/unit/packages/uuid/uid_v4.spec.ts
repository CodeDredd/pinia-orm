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

      @Uid() id!: string
      @Str('') name!: string
      @HasMany(() => Todo, 'userId') todos!: Todo[]
    }

    class Todo extends Model {
      static entity = 'todos'

      @Uid() id!: string
      @Attr(null) userId!: string
    }

    mockUuidV4(['uid23'])

    useRepo(User).save({ name: 'Test' })

    expect(useRepo(User).all().length).toBe(1)
  })

  it('returns unique non secure id with cast', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.uid()
        }
      }

      static casts () {
        return {
          id: UidCast
        }
      }
    }

    mockUuidV4(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})
