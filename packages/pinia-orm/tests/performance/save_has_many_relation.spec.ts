import { describe, it } from 'vitest'

import { HasMany, Model, Num, Str, useRepo } from '../../src'

describe('performance/save_has_many_relation', () => {
  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Num(0) userId!: number
    @Str('') title!: string
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  it('saves data with has many relation within decent time', () => {
    const userRepo = useRepo(User)

    const users = []

    for (let i = 1; i <= 10000; i++) {
      users.push({
        id: i,
        name: `Username ${i}`,
        posts: [{ id: i, title: `Title ${i}` }]
      })
    }

    console.time('time')
    userRepo.save(users)
    console.timeEnd('time')
  })
})
