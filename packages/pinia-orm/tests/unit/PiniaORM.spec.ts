import { getActivePinia } from 'pinia'
import { describe, it, expect } from 'vitest'

describe('unit/PiniaORM', () => {
  it.skip('installs Vuex ORM to the store', () => {
    // @ts-ignore
    const store = getActivePinia().state.value
    expect(store.$database.started).toBe(true)
  })

  // it.skip('can customize the namespace', () => {
  // const store = new Vuex.Store({
  //   plugins: [VuexORM.install({ namespace: 'database' })]
  // })
  //
  // const expected = {
  //   database: {}
  // }
  //
  // expect(store.state).toEqual(expected)
  // })
})
