import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphToMany, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel, fillState } from '../../helpers'

describe('feature/relations/morph_to_many_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
    @MorphToMany(() => Tag, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    declare tags: Tag[]
  }

  class Video extends Model {
    static entity = 'videos'

    @Attr() id!: number
    @Str('') name!: string
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

  it('can eager load morph to many relation', () => {
    const userRepo = useRepo(User)
    const videoRepo = useRepo(Video)

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

    const user = userRepo.with('tags').find(1)
    const video = videoRepo.with('tags').find(3)

    expect(user).toBeInstanceOf(User)
    assertInstanceOf(user!.tags, Tag)

    expect(user?.tags.length).toBe(2)
    expect(user?.tags[0].pivot.level).toBe(1)
    expect(video?.tags.length).toBe(1)
    expect(video?.tags[0].pivot.level).toBe(2)

    const userWithoutRoles = userRepo.with('tags').find(3)
    expect(userWithoutRoles?.tags.length).toBe(0)
  })

  it('can eager load morph to many relations with pivots', () => {
    fillState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
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
        '[1,1,"videos"]': { tag_id: 1, taggable_id: 1, taggable_type: 'videos', level: 2 },
        '[2,1,"users"]': { tag_id: 2, taggable_id: 1, taggable_type: 'users', level: null },
        '[2,2,"videos"]': { tag_id: 2, taggable_id: 2, taggable_type: 'videos', level: 3 },
      },
    })

    const users = useRepo(User).with('tags').get()

    expect(users[0].id).toBe(1)
    expect(users[0].tags[0].id).toBe(1)
    expect(users[0].tags[0].pivot.tag_id).toBe(1)
    expect(users[0].tags[0].pivot.taggable_id).toBe(1)
    expect(users[0].tags[0].pivot.level).toBe(1)
    expect(users[0].tags[1].id).toBe(2)
    expect(users[0].tags[1].pivot.tag_id).toBe(2)
    expect(users[0].tags[1].pivot.taggable_id).toBe(1)
    expect(users[0].tags[1].pivot.level).toBe(null)

    const videos = useRepo(Video).with('tags').get()

    expect(videos[0].id).toBe(1)
    expect(videos[0].tags[0].id).toBe(1)
    expect(videos[0].tags[0].pivot.tag_id).toBe(1)
    expect(videos[0].tags[0].pivot.taggable_id).toBe(1)
    expect(videos[0].tags[0].pivot.level).toBe(2)

    expect(videos[1].id).toBe(2)
    expect(videos[1].tags[0].id).toBe(2)
    expect(videos[1].tags[0].pivot.tag_id).toBe(2)
    expect(videos[1].tags[0].pivot.taggable_id).toBe(2)
    expect(videos[1].tags[0].pivot.level).toBe(3)
  })

  it('can eager load missing relation as empty array', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({ id: 1, name: 'John Doe' })

    const user = usersRepo.with('tags').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      tags: [],
    })
  })

  it('can revive "morph to many" relations', () => {
    const usersRepo = useRepo(User)

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
      tags: [{ id: 2 }, { id: 1 }],
    }

    const user = usersRepo.revive(schema)!

    expect(user.tags.length).toBe(2)
    expect(user.tags[0]).toBeInstanceOf(Tag)
    expect(user.tags[1]).toBeInstanceOf(Tag)
    expect(user.tags[0].id).toBe(2)
    expect(user.tags[1].id).toBe(1)
  })
})
