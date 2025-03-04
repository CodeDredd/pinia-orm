import { describe, it } from 'vitest'
import { assertState, fillState } from '../../helpers'

import { Model, useRepo } from '../../../src'
import { Attr, MorphMany, Num, Str } from '../../../src/decorators'

describe('feature/relations/morph_many_save', () => {
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
    @Str('') link!: string

    @MorphMany(() => Comment, 'commentableId', 'commentableType')
    comments!: Comment[]
  }

  it('saves a model to the store with "morph many" relation', () => {
    const videoRepo = useRepo(Video)

    fillState({
      videos: {},
      comments: {
        1: {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Some Comment',
        },
      },
    })

    videoRepo.save({
      id: 1,
      link: '/video.mp4',
      comments: [
        {
          id: 1,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video!',
        },
        {
          id: 2,
          commentableId: 1,
          commentableType: 'videos',
          body: 'Cool Video Again!',
        },
      ],
    })

    assertState({
      videos: {
        1: { id: 1, link: '/video.mp4' },
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

  it('generates missing relational key', () => {
    useRepo(Video).save({
      id: 1,
      link: '/video.mp4',
      comments: [
        { id: 1, body: 'Cool Video!' },
        { id: 2, body: 'Cool Video Again!' },
      ],
    })

    assertState({
      videos: {
        1: { id: 1, link: '/video.mp4' },
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

  it('can insert a record with missing related data', () => {
    useRepo(Video).save({
      id: 1,
      link: '/video.mp4',
    })

    assertState({
      videos: {
        1: { id: 1, link: '/video.mp4' },
      },
    })
  })

  it('can save complicated polymorphs', () => {
    Model.clearRegistries()
    class Comment extends Model {
      static entity = 'comments'
      static fields () {
        return {
          id: this.number(0),
          url: this.string(''),
          content_id: this.number(0),
          content_type: this.string(''),
          content: this.morphTo([Video, Post], 'content_id', 'content_type'),
          creator_id: this.string(null),
          creator: this.belongsTo(Person, 'creator_id'),
        }
      }
    }

    class Person extends Model {
      static entity = 'person'
      static primaryKey = 'id'

      static fields () {
        return {
          id: this.uid(),
          job: this.attr(''),
          comments: this.hasMany(Comment, 'creator_id'),
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'
      static fields () {
        return {
          id: this.number(0),
          link: this.string(''),
          comments: this.morphMany(Comment, 'content_id', 'content_type'),
        }
      }
    }
    class Post extends Model {
      static entity = 'posts'
      static fields () {
        return {
          id: this.number(0),
          title: this.string(''),
          comments: this.morphMany(Comment, 'content_id', 'content_type'),
        }
      }
    }
    const person = useRepo(Person)

    person.save({
      id: 'p',
      job: 'dev',
      comments: [
        {
          id: 1,
          content_id: 4,
          content_type: 'posts',
          content: { id: 4, title: 'a post' },
          creator_id: 'p',
        },
        {
          id: 2,
          content_id: 3,
          content_type: 'videos',
          content: { id: 3, link: 'test' },
          creator_id: 'p',
        },
      ],
    })

    assertState({
      posts: {
        4: { id: 4, title: 'a post' },
      },
      videos: {
        3: { id: 3, link: 'test' },
      },
      comments: {
        1: {
          id: 1,
          url: '',
          creator_id: 'p',
          content_id: 4,
          content_type: 'posts',
        },
        2: {
          id: 2,
          url: '',
          creator_id: 'p',
          content_id: 3,
          content_type: 'videos',
        },
      },
      person: {
        p: { id: 'p', job: 'dev' },
      },

    })
  })
})
