import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createPinia, setActivePinia } from 'pinia'
import { createApp } from 'vue'
import { Model, config, createORM } from 'pinia-orm'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { assertState } from '../helpers'
import { createPiniaOrmAxios, useAxiosRepo } from '../../src'

describe('Feature - Request - Global Config', () => {
  let mock: MockAdapter

  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
      }
    }
  }

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })
  afterEach(() => {
    mock.reset()
  })

  it('applies global plugin options like baseURL and dataKey on first repository use', async () => {
    // Simulate a freshly booted app where no repository has been used yet,
    // so the axios plugin has not been applied to the global config.
    delete config.axiosApi

    const app = createApp({})
    const pinia = createPinia()
    pinia.use(createORM({
      plugins: [
        createPiniaOrmAxios({
          axios,
          baseURL: 'https://example.com/api',
          dataKey: 'data',
        }),
      ],
    }))
    app.use(pinia)
    setActivePinia(pinia)

    mock.onGet('https://example.com/api/users').reply(200, {
      data: [{ id: 1, name: 'John Doe' }],
    })

    const userStore = useAxiosRepo(User)

    await userStore.api().get('/users')

    expect(mock.history.get[0].baseURL).toBe('https://example.com/api')

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })
})
