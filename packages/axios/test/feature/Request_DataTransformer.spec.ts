import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Model } from 'pinia-orm'
import { describe, it, beforeEach, afterEach } from 'vitest'
import { assertState } from '../helpers'
import { useApiRepo } from '../../src'

describe('Feature - Request - Data Transformer', () => {
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

  it('can specify a callback to transform the response', async () => {
    mock.onGet('/users').reply(200, {
      data: { id: 1, name: 'John Doe' }
    })

    const userStore = useApiRepo(User)

    await userStore.api().request({
      url: '/users',
      dataTransformer: ({ data }) => data.data
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })
})
