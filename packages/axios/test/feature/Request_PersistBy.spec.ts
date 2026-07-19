import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Model, useRepo } from 'pinia-orm'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { assertState } from '../helpers'
import { useAxiosRepo } from '../../src'

describe('Feature - Request - Persist By', () => {
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

  it('replaces all existing records with `persistBy: fresh`', async () => {
    useRepo(User).save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Deleted Elsewhere' },
    ])

    mock.onGet('/users').reply(200, [
      { id: 1, name: 'John Doe' },
      { id: 3, name: 'Jane Doe' },
    ])

    const userStore = useAxiosRepo(User)

    const result = await userStore.api().get('/users', {
      persistBy: 'fresh',
    })

    expect(result.entities).toHaveLength(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Jane Doe' },
      },
    })
  })

  it('inserts records with `persistBy: insert`', async () => {
    useRepo(User).save({ id: 1, name: 'John Doe' })

    mock.onGet('/users').reply(200, [
      { id: 2, name: 'Jane Doe' },
    ])

    const userStore = useAxiosRepo(User)

    await userStore.api().get('/users', {
      persistBy: 'insert',
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })
  })
})
