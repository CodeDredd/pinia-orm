import type { InstallOptions as IOptions, FilledInstallOptions as FOptions } from 'pinia-orm'
import { InstallConfig } from './config'

declare module 'pinia-orm' {
  export type InstallOptions = IOptions & InstallConfig
  export type FilledInstallOptions = FOptions & Required<InstallConfig>
}
