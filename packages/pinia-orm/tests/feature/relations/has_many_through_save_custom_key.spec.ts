import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasManyThrough, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many through" relation with custom primary key', () => {
    class Country extends Model {
      static entity = 'countries'

      static primaryKey = 'countryId'

      @Attr() countryId!: number
      @HasManyThrough(() => Post, () => User, 'countryId', 'userId', 'countryId')
      posts!: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') title!: string
    }

    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() countryId!: number
      @Str('') name!: string
    }

    const countryRepo = useRepo(Country)

    countryRepo.save({
      countryId: 1,
      posts: [
        { id: 1, userId: 1, title: '100' },
        { id: 2, userId: 1, title: '200' },
      ],
    })

    assertState({
      countries: {
        1: { countryId: 1 },
      },
      posts: {
        1: { id: 1, userId: 1, title: '100' },
        2: { id: 2, userId: 1, title: '200' },
      },
    })
  })

  it('inserts "has many through" relation with custom local key', () => {
    class Country extends Model {
      static entity = 'countries'

      static primaryKey = 'countryId'

      @Attr() countryId!: number
      @HasManyThrough(() => Post, () => User, 'countryId', 'userId', 'countryId', 'postId')
      posts!: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'postId'

      @Attr() postId!: number
      @Attr() userId!: number
      @Str('') title!: string
    }

    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() countryId!: number
      @Str('') name!: string
    }

    const countryRepo = useRepo(Country)
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe', countryId: 1 },
    ])

    countryRepo.save({
      countryId: 1,
      posts: [
        { postId: 1, userId: 1, title: '100' },
        { postId: 2, userId: 1, title: '200' },
      ],
    })

    assertState({
      countries: {
        1: { countryId: 1 },
      },
      users: {
        1: { id: 1, name: 'John Doe', countryId: 1 },
      },
      posts: {
        1: { postId: 1, userId: 1, title: '100' },
        2: { postId: 2, userId: 1, title: '200' },
      },
    })
  })
})
