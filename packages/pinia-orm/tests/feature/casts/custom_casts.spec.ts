import { describe, expect, it } from 'vitest'

import { CastAttribute, Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/casts/custom_casts', () => {
  class House extends Model {
    static entity = 'houses'

    @Attr() id!: any
    @Str('') name!: string
    @Attr('{}') owner!: Person

    static casts () {
      return {
        owner: PersonCast,
      }
    }
  }

  class Person {
    firstname: string
    lastname: string

    constructor (firstname: string, lastname: string) {
      this.firstname = firstname
      this.lastname = lastname
    }

    static deserialize (fullname: string): Person {
      const [firstname, lastname] = fullname.split(' ')
      return new Person(firstname, lastname)
    }

    serialize (): string {
      return `${this.firstname} ${this.lastname}`
    }
  }

  class PersonCast extends CastAttribute {
    get (value?: string): Person | undefined {
      if (typeof value == 'string') {
        return Person.deserialize(value)
      }
      return value
    }

    set (value?: Person): string | undefined {
      if (value) {
        return value.serialize()
      }
      return value
    }
  }

  it('check custom cast insertion', () => {
    const houseRepo = useRepo(House)

    const returnedHouse = houseRepo.save({ id: 1, name: 'First', owner: new Person('John', 'Doe') })

    expect(returnedHouse.owner.firstname).toEqual('John')
    expect(returnedHouse.owner.lastname).toEqual('Doe')

    const savedHouse = houseRepo.find(1)!

    expect(savedHouse.owner.firstname).toEqual('John')
    expect(savedHouse.owner.lastname).toEqual('Doe')

    assertState({ houses: {
      1: { id: 1, name: 'First', owner: 'John Doe' },
    } })
  })

  it('check custom cast update', () => {
    const houseRepo = useRepo(House)

    houseRepo.save({ id: 1, name: 'First', owner: new Person('John', 'Doe') })

    assertState({ houses: {
      1: { id: 1, name: 'First', owner: 'John Doe' },
    } })

    const returnedHouse = houseRepo.save({ id: 1, owner: new Person('Foo', 'Bar') })

    expect(returnedHouse.owner.firstname).toEqual('Foo')
    expect(returnedHouse.owner.lastname).toEqual('Bar')

    const updatedHouse = houseRepo.find(1)!

    expect(updatedHouse.owner.firstname).toEqual('Foo')
    expect(updatedHouse.owner.lastname).toEqual('Bar')

    assertState({ houses: {
      1: { id: 1, name: 'First', owner: 'Foo Bar' },
    } })
  })
})
