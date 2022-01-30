import { StoreActions } from 'pinia'
import { Elements } from '../data/Data'
import { State } from './State'

export interface Mutations<S extends State> extends StoreActions<any> {
  save(state: S, records: Elements): void
  insert(state: S, records: Elements): void
  update(state: S, records: Elements): void
  destroy(state: S, ids: string[]): void
  delete(state: S, ids: string[]): void
  flush(state: S): void
}

/**
 * Commit `save` change to the store.
 */
function save(state: State, records: Elements): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `insert` change to the store.
 */
function insert(state: State, records: Elements): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `fresh` change to the store.
 */
function fresh(state: State, records: Elements): void {
  state.data = records
}

/**
 * Commit `update` change to the store.
 */
function update(state: State, records: Elements): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `destroy` change to the store.
 */
function destroy(state: State, ids: string[]): void {
  const data: Elements = {}

  for (const id in state.data) {
    if (!ids.includes(id)) {
      data[id] = state.data[id]
    }
  }

  state.data = data
}

/**
 * Commit `delete` change to the store.
 */
function remove(state: State, ids: string[]): void {
  const data: Elements = {}

  for (const id in state.data) {
    if (!ids.includes(id)) {
      data[id] = state.data[id]
    }
  }

  state.data = data
}

/**
 * Commit `flush` change to the store.
 */
function flush(state: State): void {
  state.data = {}
}

export const mutations = {
  save,
  insert,
  fresh,
  update,
  destroy,
  delete: remove,
  flush,
}
