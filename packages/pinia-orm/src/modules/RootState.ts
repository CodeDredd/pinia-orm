import type { State } from './State'

export interface RootState {
  [entity: string]: State
}
