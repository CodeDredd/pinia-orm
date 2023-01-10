import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasManyThrough, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel, fillState } from '../../helpers'

describe('feature/relations/has_many_through_retrieve', () => {
  class Country extends Model {
    static entity = 'countries'

    @Attr() declare id: number
    @HasManyThrough(() => Post, () => User, 'countryId', 'userId')
    declare posts: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() declare id: number
    @Attr() declare userId: number
    @Str('') declare title: string
  }

  class User extends Model {
    static entity = 'users'

    @Attr() declare id: number
    @Attr() declare countryId: number
    @Str('') declare name: string
  }

  it('can eager load has many relation', () => {
    const countryRepo = useRepo(Country)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', countryId: 1 },
        2: { id: 2, name: 'Jane Doe', countryId: 1 },
        3: { id: 3, name: 'Johnny Doe', countryId: 2 },
      },
      countries: {
        1: { id: 1 },
        2: { id: 2 },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 3, title: 'Title 03' },
      },
    })

    const countries = countryRepo.with('posts').get()

    assertInstanceOf(countries, Country)
    assertInstanceOf(countries[0].posts, Post)
    assertModel(countries[0], {
      id: 1,
      posts: [
        { id: 1, userId: 1, title: 'Title 01' },
        { id: 2, userId: 1, title: 'Title 02' },
      ],
    })
    assertModel(countries[1], {
      id: 2,
      posts: [
        { id: 3, userId: 3, title: 'Title 03' },
      ],
    })
  })

  it('can eager load missing relation as empty array', () => {
    const countryRepo = useRepo(Country)

    countryRepo.save({ id: 1 })

    const user = countryRepo.with('posts').first()!

    expect(user).toBeInstanceOf(Country)
    assertModel(user, {
      id: 1,
      posts: [],
    })
  })

  it('can revive "has many through" relations', () => {
    const countryRepo = useRepo(Country)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', countryId: 1 },
        2: { id: 2, name: 'Jane Doe', countryId: 1 },
        3: { id: 3, name: 'Johnny Doe', countryId: 2 },
      },
      countries: {
        1: { id: 1 },
        2: { id: 2 },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 3, title: 'Title 03' },
      },
    })

    const schema = {
      id: '1',
      posts: [{ id: 2 }, { id: 1 }],
    }

    const country = countryRepo.revive(schema)!

    expect(country.posts.length).toBe(2)
    expect(country.posts[0]).toBeInstanceOf(Post)
    expect(country.posts[1]).toBeInstanceOf(Post)
    expect(country.posts[0].id).toBe(2)
    expect(country.posts[1].id).toBe(1)
  })
})
