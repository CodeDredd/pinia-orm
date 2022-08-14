import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphMany, Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/morph_many_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph many" relation with parent having "uid" field as the primary key', () => {
    class Comment extends Model {
      static entity = 'comments'

      @Num(0) id!: number
      @Str('') body!: string
      @Attr(null) commentableId!: string | null
      @Attr(null) commentableType!: string | null
    }

    class Video extends Model {
      static entity = 'videos'

      @Uid() id!: string
      @Str('') link!: string

      @MorphMany(() => Comment, 'commentableId', 'commentableType')
        comments!: Comment[]
    }

    mockUid(['uid1'])

    useRepo(Video).save({
      link: '/video.mp4',
      comments: [
        { id: 1, body: 'Cool Video!' },
        { id: 2, body: 'Cool Video Again!' },
      ],
    })

    assertState({
      videos: {
        uid1: { id: 'uid1', link: '/video.mp4' },
      },
      comments: {
        1: {
          id: 1,
          commentableId: 'uid1',
          commentableType: 'videos',
          body: 'Cool Video!',
        },
        2: {
          id: 2,
          commentableId: 'uid1',
          commentableType: 'videos',
          body: 'Cool Video Again!',
        },
      },
    })
  })

  it('inserts "morph many" relation with related having "uid" as the relational key', () => {
    class Comment extends Model {
      static entity = 'comments'

      @Uid() id!: number
      @Str('') body!: string
      @Attr(null) commentableId!: string | null
      @Attr(null) commentableType!: string | null
    }

    class Video extends Model {
      static entity = 'videos'

      @Uid() id!: string
      @Str('') link!: string

      @MorphMany(() => Comment, 'commentableId', 'commentableType')
        comments!: Comment[]
    }

    mockUid(['uid1', 'uid2', 'uid3'])

    useRepo(Video).save({
      link: '/video.mp4',
      comments: [{ body: 'Cool Video!' }, { body: 'Cool Video Again!' }],
    })

    assertState({
      videos: {
        uid1: { id: 'uid1', link: '/video.mp4' },
      },
      comments: {
        uid2: {
          id: 'uid2',
          commentableId: 'uid1',
          commentableType: 'videos',
          body: 'Cool Video!',
        },
        uid3: {
          id: 'uid3',
          commentableId: 'uid1',
          commentableType: 'videos',
          body: 'Cool Video Again!',
        },
      },
    })
  })
})
