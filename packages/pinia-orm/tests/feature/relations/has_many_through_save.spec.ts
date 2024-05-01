import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasManyThrough, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_many_through_save', () => {
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

  it('saves a model to the store with "has many through" relation', () => {
    const postsRepo = useRepo(Post)
    const countryRepo = useRepo(Country)

    postsRepo.save({ id: 1, userId: 1, title: 'Title 01' })

    countryRepo.save({
      id: 1,
      posts: [
        { id: 1, userId: 1, title: '100' },
        { id: 2, userId: 1, title: '200' },
      ],
    })

    assertState({
      countries: {
        1: { id: 1 },
      },
      posts: {
        1: { id: 1, userId: 1, title: '100' },
        2: { id: 2, userId: 1, title: '200' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const countryRepo = useRepo(Country)

    countryRepo.save({
      id: 1,
    })

    assertState({
      countries: {
        1: { id: 1 },
      },
    })
  })
})
