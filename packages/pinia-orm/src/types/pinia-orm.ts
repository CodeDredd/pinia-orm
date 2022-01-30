import { Database } from '../database/Database'
import 'pinia'

export interface PiniaOrmProperties {
  /**
   * The default database instance.
   */
  $database: Database

  /**
   * Mapping of databases keyed on connection
   */
  $databases: { [key: string]: Database }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    [s: string | number]: any
    /**
     * The default database instance.
     */
    $database: Database

    /**
     * Mapping of databases keyed on connection
     */
    $databases: { [key: string]: Database }
  }

  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    namespaced?: boolean
  }
}
