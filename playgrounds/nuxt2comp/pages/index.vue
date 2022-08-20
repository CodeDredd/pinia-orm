<template>
  <Tutorial />
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useRepo } from 'pinia-orm'
import User from '~/models/User'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { $pinia } = useContext()
    const userRepo = useRepo(User, $pinia)
    userRepo.save([
      {
        id: 1,
        email: 'test@test.de',
        name: 'test',
        todos: [
          {
            id: 1,
            title: 'Hoho',
          },
          {
            id: 2,
            title: 'Blub',
          },
        ],
      },
    ])
    console.log(userRepo.with('todos').get())
  },
})
</script>
