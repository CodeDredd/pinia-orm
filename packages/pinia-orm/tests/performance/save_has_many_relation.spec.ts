import { describe, it } from 'vitest'

import { Model, useRepo } from '../../src'
import { HasMany, Num, Str } from '../../src/decorators'

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
        posts: [{ id: i, title: `Title ${i}` }],
      })
    }

    console.time('time')
    userRepo.save(users)
    console.timeEnd('time')
  //   console.log('Get Speed test for 10k saved items and 5 queries')
  //   console.time('get(): with cache')
  //   for (let i = 1; i <= 5; i++) {
  //     console.time(`time query ${i}`)
  //     userRepo.with('posts').get()
  //     console.timeEnd(`time query ${i}`)
  //   }
  //   console.timeEnd('get(): with cache')
  //   console.log(userRepo.cache().size)
  //   console.log(useRepo(User).cache().size)
  //   console.log(useRepo(Post).cache().size)
  //
  //   console.time('get(): without cache')
  //   for (let i = 1; i <= 5; i++) {
  //     console.time(`time query without ${i}`)
  //     userRepo.with('posts').useCache(false).get()
  //     console.timeEnd(`time query without ${i}`)
  //   }
  //   console.timeEnd('get(): without cache')
  //   console.log(userRepo.cache().size)
  //   console.log(useRepo(User).cache().size)
  //   console.log(useRepo(Post).cache().size)
  })
})
