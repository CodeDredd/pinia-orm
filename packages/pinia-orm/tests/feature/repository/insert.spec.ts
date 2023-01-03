import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/repository/insert', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() declare id: any
    @Str('') declare name: string
    @HasMany(() => Post, 'userId') declare posts: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) declare id: number
    @Attr() declare userId: number
    @Str('') declare title: string
  }

  it('inserts a record to the store', () => {
    const userRepo = useRepo(User)

    userRepo.insert({ id: 1, name: 'John Doe' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('inserts records to the store', () => {
    const userRepo = useRepo(User)

    userRepo.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })
  })

  it('does nothing if the given data is an empty array', () => {
    const userRepo = useRepo(User)

    userRepo.insert([])
    assertState({})
  })

  it('inserts with relation', () => {
    const userRepo = useRepo(User)

    userRepo.insert({ id: 1, name: 'John Doe', posts: [{ id: 1, title: 'New Post' }] })
    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'New Post' },
      },
    })
  })

  it('throws a warning if the same ids are inserted', () => {
    const userRepo = useRepo(User)
    const logger = vi.spyOn(console, 'warn')

    userRepo.insert({ id: 1, name: 'John Doe', posts: [{ id: 1, title: 'New Post' }] })
    userRepo.insert({ id: 1, name: 'John Doe2', posts: [{ id: 1, title: 'New Post 2' }] })

    expect(logger).toBeCalledTimes(2)
    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'New Post' },
      },
    })
  })
})
