import { describe, it } from 'vitest'
import { Model, useRepo } from '../../../src'
import { Attr, MorphToMany, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morph_to_many_save', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() declare id: number
    @MorphToMany(() => Tag, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    declare tags: Tag[]
  }

  class Video extends Model {
    static entity = 'videos'

    @Attr() declare id: number
    @MorphToMany(() => Tag, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    declare tags: Tag[]
  }

  class Tag extends Model {
    static entity = 'tags'

    @Attr() declare id: number
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
    const userRepo = useRepo(User)

    userRepo.save([
      {
        id: 1,
        tags: [{ id: 1, pivot: { level: 1 } }, { id: 2 }, { id: 4 }],
      },
      {
        id: 2,
        tags: [{ id: 1, pivot: { level: 2 } }],
      },
    ])

    useRepo(Video).save([
      {
        id: 1,
        tags: [{ id: 1, pivot: { level: 4 } }, { id: 2 }],
      },
      {
        id: 2,
        tags: [{ id: 1, pivot: { level: 5 } }],
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
        4: { id: 4 },
      },
      taggables: {
        '[1,1,"users"]': { tag_id: 1, taggable_id: 1, taggable_type: 'users', level: 1 },
        '[2,1,"users"]': { tag_id: 2, taggable_id: 1, taggable_type: 'users', level: null },
        '[4,1,"users"]': { tag_id: 4, taggable_id: 1, taggable_type: 'users', level: null },
        '[1,2,"users"]': { tag_id: 1, taggable_id: 2, taggable_type: 'users', level: 2 },
        '[1,1,"videos"]': { tag_id: 1, taggable_id: 1, taggable_type: 'videos', level: 4 },
        '[2,1,"videos"]': { tag_id: 2, taggable_id: 1, taggable_type: 'videos', level: null },
        '[1,2,"videos"]': { tag_id: 1, taggable_id: 2, taggable_type: 'videos', level: 5 },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
    })

    assertState({
      users: {
        1: { id: 1 },
      },
    })
  })
})
