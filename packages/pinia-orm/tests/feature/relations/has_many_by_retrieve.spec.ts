import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasManyBy, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel } from '../../helpers'

describe('feature/relations/has_many_by_retrieve', () => {
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

  it('can eager load has many by relation', () => {
    const nodesRepo = useRepo(Node)
    const clusterRepo = useRepo(Cluster)

    nodesRepo.save([
      { id: 1, name: 'Node 01' },
      { id: 2, name: 'Node 02' },
    ])
    clusterRepo.save({ id: 1, nodeIds: [1, 2], name: 'Cluster 01' })

    const cluster = clusterRepo.with('nodes').first()!

    expect(cluster).toBeInstanceOf(Cluster)
    assertInstanceOf(cluster.nodes, Node)
    assertModel(cluster, {
      id: 1,
      nodeIds: [1, 2],
      name: 'Cluster 01',
      nodes: [
        { id: 1, name: 'Node 01' },
        { id: 2, name: 'Node 02' },
      ],
    })
  })

  it('can eager load missing relation as empty array', () => {
    const clusterRepo = useRepo(Cluster)

    clusterRepo.save({ id: 1, nodeIds: [1, 2], name: 'Cluster 01' })

    const cluster = clusterRepo.with('nodes').first()!

    expect(cluster).toBeInstanceOf(Cluster)
    assertModel(cluster, {
      id: 1,
      nodeIds: [1, 2],
      name: 'Cluster 01',
      nodes: [],
    })
  })
})
