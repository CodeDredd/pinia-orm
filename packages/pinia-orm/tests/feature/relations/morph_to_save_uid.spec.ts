import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, MorphTo, Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/morph_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph to" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Str('') name!: string
    }

    class Image extends Model {
      static entity = 'images'

      @Uid() id!: number
      @Str('') url!: string
      @Attr() imageableId!: number
      @Attr() imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType')
        imageable!: User | null
    }

    mockUid(['uid1'])

    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      url: '/profile.jpg',
      imageableId: 1,
      imageableType: 'users',
      imageable: { id: 1, name: 'John Doe' },
    })

    assertState({
      users: { 1: { id: 1, name: 'John Doe' } },
      images: {
        uid1: {
          id: 'uid1',
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph to" relation with parent and child having "uid" as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string
    }

    class Image extends Model {
      static entity = 'images'

      @Uid() id!: string
      @Str('') url!: string
      @Attr() imageableId!: string
      @Attr() imageableType!: string
      @MorphTo(() => [User], 'imageableId', 'imageableType')
        imageable!: User | null
    }

    mockUid(['uid1', 'uid2'])

    const imagesRepo = useRepo(Image)

    imagesRepo.save({
      url: '/profile.jpg',
      imageableType: 'users',
      imageable: { name: 'John Doe' },
    })

    assertState({
      users: { uid2: { id: 'uid2', name: 'John Doe' } },
      images: {
        uid1: {
          id: 'uid1',
          url: '/profile.jpg',
          imageableId: 'uid2',
          imageableType: 'users',
        },
      },
    })
  })
})
