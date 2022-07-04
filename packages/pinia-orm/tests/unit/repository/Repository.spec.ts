import { describe, it, expect } from 'vitest'

import { Model, Attr, Str, Repository, useRepo } from '../../../src'
import { assertModel } from '../../helpers'

describe('unit/repository/Repository', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('John Doe') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: any
    @Str('Title 001') title!: string
  }

  it('creates a new model instance', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make()

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance in a new database', () => {
    const connection = 'test_namespace'
    const userRepo = useRepo(User, undefined, connection)
    const user = userRepo.make()

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: null, name: 'John Doe' })

    // Fetches the same atabase on 2nd call.
    const user2 = userRepo.make()
    assertModel(user2, { id: null, name: 'John Doe' })
  })

  it('creates a new model instance with default values', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      name: 'Jane Doe',
    })

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 1, name: 'Jane Doe' })
  })

  it('can create a new repository from the model', () => {
    const userRepo = useRepo(User)

    const postRepo = userRepo.repo(Post)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })

  it('can create a new repository from the custom repository', () => {
    class PostRepository extends Repository<Post> {
      use = Post
    }

    const userRepo = useRepo(User)

    const postRepo = userRepo.repo(PostRepository)

    expect(postRepo.getModel()).toBeInstanceOf(Post)
  })
})
