import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphMany, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel, fillState } from '../../helpers'

describe('feature/relations/morph_many_retrieve', () => {
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
      comments!: Comment[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Str('') title!: string
    @MorphMany(() => Comment, 'commentableId', 'commentableType')
      comments!: Comment[]
  }

  const ENTITIES = {
    videos: { 1: { id: 1, link: '/video.mp4' } },
    posts: {
      1: { id: 1, title: 'Hello, world!' },
      2: { id: 2, title: 'Hello, world! Again!' },
    },
    comments: {
      1: {
        id: 1,
        body: 'Cool Video!',
        commentableId: 1,
        commentableType: 'videos',
      },
      2: {
        id: 2,
        body: 'Cool Video Again!',
        commentableId: 1,
        commentableType: 'videos',
      },
      3: {
        id: 3,
        body: 'Cool Post!',
        commentableId: 1,
        commentableType: 'posts',
      },
      4: {
        id: 4,
        body: 'Cool Post 2!',
        commentableId: 2,
        commentableType: 'posts',
      },
    },
  }

  describe('when there are comments', () => {
    const videoRepo = useRepo(Video)

    it('can eager load morph many relation for video', () => {
      fillState(ENTITIES)
      const video = videoRepo.with('comments').first()!

      expect(video).toBeInstanceOf(Video)
      assertInstanceOf(video.comments, Comment)
      assertModel(video, {
        id: 1,
        link: '/video.mp4',
        comments: [
          {
            id: 1,
            body: 'Cool Video!',
            commentableId: 1,
            commentableType: 'videos',
          },
          {
            id: 2,
            body: 'Cool Video Again!',
            commentableId: 1,
            commentableType: 'videos',
          },
        ],
      })
    })

    it('can eager load morph many relation for post', () => {
      fillState(ENTITIES)
      const postRepo = useRepo(Post)

      const post = postRepo.with('comments').first()!

      expect(post).toBeInstanceOf(Post)
      assertInstanceOf(post.comments, Comment)
      assertModel(post, {
        id: 1,
        title: 'Hello, world!',
        comments: [
          {
            id: 3,
            body: 'Cool Post!',
            commentableId: 1,
            commentableType: 'posts',
          },
        ],
      })
    })
  })

  describe('when there are no comments', () => {
    it('can eager load missing relation as empty array', () => {
      fillState({
        videos: {
          1: { id: 1, link: '/video.mp4' },
        },
        posts: {},
        comments: {},
      })

      const video = useRepo(Video).with('comments').first()!

      expect(video).toBeInstanceOf(Video)
      assertModel(video, {
        id: 1,
        link: '/video.mp4',
        comments: [],
      })
    })
  })

  it('can revive "morph many" relations', () => {
    fillState({
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
      },
    })

    const schema = {
      id: '1',
      comments: [{ id: 2 }, { id: 1 }],
    }

    const video = useRepo(Video).revive(schema)!

    expect(video.comments).toHaveLength(2)
    assertInstanceOf(video.comments, Comment)
    expect(video.comments[0].id).toBe(2)
    expect(video.comments[1].id).toBe(1)
  })
})
