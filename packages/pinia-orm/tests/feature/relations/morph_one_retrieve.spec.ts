import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { MorphOne, Num, Str } from '../../../src/decorators'
import { assertModel } from '../../helpers'

describe('feature/relations/morph_one_retrieve', () => {
  class Image extends Model {
    static entity = 'images'

    @Num(0) id!: number
    @Str('') url!: string
    @Num(0) imageableId!: number
    @Str('') imageableType!: string
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Str('') title!: string
    @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null
  }

  const ENTITIES = {
    users: [{ id: 1, name: 'John Doe' }],
    posts: [
      { id: 1, title: 'Hello, world!' },
      { id: 2, title: 'Hello, world! Again!' },
    ],
    images: [
      {
        id: 1,
        url: '/profile.jpg',
        imageableId: 1,
        imageableType: 'users',
      },
      {
        id: 2,
        url: '/post.jpg',
        imageableId: 1,
        imageableType: 'posts',
      },
      {
        id: 3,
        url: '/post2.jpg',
        imageableId: 2,
        imageableType: 'posts',
      },
    ],
  }

  describe('when there are images', () => {
    it('can eager load morph one relation for user', () => {
      const usersRepo = useRepo(User)
      const postsRepo = useRepo(Post)
      const imagesRepo = useRepo(Image)

      usersRepo.save(ENTITIES.users)
      postsRepo.save(ENTITIES.posts)
      imagesRepo.save(ENTITIES.images)

      const user = usersRepo.with('image').first()!

      expect(user).toBeInstanceOf(User)
      expect(user.image).toBeInstanceOf(Image)
      assertModel(user, {
        id: 1,
        name: 'John Doe',
        image: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      })
    })

    it('can eager load morph one relation for post', () => {
      const usersRepo = useRepo(User)
      const postsRepo = useRepo(Post)
      const imagesRepo = useRepo(Image)

      usersRepo.save(ENTITIES.users)
      postsRepo.save(ENTITIES.posts)
      imagesRepo.save(ENTITIES.images)

      const post = postsRepo.with('image').first()!

      expect(post).toBeInstanceOf(Post)
      expect(post.image).toBeInstanceOf(Image)
      assertModel(post, {
        id: 1,
        title: 'Hello, world!',
        image: {
          id: 2,
          url: '/post.jpg',
          imageableId: 1,
          imageableType: 'posts',
        },
      })
    })
  })

  describe('when there are no images', () => {
    it('can eager load missing relation as `null`', () => {
      const usersRepo = useRepo(User)

      usersRepo.save({ id: 1, name: 'John Doe' })

      const user = usersRepo.with('image').first()!

      expect(user).toBeInstanceOf(User)
      assertModel(user, {
        id: 1,
        name: 'John Doe',
        image: null,
      })
    })
  })
})
