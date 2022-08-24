import { describe, expect, it } from 'vitest'
import { Model, useRepo } from '../../src'
import { Attr, Str } from '../../src/decorators'
import { createPiniaORM } from '../helpers'

describe('unit/PiniaORM', () => {
  class User extends Model {
    static entity = 'users'

    @Attr(0) declare id: number
    @Str('') declare name: string
    @Str('') declare username: string
  }

  it('pass config "model.withMeta"', () => {
    createPiniaORM({ model: { withMeta: true } })

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.find(1)?._meta).toBe(undefined)
    expect(userRepo.withMeta().find(1)?._meta).toHaveProperty('createdAt')
  })

  it('pass config "model.hidden"', () => {
    createPiniaORM({ model: { hidden: ['username'] } })

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.find(1)?.username).toBe(undefined)
    expect(userRepo.find(1)?.name).toBe('John')
  })

  it('pass config "model.visible"', () => {
    Model.clearRegistries()
    class User extends Model {
      static entity = 'users'

      @Attr(0) declare id: number
      @Str('') declare name: string
      @Str('') declare username: string
    }

    createPiniaORM({ model: { visible: ['name'] } })

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.find(1)?.username).toBe(undefined)
    expect(userRepo.find(1)?.name).toBe('John')
  })
})
