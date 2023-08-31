import { describe, expect, it } from 'vitest'
import { Model, useRepo } from '../../../src'
import {
  Attr,
  BelongsTo, BelongsToMany,
  HasMany,
  HasManyBy,
  HasManyThrough, HasOne,
  MorphMany,
  MorphOne, MorphTo, MorphToMany, Num, Str
} from '../../../src/decorators'

describe('unit/model/Model_Relations', () => {
  class Phone extends Model {
    static entity = 'phones'

    @Attr() declare id: number
    @Attr() declare userId: number
  }

  class Tag extends Model {
    static entity = 'tags'

    @Attr() declare id: number
  }
  class Taggable extends Model {
    static entity = 'taggables'

    static primaryKey = ['tagId', 'commentableId', 'commentableType']

    @Attr('') declare tagId: number
    @Attr(null) declare taggableId: number | null
    @Attr(null) declare taggableType: string | null
  }

  class Country extends Model {
    static entity = 'countries'

    @Attr() id!: number
    @HasManyThrough(() => Post, () => User, 'countryId', 'userId')
    declare posts: Post[]
  }

  class Role extends Model {
    static entity = 'roles'

    @Num(0) declare id: number
    declare pivot: RoleUser
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['roleIid', 'userId']

    @Attr(null) declare roleIid: number | null
    @Attr(null) declare userId: number | null
    @Attr(null) declare level: number | null
  }

  class Comment extends Model {
    static entity = 'comments'

    @Num(0) id!: number
    @Str('') body!: string
    @Attr(null) commentableId!: number | null
    @Attr(null) commentableType!: string | null
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class Name extends Model {
    static entity = 'names'

    @Attr() id!: number
  }

  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Attr() countryId!: number
    @Attr() nameIds!: number[]

    @HasOne(() => Phone, 'userId')
      phone!: Phone | null

    @BelongsTo(() => Country, 'countryId')
      country!: Country | null

    @HasMany(() => Post, 'userId')
      posts!: Post[]

    @HasManyBy(() => Name, 'nameIds')
      names!: Name[]

    @MorphOne(() => Image, 'imageableId', 'imageableType')
      image!: Image | null

    @BelongsToMany(() => Role, () => RoleUser, 'userId', 'roleId') declare roles: Role[]

    @MorphToMany(() => Tag, () => Taggable, 'tagId', 'taggableId', 'taggableType') declare tags: Tag[]

    @MorphMany(() => Comment, 'commentableId', 'commentableType') declare comments: Comment[]
  }

  class Image extends Model {
    static entity = 'images'

    @Attr() id!: number
    @Attr() imageableId!: number
    @Attr() imageableType!: string

    @MorphTo(() => [User], 'imageableId', 'imageableType')
      imageable!: User | null
  }

  it('fills "has one" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      phone: {
        id: 2
      }
    })

    expect(user.phone).toBeInstanceOf(Phone)
    expect(user.phone!.id).toBe(2)
  })

  it('fills "belongs to" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      country: {
        id: 2
      }
    })

    expect(user.country).toBeInstanceOf(Country)
    expect(user.country!.id).toBe(2)
  })

  it('fills "belongs to many" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      roles: [{ id: 2 }, { id: 3 }]
    })

    expect(user.roles[0]).toBeInstanceOf(Role)
    expect(user.roles[1]).toBeInstanceOf(Role)
    expect(user.roles[0].id).toBe(2)
    expect(user.roles[1].id).toBe(3)
  })

  it('fills "has many" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      posts: [{ id: 2 }, { id: 3 }]
    })

    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[1]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
    expect(user.posts[1].id).toBe(3)
  })

  it('fills "has many through" relation', () => {
    const countryRepo = useRepo(Country)

    const country = countryRepo.make({
      id: 1,
      posts: [{ id: 2 }, { id: 3 }]
    })

    expect(country.posts[0]).toBeInstanceOf(Post)
    expect(country.posts[1]).toBeInstanceOf(Post)
    expect(country.posts[0].id).toBe(2)
    expect(country.posts[1].id).toBe(3)
  })

  it('fills "has many by" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      names: [{ id: 2 }, { id: 3 }]
    })

    expect(user.names[0]).toBeInstanceOf(Name)
    expect(user.names[1]).toBeInstanceOf(Name)
    expect(user.names[0].id).toBe(2)
    expect(user.names[1].id).toBe(3)
  })

  it('fills "morph one" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      image: {
        id: 2,
        imageableId: 1,
        imageableType: 'users'
      }
    })

    expect(user.image!).toBeInstanceOf(Image)
    expect(user.image!.id).toBe(2)
  })

  it('fills "morph many" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      comments: [{
        id: 2,
        commentableId: 1,
        commentableType: 'users'
      }]
    })

    expect(user.comments[0]).toBeInstanceOf(Comment)
    expect(user.comments[0].id).toBe(2)
  })

  it('fills "morph to" relation', () => {
    const imageRepo = useRepo(Image)

    const image = imageRepo.make({
      id: 1,
      imageableId: 2,
      imageableType: 'users',
      imageable: {
        id: 2
      }
    })

    expect(image.imageable!).toBeInstanceOf(User)
    expect(image.imageable!.id).toBe(2)
  })

  it('fills "morph to many" relation', () => {
    const userRepo = useRepo(User)

    const user = userRepo.make({
      id: 1,
      tags: [{ id: 2 }, { id: 3 }]
    })

    expect(user.tags[0]).toBeInstanceOf(Tag)
    expect(user.tags[1]).toBeInstanceOf(Tag)
    expect(user.tags[0].id).toBe(2)
    expect(user.tags[1].id).toBe(3)
  })
})
