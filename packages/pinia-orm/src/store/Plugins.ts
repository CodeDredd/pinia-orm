import { FilledInstallOptions, Model, Repository } from '../../src'
import { config as globalConfig } from './Config'

export interface PiniaOrmPluginContext {
  model: Model
  repository: Repository
  config: FilledInstallOptions & { [key: string]: any }
}

export interface PiniaOrmPlugin {
  (context: PiniaOrmPluginContext): PiniaOrmPluginContext
}

export const definePiniaOrmPlugin = (plugin: PiniaOrmPlugin) => plugin

export const plugins: PiniaOrmPlugin[] = []

export function registerPlugins (repository: Repository) {
  let config = globalConfig
  plugins.forEach((plugin) => {
    const pluginConfig = plugin({ config, repository, model: repository.getModel() })
    config = { ...config, ...pluginConfig.config }
  })

  repository.setConfig(config)

  return repository
}
