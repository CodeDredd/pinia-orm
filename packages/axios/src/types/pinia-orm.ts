import type { InstallOptions as IOptions, FilledInstallOptions as FOptions, ModelConfigOptions as MCOptions } from 'pinia-orm'
import { Config, InstallConfig } from './config'

declare module 'pinia-orm' {
  export type InstallOptions = IOptions & InstallConfig
  export type FilledInstallOptions = FOptions & Required<InstallConfig>
  export type ModelConfigOptions = MCOptions & { axios: Config }
}
