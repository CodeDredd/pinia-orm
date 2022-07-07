import { describe, it } from 'vitest'

import { Attr, HasMany, Model, Str, useRepo } from '../../../../src'
import { assertModels } from '../../../helpers'

describe('feature/relations/lazy_loads/lazy_eager_load', () => {
  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') title!: string
  }

  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
      posts!: Post[]
  }

  it('can lazy eager load relations', async () => {
    const usersRepo = useRepo(User)
    const postsRepo = useRepo(Post)

    usersRepo.save({ id: 1, name: 'John Doe' })
    postsRepo.save([
      { id: 1, userId: 1, title: 'Title 01' },
      { id: 2, userId: 1, title: 'Title 02' },
    ])

    const users = usersRepo.all()

    assertModels(users, [{ id: 1, name: 'John Doe' }])

    usersRepo.with('posts').load(users)

    assertModels(users, [
      {
        id: 1,
        name: 'John Doe',
        posts: [
          { id: 1, userId: 1, title: 'Title 01' },
          { id: 2, userId: 1, title: 'Title 02' },
        ],
      },
    ])
  })
})
