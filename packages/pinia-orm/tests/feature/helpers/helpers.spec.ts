import { PiniaVuePlugin, createPinia } from 'pinia'
import Vue from 'vue2'
import { describe, expect, it } from 'vitest'

import { Attr, Model, Repository, Str, createORM, mapRepos } from '../../../src'

/* eslint vue/one-component-per-file:0 */
describe('feature/helpers/helpers', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  Vue.use(PiniaVuePlugin)

  class UserRepository extends Repository<User> {
    use = User
  }

  it('can map repositories from models in Vue components', () => {
    const pinia = createPinia()
    pinia.use(createORM)

    const vm = new Vue({
      pinia,
      computed: mapRepos({
        userRepo: User,
      }),
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })

  it('can map repositories from abstract repositories in Vue components', async () => {
    const pinia = createPinia()
    pinia.use(createORM)

    const vm = new Vue({
      pinia,
      computed: {
        ...mapRepos({
          userRepo: UserRepository,
        }),
      },
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })

  it('can map repositories in Vue components using spread syntax', async () => {
    const pinia = createPinia()
    pinia.use(createORM)

    const vm = new Vue({
      pinia,
      computed: {
        ...mapRepos({
          userRepo: User,
        }),
      },
    })

    expect(vm.userRepo).toBeInstanceOf(Repository)
    expect(vm.userRepo.getModel()).toBeInstanceOf(User)
  })
})
