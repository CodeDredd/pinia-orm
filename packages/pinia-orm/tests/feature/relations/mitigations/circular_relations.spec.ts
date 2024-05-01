import { describe, test } from 'vitest'

import { useRepo } from '../../../../src'
import { assertState } from '../../../helpers'
import User from './_fixtures/circular_relations_user'

describe('feature/relations/mitigations/circular_relations', () => {
  test('models can have circular relations', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      phone: {
        id: 2,
        userId: 1,
        user: {
          id: 1,
        },
      },
    })

    assertState({
      users: {
        1: { id: 1 },
      },
      phones: {
        2: { id: 2, userId: 1 },
      },
    })
  })
})
