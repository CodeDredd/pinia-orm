import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Cast } from '../../../src/decorators'
import { DateCast } from '../../../src/casts'
import { assertState } from '../../helpers'

describe('unit/model/Model_Casts_Date', () => {
  const expectedISODate = new Date('2017-01-26').toISOString()

  beforeEach(() => {
    Model.clearRegistries()
  })

  it('should cast to Date UTC with string', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          updated: this.attr(''),
        }
      }

      static casts () {
        return {
          updated: DateCast,
        }
      }
    }

    expect(new User({ updated: '2017-01-26' }, { operation: 'get' }).updated.toISOString()).toBe(expectedISODate)
    expect(new User({ updated: new Date('2017-01-26') }, { operation: 'set' }).updated).toBe(expectedISODate)
    expect(new User({ updated: '2017-01-26' }, { operation: 'set' }).updated).toBe(expectedISODate)
  })

  it('should cast with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => DateCast)
      @Attr('test')
      declare updated: Date
    }

    expect(new User({ updated: '2017-01-26' }, { operation: 'get' }).updated.toISOString()).toBe(expectedISODate)
  })

  it('should allow null values', () => {
    class User extends Model {
      static entity = 'users'

      @Cast(() => DateCast)
      @Attr('test')
      declare updated: Date
    }

    expect(new User({ updated: null }, { operation: 'get' }).updated).toBe(null)
    expect(new User({ updated: null }, { operation: 'set' }).updated).toBe(null)
  })

  it('should cast before saved into store', () => {
    const expectedIsoDate2 = new Date('2023-01-26')

    class User extends Model {
      static entity = 'users'

      @Attr(0) declare id: number
      @Attr('') declare updated: Date

      @Cast(() => DateCast) @Attr(null) declare createdAt: Date
      @Cast(() => DateCast) @Attr(null) declare updatedAt: Date

      static saving (model: Model) {
        model.updatedAt = expectedIsoDate2
      }

      static casts () {
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
        1: { id: 1, updated: expectedISODate, createdAt: null, updatedAt: expectedIsoDate2.toISOString() },
      },
    })

    expect(userRepo.find(1)?.updated.toISOString()).toBe(expectedISODate)
  })
})
