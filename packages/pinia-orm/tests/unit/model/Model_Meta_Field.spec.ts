import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'

describe('unit/model/Model_Meta_Field', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should display meta data', () => {
    class User extends Model {
      static entity = 'users'

      static config = {
        withMeta: true,
      }

      @Str('') declare name: string
      @Str('') declare username: string
    }
    const user = new User({ name: 'Test', username: 'John' }, { operation: 'set', action: 'save' })

    expect(user.name).toBe('Test')
    expect(user._meta).toHaveProperty('createdAt')
  })

  it('should save all if fields are hidden', async () => {
    class User extends Model {
      static entity = 'users'

      static config = {
        withMeta: true,
      }

      @Attr(0) declare id: string
      @Str('') declare name: string
      @Str('') declare username: string
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    await new Promise(resolve => setTimeout(resolve, 2000))

    userRepo.save({
      id: 1,
      name: 'John2',
      username: 'JD2',
    })

    const user2 = userRepo.withMeta().find(1)

    expect(user2?._meta?.createdAt).toBeLessThan(user2?._meta?.updatedAt as number)
  })
})
