import { describe, it } from 'vitest'
import { Model, useRepo } from '../../../src'
import { Attr, MorphedByMany, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morphed_by_many_save', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() declare id: number
  }

  class Video extends Model {
    static entity = 'videos'

    @Attr() declare id: number
  }

  class Tag extends Model {
    static entity = 'tags'

    @Attr() declare id: number
    @MorphedByMany(() => User, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    declare users: User[]

    @MorphedByMany(() => Video, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    declare videos: Video[]

    declare pivot: Taggable
  }

  class Taggable extends Model {
    static entity = 'taggables'
    static primaryKey = ['tag_id', 'taggable_id', 'taggable_type']

    @Attr() declare tag_id: number
    @Attr() declare taggable_id: number
    @Str('') declare taggable_type: string
    @Attr() declare level: number
  }

  it('saves a model to the store with "morph to many" relation', () => {
    const tagRepo = useRepo(Tag)

    tagRepo.save([
      {
        id: 1,
        users: [{ id: 1 }],
        videos: [{ id: 2 }],
        pivot: { level: 1 },
      },
      {
        id: 2,
        users: [{ id: 1 }, { id: 2 }],
        videos: [{ id: 1 }],
        pivot: { level: 2 },
      },
    ])

    assertState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
      },
      videos: {
        1: { id: 1 },
        2: { id: 2 },
      },
      tags: {
        1: { id: 1 },
        2: { id: 2 },
      },
      taggables: {
        '[1,1,"users"]': { tag_id: 1, taggable_id: 1, taggable_type: 'users', level: 1 },
        '[2,1,"users"]': { tag_id: 2, taggable_id: 1, taggable_type: 'users', level: 2 },
        '[2,2,"users"]': { tag_id: 2, taggable_id: 2, taggable_type: 'users', level: 2 },
        '[1,2,"videos"]': { tag_id: 1, taggable_id: 2, taggable_type: 'videos', level: 1 },
        '[2,1,"videos"]': { tag_id: 2, taggable_id: 1, taggable_type: 'videos', level: 2 },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const tagRepo = useRepo(Tag)

    tagRepo.save({
      id: 1,
    })

    assertState({
      tags: {
        1: { id: 1 },
      },
    })
  })
})
