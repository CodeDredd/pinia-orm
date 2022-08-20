import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'

describe('feature/repository/retrieves_has_or', () => {
  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Attr() userId!: number
    @Str('') title!: string
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
      posts!: Post[]
  }

  it('can filter by "or has" clause', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.orHas('posts', '=', 1).where('name', 'Johnny Doe').get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "or doesnt have" clause', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.orDoesntHave('posts').where('name', 'Jane Doe').get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "or where has" clauses with closure', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 03' },
        2: { id: 2, userId: 1, title: 'Title 03' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo
      .orWhereHas('posts', (query) => {
        query.where('title', 'Title 03')
      }, '=', 1)
      .where('name', 'Johnny Doe')
      .get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "or where doesnt have has" clause with closure', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 03' },
        2: { id: 2, userId: 1, title: 'Title 03' },
        3: { id: 3, userId: 2, title: 'Title 02' },
      },
    })

    const users = userRepo
      .orWhereDoesntHave('posts', (query) => {
        query.where('title', 'Title 03')
      })
      .where('name', 'Johnny Doe')
      .get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
