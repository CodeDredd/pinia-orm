import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasManyBy, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/has_many_by_insert_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many by" relation with parent having "uid" field as the primary key', () => {
    class Node extends Model {
      static entity = 'nodes'

      @Attr() id!: number
      @Str('') name!: string
    }

    class Cluster extends Model {
      static entity = 'clusters'

      @Uid() id!: number
      @Attr() nodeIds!: number[]
      @Str('') name!: string

      @HasManyBy(() => Node, 'nodeIds')
        nodes!: Node[]
    }

    mockUid(['uid1'])

    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({
      name: 'Cluster 01',
      nodes: [
        { id: 1, name: 'Node 01' },
        { id: 2, name: 'Node 02' },
      ],
    })

    assertState({
      nodes: {
        1: { id: 1, name: 'Node 01' },
        2: { id: 2, name: 'Node 02' },
      },
      clusters: {
        uid1: { id: 'uid1', nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('inserts "has many by" relation with child having "uid" as the owner key', () => {
    class Node extends Model {
      static entity = 'nodes'

      @Uid() id!: number
      @Str('') name!: string
    }

    class Cluster extends Model {
      static entity = 'clusters'

      @Uid() id!: number
      @Attr() nodeIds!: number[]
      @Str('') name!: string

      @HasManyBy(() => Node, 'nodeIds')
        nodes!: Node[]
    }

    mockUid(['uid1', 'uid2', 'uid3'])

    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({
      name: 'Cluster 01',
      nodes: [{ name: 'Node 01' }, { name: 'Node 02' }],
    })

    assertState({
      nodes: {
        uid2: { id: 'uid2', name: 'Node 01' },
        uid3: { id: 'uid3', name: 'Node 02' },
      },
      clusters: {
        uid1: { id: 'uid1', nodeIds: ['uid2', 'uid3'], name: 'Cluster 01' },
      },
    })
  })
})
