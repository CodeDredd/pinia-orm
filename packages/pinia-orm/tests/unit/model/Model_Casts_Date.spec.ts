import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast } from '../../../src/decorators'
import { DateCast } from '../../../src/casts'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_Date', () => {
  const exspectedISODate = new Date('2017-01-26').toISOString()

  beforeEach(() => {
    Model.clearRegistries()
  })
  it('should cast to Date UTC with string', () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          updated: this.attr(''),
        }
      }

      static casts() {
        return {
          updated: DateCast,
        }
      }
    }

    expect(new User({ updated: '2017-01-26' }, { operation: 'get' }).updated.toISOString()).toBe(exspectedISODate)
    expect(new User({ updated: new Date('2017-01-26') }, { operation: 'set' }).updated).toBe(exspectedISODate)
    expect(new User({ updated: '2017-01-26' }, { operation: 'set' }).updated).toBe(exspectedISODate)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => DateCast)
      @Attr('test')
        updated!: Date
    }

    expect(new User({ updated: '2017-01-26' }, { operation: 'get' }).updated.toISOString()).toBe(exspectedISODate)
  })

  it('should allow null values', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => DateCast)
      @Attr('')
        updated!: Date
    }

    expect(new User({ updated: null }, { operation: 'get' }).updated).toBe(null)
    expect(new User({ updated: '' }, { operation: 'get' }).updated).toBe(null)
  })

  it('should cast before saved into store', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') updated!: Date

      static casts() {
        return {
          updated: DateCast,
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      updated: new Date('2017-01-26'),
    })

    assertState({
      users: {
        1: { id: 1, updated: exspectedISODate },
      },
    })

    expect(userRepo.find(1)?.updated.toISOString()).toBe(exspectedISODate)
  })
})
