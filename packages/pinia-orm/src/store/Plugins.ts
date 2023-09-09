import { FilledInstallOptions, Model, Repository } from '../../src'
import { config as globalConfig } from './Config'

export interface PiniaOrmPluginContext {
  model: Model
  repository: Repository
  config: FilledInstallOptions
}

export interface PiniaOrmPlugin {
  (context: PiniaOrmPluginContext): void | Partial<PiniaOrmPluginContext>
}

export const plugins: PiniaOrmPlugin[] = []

export function registerPlugins() {
  let config = globalConfig
  plugins.forEach(plugin => {
    const pluginConfig = plugin({ config: config })?.config
    if (pluginConfig) {
      config = { ...config, ...pluginConfig }
    }
  })

  return {
    config
  }
}
