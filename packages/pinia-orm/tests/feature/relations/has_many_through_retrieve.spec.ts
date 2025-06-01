import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, HasManyThrough, Str } from '../../../src/decorators'
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

  it('can retrieve multi-level "has many through" relations with manual comparison', () => {
    // Extend the Country model with a direct relationship to users to manifest the difference
    class ExtendedCountry extends Country {
      @HasMany(() => User, 'countryId')
      declare users: User[]
    }

    // Extend the User model with a direct relationship to posts to manifest the difference
    class ExtendedUser extends User {
      @HasMany(() => Post, 'userId')
      declare posts: Post[]
    }

    const countryRepo = useRepo(ExtendedCountry)

    // Set up test data with:
    // - 2 countries
    // - 3 users (2 in country 1, 1 in country 2)
    // - 5 posts (3 from user 1, 1 from user 2, 1 from user 3)
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
        3: { id: 3, userId: 1, title: 'Title 03' },
        4: { id: 4, userId: 2, title: 'Title 04' },
        5: { id: 5, userId: 3, title: 'Title 05' },
      },
    })

    // Register the extended user model to make posts accessible
    useRepo(ExtendedUser)

    // Retrieve country with all related data
    const country = countryRepo.withAllRecursive().first()!

    // Verify the country is retrieved correctly
    expect(country.id).toBe(1)

    // Verify users are retrieved correctly
    expect(country.users.length).toBe(2)

    // Verify posts are retrieved correctly through HasManyThrough
    expect(country.posts.length).toBe(4) // Should include all posts from all users in country 1

    // Manually retrieve all posts through users to compare
    const manualPosts = country.users.flatMap((user) => {
      // Cast user to ExtendedUser to access posts
      return (user as unknown as ExtendedUser).posts
    })

    // Compare the manual retrieval with the HasManyThrough relationship
    // This tests that HasManyThrough correctly retrieves all related models
    expect(country.posts.length).toEqual(manualPosts.length)

    // Verify all expected post IDs are present
    const postIds = country.posts.map(post => post.id).sort()
    expect(postIds).toEqual([1, 2, 3, 4])
  })
})
