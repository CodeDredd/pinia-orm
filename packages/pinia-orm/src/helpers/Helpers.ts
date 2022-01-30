import Vue from 'vue-demi'
import { Model } from '../model/Model'
import { Repository } from '../repository/Repository'

export type MappedRepositories<MR extends ModelsOrRepositories> = {
  [K in keyof MR]: MR[K] extends typeof Model
    ? () => Repository<InstanceType<MR[K]>>
    : () => InstanceType<MR[K]>
}

export type ModelOrRepository<
  M extends typeof Model,
  R extends typeof Repository
> = M | R

export type ModelsOrRepositories<
  M extends typeof Model = any,
  R extends typeof Repository = any
> = Record<string, ModelOrRepository<M, R>>

/**
 * Map given models or repositories to the Vue Component.
 */
export function mapRepos<MR extends ModelsOrRepositories>(
  modelsOrRepositories: MR
): MappedRepositories<MR> {
  const repositories = {} as MappedRepositories<MR>

  for (const name in modelsOrRepositories) {
    // @ts-ignore
    ;(repositories as any)[name] = function (this: Vue) {
      return this.$store.$repo(modelsOrRepositories[name])
    }
  }

  return repositories
}
