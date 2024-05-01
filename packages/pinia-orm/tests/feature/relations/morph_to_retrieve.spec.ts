import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphTo, Num, Str } from '../../../src/decorators'
import { assertModel } from '../../helpers'

describe('feature/relations/morph_to_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Str('') title!: string
  }

  class Image extends Model {
    static entity = 'images'

    @Num(0) id!: number
    @Str('') url!: string
    @Attr() imageableId!: number
    @Attr() imageableType!: string
    @MorphTo(() => [User, Post], 'imageableId', 'imageableType')
      imageable!: User | Post | null
  }

  const MORPH_TO_ENTITIES = {
    users: { id: 1, name: 'John Doe' },
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

  it('can eager load morph to relation', () => {
    const usersRepo = useRepo(User)
    const postsRepo = useRepo(Post)
    const imagesRepo = useRepo(Image)

    usersRepo.save(MORPH_TO_ENTITIES.users)
    postsRepo.save(MORPH_TO_ENTITIES.posts)
    imagesRepo.save(MORPH_TO_ENTITIES.images)

    const userImage = imagesRepo.with('imageable').first()!
    const postImage = imagesRepo.where('id', 2).with('imageable').first()!

    // Assert User Image
    expect(userImage).toBeInstanceOf(Image)
    expect(userImage.imageable).toBeInstanceOf(User)
    assertModel(userImage, {
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' },
    })

    // Assert Post Image
    expect(postImage).toBeInstanceOf(Image)
    expect(postImage.imageable).toBeInstanceOf(Post)
    assertModel(postImage, {
      id: 2,
      url: '/post.jpg',
      imageableId: 1,
      imageableType: 'posts',
      imageable: { id: 1, title: 'Hello, world!' },
    })
  })

  it('can eager load morph to relation with constraints', () => {
    const usersRepo = useRepo(User)
    const postsRepo = useRepo(Post)
    const imagesRepo = useRepo(Image)

    usersRepo.save(MORPH_TO_ENTITIES.users)
    postsRepo.save(MORPH_TO_ENTITIES.posts)
    imagesRepo.save(MORPH_TO_ENTITIES.images)

    const limitOrderedImages = imagesRepo
      .limit(2)
      .orderBy('id', 'desc')
      .with('imageable', (query) => {
        query.where('id', 2)
      })
      .get()!

    expect(limitOrderedImages.length).toBe(2)
    assertModel(limitOrderedImages[0], {
      id: 3,
      url: '/post2.jpg',
      imageableId: 2,
      imageableType: 'posts',
      imageable: { id: 2, title: 'Hello, world! Again!' },
    })
    assertModel(limitOrderedImages[1], {
      id: 2,
      url: '/post.jpg',
      imageableId: 1,
      imageableType: 'posts',
      imageable: null,
    })
  })

  it('can eager load missing relation as `null`', () => {
    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
    })

    const image = imagesRepo.with('imageable').first()!
    expect(image).toBeInstanceOf(Image)
    assertModel(image, {
      id: 1,
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: null,
    })
  })

  it('ignores the relation with the empty foreign key', () => {
    const usersRepo = useRepo(User)
    const imagesRepo = useRepo(Image)

    usersRepo.save({ id: 1, name: 'John Doe' })
    imagesRepo.save({
      id: 1,
      url: '/profile.jpg',
    })

    const image = imagesRepo.with('imageable').first()!
    expect(image).toBeInstanceOf(Image)
    assertModel(image, {
      id: 1,
      url: '/profile.jpg',
      imageableId: null,
      imageableType: null,
      imageable: null,
    })
  })
})
