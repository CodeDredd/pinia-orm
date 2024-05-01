import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasManyBy, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_many_by_save', () => {
  class Node extends Model {
    static entity = 'nodes'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Cluster extends Model {
    static entity = 'clusters'

    @Attr() id!: number
    @Attr() nodeIds!: number[]
    @Str('') name!: string

    @HasManyBy(() => Node, 'nodeIds')
      nodes!: Node[]
  }

  it('inserts a record to the store with "has many by" relation', () => {
    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({
      id: 1,
      name: 'Cluster 01',
      nodeIds: [1, 2],
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
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('generates missing foreign keys', () => {
    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({
      id: 1,
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
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })

  it('generates partially missing foreign keys', () => {
    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({
      id: 1,
      name: 'Cluster 01',
      nodeIds: [2],
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
        1: { id: 1, nodeIds: [2, 1], name: 'Cluster 01' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({
      id: 1,
      name: 'Cluster 01',
      nodeIds: [1, 2],
    })

    assertState({
      clusters: {
        1: { id: 1, nodeIds: [1, 2], name: 'Cluster 01' },
      },
    })
  })
})
