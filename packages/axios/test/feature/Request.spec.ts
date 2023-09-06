import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Model } from 'pinia-orm'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { useApiRepo, assertState } from '../helpers'

describe('Feature - Request', () => {
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

  it('`get` can perform a get request', async () => {
    mock.onGet('/api/users').reply(200, [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const userStore = useApiRepo(User)

    await userStore.api().get('/api/users')

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`get` can perform a get request with additional config', async () => {
    mock.onGet('/api/users').reply(200, {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const userStore = useApiRepo(User)

    await userStore.api().get('/api/users', { dataKey: 'data' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`post` can perform a post request', async () => {
    mock.onPost('/api/users').reply(200, [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const userStore = useApiRepo(User)

    await userStore.api().post('/api/users')

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`post` can perform a post request with additional config', async () => {
    mock.onPost('/api/users').reply(200, {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const userStore = useApiRepo(User)

    await userStore.api().post('/api/users', {}, { dataKey: 'data' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`put` can perform a put request', async () => {
    mock.onPut('/api/users').reply(200, [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const userStore = useApiRepo(User)

    await userStore.api().put('/api/users')

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`put` can perform a put request with additional config', async () => {
    mock.onPut('/api/users').reply(200, {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const userStore = useApiRepo(User)

    await userStore.api().put('/api/users', {}, { dataKey: 'data' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`patch` can perform a patch request', async () => {
    mock.onPatch('/api/users').reply(200, [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const userStore = useApiRepo(User)

    await userStore.api().patch('/api/users')

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`patch` can perform a patch request with additional config', async () => {
    mock.onPatch('/api/users').reply(200, {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const userStore = useApiRepo(User)

    await userStore.api().patch('/api/users', {}, { dataKey: 'data' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`delete` can perform a delete request', async () => {
    mock.onDelete('/api/users').reply(200, [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const userStore = useApiRepo(User)

    await userStore.api().delete('/api/users')

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('`delete` can perform a delete request with additional config', async () => {
    mock.onDelete('/api/users').reply(200, {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const userStore = useApiRepo(User)

    await userStore.api().delete('/api/users', { dataKey: 'data' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' }
      }
    })
  })

  it('throws error if `axios` is not set', async () => {
    mock.onGet('/api/users').reply(200, { id: 1, name: 'John Doe' })

    const userStore = useApiRepo(User)

    const response = await userStore.api().get('/api/users')

    try {
      await response.delete()
    } catch (e) {
      expect(e.message).toBe(
        '[Vuex ORM Axios] Could not delete records because the `delete` option is not set.'
      )

      return
    }

    throw new Error('Error was not thrown')
  })
})
