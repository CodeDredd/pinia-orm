import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphMany, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morph_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph many" relation with custom primary key', () => {
    class Comment extends Model {
      static entity = 'comments'

      @Num(0) id!: number
      @Str('') body!: string
      @Attr(null) commentableId!: number | null
      @Attr(null) commentableType!: string | null
    }

    class Video extends Model {
      static entity = 'videos'

      static primaryKey = 'morphableId'

      @Num(0) morphableId!: number
      @Str('') link!: string

      @MorphMany(() => Comment, 'commentableId', 'commentableType')
        comments!: Comment[]
    }

    useRepo(Video).save({
      morphableId: 1,
      link: '/video.mp4',
      comments: [
        { id: 1, body: 'Cool Video!' },
        { id: 2, body: 'Cool Video Again!' },
      ],
    })

    assertState({
      videos: {
        1: { morphableId: 1, link: '/video.mp4' },
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
  })

  it('inserts "morph many" relation with custom local key', () => {
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
      @Num(0) morphableId!: number
      @Str('') link!: string

      @MorphMany(
        () => Comment,
        'commentableId',
        'commentableType',
        'morphableId',
      )
        comments!: Comment[]
    }

    useRepo(Video).save({
      id: 1,
      morphableId: 2,
      link: '/video.mp4',
      comments: [
        { id: 1, body: 'Cool Video!' },
        { id: 2, body: 'Cool Video Again!' },
      ],
    })

    assertState({
      videos: {
        1: { id: 1, morphableId: 2, link: '/video.mp4' },
      },
      comments: {
        1: {
          id: 1,
          commentableId: 2,
          commentableType: 'videos',
          body: 'Cool Video!',
        },
        2: {
          id: 2,
          commentableId: 2,
          commentableType: 'videos',
          body: 'Cool Video Again!',
        },
      },
    })
  })
})
