import { getActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'

describe('unit/PiniaORM', () => {
  it.skip('installs Vuex ORM to the store', () => {
    // @ts-expect-error I don't know
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
