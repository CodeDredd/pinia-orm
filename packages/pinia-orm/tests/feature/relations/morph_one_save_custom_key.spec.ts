import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { MorphOne, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/morph_one_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "morph one" relation with custom primary key', () => {
    class Image extends Model {
      static entity = 'images'

      @Num(0) id!: number
      @Str('') url!: string
      @Num(0) imageableId!: number
      @Str('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Num(0) userId!: number
      @Str('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType')
        image!: Image | null
    }

    const usersRepo = useRepo(User)

    usersRepo.save({
      userId: 1,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState({
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 1,
          imageableType: 'users',
        },
      },
    })
  })

  it('inserts "morph one" relation with custom local key', () => {
    class Image extends Model {
      static entity = 'images'

      @Num(0) id!: number
      @Str('') url!: string
      @Num(0) imageableId!: number
      @Str('') imageableType!: string
    }

    class User extends Model {
      static entity = 'users'

      @Num(0) id!: number
      @Num(0) userId!: number
      @Str('') name!: string

      @MorphOne(() => Image, 'imageableId', 'imageableType', 'userId')
        image!: Image | null
    }

    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      image: {
        id: 1,
        url: '/profile.jpg',
        imageableType: 'users',
      },
    })

    assertState({
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' },
      },
      images: {
        1: {
          id: 1,
          url: '/profile.jpg',
          imageableId: 2,
          imageableType: 'users',
        },
      },
    })
  })
})
