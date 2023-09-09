import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Model } from 'pinia-orm'
import { describe, it, beforeEach, afterEach } from 'vitest'
import { assertState } from '../helpers'
import { useApiRepo } from '../../src'
import type { Request, Response } from '../../src'

describe('Feature - Request - Actions', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })
  afterEach(() => {
    mock.reset()
  })

  it('can define a custom action', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static config = {
        api: {
          actions: {
            fetch: { method: 'get', url: '/users' }
          }
        }
      }
    }

    mock.onGet('/users').reply(200, { id: 1, name: 'John' })

    const userStore = useApiRepo(User)

    await userStore.api().fetch()

    assertState({
      users: {
        1: { id: 1, name: 'John' }
      }
    })
  })

  it('can define a custom action as a function', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static config = {
        api: {
          actions: {
            fetch (this: Request, url: string): Promise<Response> {
              return this.get(url)
            }
          }
        }
      }
    }

    mock.onGet('/users').reply(200, { id: 1, name: 'John' })

    const userStore = useApiRepo(User)

    await userStore.api().fetch('/users')

    assertState({
      users: {
        1: { id: 1, name: 'John' }
      }
    })
  })
})
