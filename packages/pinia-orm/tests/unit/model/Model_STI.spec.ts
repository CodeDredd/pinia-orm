import { beforeEach, describe, expect, it } from 'vitest'

import { Attr, Model, useRepo } from '../../../src'
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

    assertState({
      animals: {
        1: { id: 1, type: 'animal' },
        2: { id: 2, type: 'dog', race: 'Rattler' },
        3: { id: 3, type: 'cat' },
      },
    })

    expect(animalsRepo.find(1)).toBeInstanceOf(Animal)
    expect(animalsRepo.find(2)).toBeInstanceOf(Dog)
    expect(animalsRepo.find(3)).toBeInstanceOf(Animal)
    expect(animalsRepo.all().length).toBe(3)
    expect(useRepo(Dog).all().length).toBe(1)
  })

  it('saves the types correctly with deocrators', () => {
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
})
