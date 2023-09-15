import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Model } from 'pinia-orm'
import { describe, it, beforeEach, afterEach } from 'vitest'
import { assertState } from '../helpers'
import { useAxiosRepo } from '../../src'

describe('Feature - Request - Delete', () => {
  let mock: MockAdapter

  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })
  afterEach(() => {
    mock.reset()
  })

  it('can delete a record after the api call', async () => {
    mock.onDelete('/users/1').reply(200, { ok: true })

    const userStore = useAxiosRepo(User)

    userStore.save([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ])

    await userStore.api().request({
      method: 'delete',
      url: '/users/1',
      delete: 1
    })

    assertState({
      users: {
        2: { id: 2, name: 'Jane' }
      }
    })
  })
})
