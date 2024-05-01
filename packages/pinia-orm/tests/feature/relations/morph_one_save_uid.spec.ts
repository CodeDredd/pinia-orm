import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { MorphOne, Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/morph_one_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with parent having "uid" field as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @Num(0) id!: number
      @Str('') url!: string
      @Uid() imageableId!: string
      @Str('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
        image!: Image | null
    }

    mockUid(['uid1'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 'uid1',
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph one" relation with child having "uid" as the primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @Uid() id!: string
      @Str('') url!: string
      @Uid() imageableId!: string
      @Str('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
        image!: Image | null
    }

    mockUid(['uid1', 'uid2'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      image: {
        url: '/profile.jpg',
      },
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      images: {
        uid2: {
          id: 'uid2',
          url: '/profile.jpg',
          imageableId: 'uid1',
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph one" relation with child having a composite primary key', () => {
    class Image extends Model {
      static entity = 'images'
      static primaryKey = ['imageableId', 'imageableType']

      @Str('') url!: string
      @Uid() imageableId!: number
      @Str('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
        image!: Image | null
    }

    mockUid(['uid1', 'uid2'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      image: {
        url: '/profile.jpg',
      },
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      images: {
        '["uid1","users"]': {
          url: '/profile.jpg',
          imageableId: 'uid1',
          imageableType: 'users',
        },
      },
    })
  })
})
