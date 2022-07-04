import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect } from 'vitest'
import { createApp } from 'vue-demi'

import PiniaOrm, { Model, Attr, Str, Repository, mapRepos } from '../../../src'

describe('feature/helpers/helpers', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  class UserRepository extends Repository<User> {
    use = User
  }

  it.skip('can map repositories from models in Vue components', () => {
    const app = createApp({
      computed: {
        ...mapRepos({
          userRepo: User,
        }),
      },
    })

    const pinia = createPinia()
    pinia.use(PiniaOrm.install())
    app.use(pinia)
    setActivePinia(pinia)

    console.log(app)
    expect(app.userRepo).toBeInstanceOf(Repository)
    expect(app.userRepo.getModel()).toBeInstanceOf(User)
  })

  it.skip('can map repositories from abstract repositories in Vue components', async () => {
    const app = createApp({
      computed: {
        ...mapRepos({
          userRepo: UserRepository,
        }),
      },
    })

    const pinia = createPinia()
    pinia.use(PiniaOrm.install())
    app.use(pinia)
    setActivePinia(pinia)

    expect(app.userRepo).toBeInstanceOf(Repository)
    expect(app.userRepo.getModel()).toBeInstanceOf(User)
  })

  it.skip('can map repositories in Vue components using spread syntax', async () => {
    const app = createApp({
      computed: {
        ...mapRepos({
          userRepo: User,
        }),
      },
    })

    const pinia = createPinia()
    pinia.use(PiniaOrm.install())
    app.use(pinia)
    setActivePinia(pinia)

    expect(app.userRepo).toBeInstanceOf(Repository)
    expect(app.userRepo.getModel()).toBeInstanceOf(User)
  })
})
