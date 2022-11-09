import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('unit/model/Model_STI', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('saves the types correctly', () => {
    class Animal extends Model {
      static entity = 'animals'

      static fields() {
        return {
          id: this.attr(null),
          type: this.attr('animal'),
        }
      }

      static types() {
        return {
          animal: Animal,
          dog: Dog,
        }
      }
    }

    class Dog extends Animal {
      static entity = 'dogs'

      static baseEntity = 'animals'

      static fields() {
        return {
          ...super.fields(),
          type: this.attr('dog'),
          race: this.attr('terrier'),
        }
      }
    }

    const animalsRepo = useRepo(Animal)

    animalsRepo.save([
      {
        id: 1,
        type: 'animal',
      },
      {
        id: 2,
        type: 'dog',
        race: 'Rattler',
      },
      {
        id: 3,
        type: 'cat',
        race: 'red',
      },
    ])

    useRepo(Dog).save({
      id: 4,
      race: 'Rattler',
    })

    assertState({
      animals: {
        1: { id: 1, type: 'animal' },
        2: { id: 2, type: 'dog', race: 'Rattler' },
        3: { id: 3, type: 'cat' },
        4: { id: 4, type: 'dog', race: 'Rattler' },
      },
    })

    expect(animalsRepo.find(1)).toBeInstanceOf(Animal)
    expect(animalsRepo.find(2)).toBeInstanceOf(Dog)
    expect(animalsRepo.find(3)).toBeInstanceOf(Animal)
    expect(animalsRepo.all().length).toBe(4)
    expect(useRepo(Dog).all().length).toBe(2)
  })

  it('saves with deocrators the types correctly', () => {
    class Animal extends Model {
      static entity = 'animals'

      @Attr(null) id!: number | null
      @Attr('animal') type!: string

      static types() {
        return {
          animal: Animal,
          dog: Dog,
        }
      }
    }

    class Dog extends Animal {
      static entity = 'dogs'

      static baseEntity = 'animals'

      static fields() {
        return {
          ...super.schemas[super.entity],
        }
      }

      @Attr('dog') declare type
      @Attr('terrier') race!: string
    }

    const animalsRepo = useRepo(Animal)

    animalsRepo.save([
      {
        id: 1,
        type: 'animal',
      },
      {
        id: 2,
        type: 'dog',
        race: 'Rattler',
      },
    ])

    assertState({
      animals: {
        1: { id: 1, type: 'animal' },
        2: { id: 2, type: 'dog', race: 'Rattler' },
      },
    })

    expect(animalsRepo.find(1)).toBeInstanceOf(Animal)
    expect(animalsRepo.find(2)).toBeInstanceOf(Dog)
  })

  it('saves correctly nested relations and returns them', () => {
    class AnonymousPost extends Model {
      static entity = 'anonymousPosts'

      static typeKey = 'type'

      static types() {
        return {
          0: AnonymousPost,
          1: UserPost,
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          title: this.attr(''),
          body: this.attr(''),
          published: this.attr(false),
          type: this.attr(null),
          image_id: this.attr(null),
          image: this.belongsTo(Image, 'image_id'),
        }
      }
    }

    class UserPost extends AnonymousPost {
      static entity = 'extendedPosts'

      static baseEntity = 'anonymousPosts'

      static fields() {
        return {
          ...super.fields(),
          user_id: this.attr(null),
          author: this.belongsTo(User, 'user_id'),
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      static fields() {
        return {
          id: this.attr(null),
          title: this.attr(''),
          url: this.attr(''),
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          email: this.attr(''),
        }
      }
    }

    useRepo(AnonymousPost).save([
      {
        id: 1,
        type: 0,
        title: 'Anonymous Post',
        body: 'Some awesome body...',
        image: {
          id: 1,
          title: 'Some awesome image caption',
          url: 'https://example.com/myawesomeimage.jpg',
        },
      },
      {
        id: 2,
        type: 1,
        title: '',
        body: 'User Post',
        author: {
          id: 1,
          name: 'Johnny Appleseed',
          email: 'johnny@apple.com',
        },
        image: {
          id: 2,
          title: 'Another awesome image caption',
          url: 'https://example.com/mysecondawesomeimage.jpg',
        },
      },
    ])

    useRepo(AnonymousPost).save({
      id: 3,
      type: 0,
      title: 'Anonymous Post',
      body: 'Some awesome body...',
      image: {
        id: 1,
        title: 'Some awesome image caption',
        url: 'https://example.com/myawesomeimage.jpg',
      },
    })

    useRepo(User).save([
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        id: 3,
        name: 'Alice Evens',
        email: 'alice@evens.com',
      },
    ])

    expect(useRepo(AnonymousPost).withAll().find(2)).ownProperty('author')
    expect(useRepo(User).all().length).toBe(3)
  })

  it('saves without key as property', () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          PERSON: Person,
          ADULT: Adult,
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields(),
          job: this.attr(''),
        }
      }
    }

    const personRepo = useRepo(Person)

    personRepo.save([
      { type: 'PERSON', id: 1, name: 'John Doe' },
      { type: 'ADULT', id: 2, name: 'Jane Doe', job: 'Software Engineer' },
    ])

    assertState({
      person: {
        1: { id: 1, type: 'PERSON', name: 'John Doe' },
        2: { id: 2, type: 'ADULT', name: 'Jane Doe', job: 'Software Engineer' },
      },
    })
    const persons = useRepo(Person).all()
    expect(persons[0]).toBeInstanceOf(Person)
    expect(persons[0]).not.toHaveProperty('type')
    expect(persons[1]).toBeInstanceOf(Adult)
    expect(persons[1]).not.toHaveProperty('type')
  })
})
