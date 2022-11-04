import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, HasOne, MorphMany, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'
import { OnDelete } from '../../../src/model/decorators/OnDelete'

describe('feature/repository/delete_with_relations', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('deletes a record with its relations nested', () => {
    class SuperImage extends Model {
      static entity = 'superImages'

      @Num(0) declare id: number
      @Num(0) declare postId: number
      @Str('') declare title: string
    }

    class Image extends Model {
      static entity = 'images'

      @Num(0) declare id: number
      @Num(0) declare postId: number
      @Str('') declare title: string
    }
    class Comment extends Model {
      static entity = 'comments'

      @Num(0) declare id: number
      @Num(0) declare postId: number
      @Str('') declare title: string
    }

    class Post extends Model {
      static entity = 'posts'

      @Num(0) declare id: number
      @Num(0) declare userId: number
      @Str('') declare title: string

      @HasMany(() => Comment, 'postId')
      @OnDelete('cascade')
      declare comments: Comment[]

      @HasOne(() => SuperImage, 'postId')
      @OnDelete('set null')
      declare specialImage: SuperImage | null

      @HasMany(() => Image, 'postId')
      declare images: Image[]
    }

    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string

      @HasMany(() => Post, 'userId')
      @OnDelete('cascade')
      posts!: Post[]
    }

    const usersRepo = useRepo(User)

    usersRepo.save([{
      id: 1,
      name: 'John Doe',
      posts: [
        {
          id: 1,
          title: 'Title 01',
          comments: [
            { id: 3, title: 'Title 03' },
            { id: 4, title: 'Title 04' },
          ],
        },
        { id: 2, title: 'Title 02' },
      ],
    },
    {
      id: 2,
      name: 'Johnny Doe',
      posts: [
        {
          id: 3,
          title: 'Title 03',
          comments: [
            { id: 1, title: 'Title 01' },
            { id: 2, title: 'Title 02' },
          ],
          specialImage: { id: 5, title: 'Title 05' },
          images: [
            { id: 1, title: 'Image 01' },
            { id: 2, title: 'Image 02' },
          ],
        },
        { id: 4, title: 'Title 04' },
      ],
    }])

    usersRepo.destroy(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
      },
      comments: {
        3: { id: 3, postId: 1, title: 'Title 03' },
        4: { id: 4, postId: 1, title: 'Title 04' },
      },
      images: {
        1: { id: 1, postId: 3, title: 'Image 01' },
        2: { id: 2, postId: 3, title: 'Image 02' },
      },
      superImages: {
        5: { id: 5, postId: null, title: 'Title 05' },
      },
    })
  })

  it('works with morph relations', () => {
    class Comment extends Model {
      static entity = 'comments'

      @Num(0) id!: number
      @Str('') body!: string
      @Attr(null) commentableId!: number | null
      @Attr(null) commentableType!: string | null
    }

    class Video extends Model {
      static entity = 'videos'

      @Num(0) id!: number
      @Str('') link!: string

      @MorphMany(() => Comment, 'commentableId', 'commentableType')
      @OnDelete('set null')
      declare comments: Comment[]
    }

    const videoRepo = useRepo(Video)

    videoRepo.save([
      {
        id: 1,
        link: '/video.mp4',
        comments: [
          {
            id: 1,
            commentableId: 1,
            commentableType: 'videos',
            body: 'Cool Video!',
          },
          {
            id: 2,
            commentableId: 1,
            commentableType: 'videos',
            body: 'Cool Video Again!',
          },
        ],
      },
      {
        id: 2,
        link: '/video.mp4',
        comments: [
          {
            id: 3,
            commentableId: 2,
            commentableType: 'videos',
            body: 'Cool Video!',
          },
          {
            id: 4,
            commentableId: 2,
            commentableType: 'videos',
            body: 'Cool Video Again!',
          },
        ],
      },
    ])

    videoRepo.destroy(2)

    assertState({
      videos: {
        1: { id: 1, link: '/video.mp4' },
      },
      comments: {
        1: {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video!',
        },
        2: {
          id: 2,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video Again!',
        },
        3: {
          id: 3,
          commentableId: null,
          commentableType: null,
          body: 'Cool Video!',
        },
        4: {
          id: 4,
          commentableId: null,
          commentableType: null,
          body: 'Cool Video Again!',
        },
      },
    })
  })
})
