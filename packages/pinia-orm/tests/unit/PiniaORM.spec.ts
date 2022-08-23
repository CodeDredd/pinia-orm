import { describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createApp } from 'vue-demi'
import { Model, createORM, useRepo } from '../../src'
import { Attr, Str } from '../../src/decorators'

describe('unit/PiniaORM', () => {
  class User extends Model {
    static entity = 'users'

    @Attr(0) declare id: number
    @Str('') declare name: string
    @Str('') declare username: string
  }

  it('pass a config so all models have meta', () => {
    const app = createApp({})
    const pinia = createPinia()
    pinia.use(createORM({ model: { withMeta: true } }))
    app.use(pinia)
    setActivePinia(pinia)

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John',
      username: 'JD',
    })

    expect(userRepo.find(1)?._meta).toHaveProperty('createdAt')
  })
})
