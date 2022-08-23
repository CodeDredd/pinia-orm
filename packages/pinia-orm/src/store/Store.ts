import type { PiniaPlugin, PiniaPluginContext } from 'pinia'

export interface ModelInstallOptions {
  withMeta?: boolean
  hidden?: string[]
  visible?: string[]
}

export interface InstallOptions {
  model?: ModelInstallOptions
}

export type FilledInstallOptions = Required<InstallOptions>

/**
 * Install Pinia ORM to the store.
 */
export function createORM(options?: InstallOptions): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    context.store.$state.config = createOptions(options)
  }
}

/**
 * Create options by merging the given user-provided options.
 */
export function createOptions(options: InstallOptions = {}): FilledInstallOptions {
  return {
    model: {
      withMeta: options.model?.withMeta ?? false,
      hidden: options.model?.hidden ?? ['_meta'],
      visible: options.model?.visible ?? ['*'],
    },
  }
}
