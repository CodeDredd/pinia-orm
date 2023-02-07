import { describe, expect, it } from 'vitest'
import { ref } from 'vue-demi'

import { Model, useRepo } from '../../src'

describe('performance/save_has_many_relation', () => {
  class Todo extends Model {
    static entity = 'todos'

    static fields() {
      return {
        id: this.uid(),
        title: this.string(''),
        description: this.string(''),
        done: this.boolean(false),
        points: this.number(0),
      }
    }
  }

  it('it finds data in decent time', () => {
    const recordsCount = 10000

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
    const generateString = (length: number) => {
      let result = ''
      const charactersLength = characters.length
      for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength))

      return result
    }

    const todoRepo = useRepo(Todo)
    const todoData = []
    const ormRequestTime = ref(0)
    const storeRequestTime = ref(0)

    for (let i = 1; i <= recordsCount; i++) {
      todoData.push({
        id: i,
        title: generateString(30),
        description: generateString(1000),
        done: false,
        points: 13,
      })
    }

    todoRepo.save(todoData)

    const makeOrmRequest = (id: number) => {
      const startTime = Date.now()
      console.log(todoRepo.find(id))
      ormRequestTime.value = Date.now() - startTime
    }

    const makeStoreRequest = (id: number) => {
      const startTime = Date.now()
      console.log(todoRepo.piniaStore().$state.data[id])
      storeRequestTime.value = Date.now() - startTime
    }

    const makeRequest = () => {
      const recordToFind = Math.floor(Math.random() * recordsCount)
      makeOrmRequest(recordToFind)
      makeStoreRequest(recordToFind)
    }

    makeRequest()
    console.log('Store:', storeRequestTime.value, 'ORM:', ormRequestTime.value)
    expect(storeRequestTime.value).toBeLessThan(ormRequestTime.value)
  })
})
