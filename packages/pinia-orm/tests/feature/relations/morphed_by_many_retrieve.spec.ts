import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphedByMany, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel, fillState } from '../../helpers'

describe('feature/relations/morphed_by_many_retrieve', () => {
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

  it('can eager load morphed by many relation', () => {
    const tagRepo = useRepo(Tag)

    fillState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
      },
      videos: {
        3: { id: 3 },
      },
      tags: {
        1: { id: 1 },
        2: { id: 2 },
      },
      taggables: {
        '[1,1,"users"]': { tag_id: 1, taggable_id: 1, taggable_type: 'users', level: 1 },
        '[2,3,"videos"]': { tag_id: 2, taggable_id: 3, taggable_type: 'videos', level: 2 },
        '[2,1,"users"]': { tag_id: 2, taggable_id: 1, taggable_type: 'users', level: null },
      },
    })

    const tag = tagRepo.with('users').with('videos').find(1)
    const tag2 = tagRepo.with('users').with('videos').find(2)

    expect(tag).toBeInstanceOf(Tag)
    assertInstanceOf(tag!.users, User)

    expect(tag?.users.length).toBe(1)
    expect(tag?.users[0].pivot.level).toBe(1)
    expect(tag2?.videos.length).toBe(1)
    expect(tag2?.videos[0].pivot.level).toBe(2)
  })

  it('can eager load missing relation as empty array', () => {
    const tagRepo = useRepo(Tag)

    tagRepo.save({ id: 1 })

    const tag = tagRepo.with('users').first()!

    expect(tag).toBeInstanceOf(Tag)
    assertModel(tag, {
      id: 1,
      users: [],
    })
  })

  it('can revive "morphed by many" relations', () => {
    const tagRepo = useRepo(Tag)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', permissions: [] },
      },
      tags: {
        1: { id: 1 },
        2: { id: 2 },
      },
      taggables: {
        '[1,1,"users"]': { tag_id: 1, taggable_id: 1, taggable_type: 'users', level: 1 },
        '[2,1,"users"]': { tag_id: 2, taggable_id: 1, taggable_type: 'users', level: null },
      },
    })

    const schema = {
      id: '1',
      users: [{ id: 1 }],
    }

    const tag = tagRepo.revive(schema)!

    expect(tag.users.length).toBe(1)
    expect(tag.users[0]).toBeInstanceOf(User)
    expect(tag.users[0].id).toBe(1)
  })
})
