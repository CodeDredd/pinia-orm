import { describe, expect, it } from 'vitest'
import { Model, useRepo } from '../../src'
import { Attr, BelongsTo, Num, Str } from '../../src/decorators'
import { createPiniaORM } from '../helpers'
import { WeakCache } from '../../src/cache/WeakCache'

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

    const userMeta = userRepo.find(1)?._meta
    const userMeta2 = userRepo.withMeta().find(1)?._meta

    expect(userMeta).toBe(undefined)
    expect(userMeta2).toHaveProperty('createdAt')
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

  it('pass config "cache false"', () => {
    createPiniaORM({ cache: false })

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.cache()).toBe(undefined)
  })

  it('pass config "cache true"', () => {
    createPiniaORM({ cache: true })

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.cache()).toBeInstanceOf(WeakCache)
  })

  it('pass config "cache.shared false"', () => {
    createPiniaORM({
      cache: {
        shared: false,
      },
    })

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.cache()).toBeInstanceOf(WeakCache)
  })

  it('can a pass a namespace for each model', () => {
    createPiniaORM({ model: { namespace: 'orm' } })

    const userRepo = useRepo(User)
    const user = userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(user.$storeName()).toBe('orm/users')
  })

  it('can overwrite namespace for a model', () => {
    class User extends Model {
      static entity = 'users'

      static namespace = 'otherOrm'

      @Attr(0) declare id: number
      @Str('') declare name: string
      @Str('') declare username: string
    }
    createPiniaORM({ model: { namespace: 'orm' } })

    const userRepo = useRepo(User)
    const user = userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(user.$storeName()).toBe('otherOrm/users')
  })

  it('make is using the correct namespace', () => {
    class User2 extends Model {
      static entity = 'users'

      static namespace = 'orm'

      @Attr(0) declare id: number
      @Str('') declare prename: string
      @Num('') declare age: number
    }

    class User extends Model {
      static entity = 'users'

      static namespace = 'otherOrm'

      @Attr(0) declare id: number
      @Str('') declare name: string
      @Str('') declare username: string
      @Attr() declare user_id: number
      @BelongsTo(() => User2, 'user_id') user: User2
    }
    createPiniaORM({ model: { namespace: 'orm' } })

    const userRepo = useRepo(User)
    const user = userRepo.make({
      id: 1,
      name: 'John',
      username: 'JD',
      user: {
        prename: 'John Doe',
        age: 30,
      },
    })

    expect(user.$storeName()).toBe('otherOrm/users')
    expect(user.user.$storeName()).toBe('orm/users')
    expect(user.user.username).toBe(undefined)
  })
})
