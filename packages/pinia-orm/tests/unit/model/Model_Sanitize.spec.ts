import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { HasMany, Num, Str } from '../../../src/decorators'

describe('unit/model/Model_Sanitize', () => {
  class Post extends Model {
    static entity = 'posts'
  }

  class User extends Model {
    static entity = 'users'

    @Num(null, { notNullable: true }) id!: number
    @Str('Unknown') name!: string
    @Num(0) age!: number

    @HasMany(() => Post, 'postId')
      posts!: Post[]
  }

  it('sanitizes the given record', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make()

    const data = user.$sanitize({
      id: 1,
      unknownField: 1,
      age: 10,
      posts: [1, 3],
    })

    const expected = {
      id: 1,
      age: 10,
    }

    expect(data).toEqual(expected)
  })

  it('sanitize the given record and fill missing fields', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make()

    const data = user.$sanitizeAndFill({ id: 1, posts: [1, 3] })

    const expected = {
      id: 1,
      name: 'Unknown',
      age: 0,
    }

    expect(data).toEqual(expected)
  })
})
