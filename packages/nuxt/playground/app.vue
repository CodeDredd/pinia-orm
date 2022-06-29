<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup lang="ts">
import User from "./models/User"
import { useRepo } from 'pinia-orm'
const { pinia } = useNuxtApp()
//
// console.log(User)
const userRepo = useRepo(User)
const users = userRepo.save([{
  id: 1,
  email: 'test@test.de',
  name: 'test',
  todos: [
    {
      id: 1,
      title: 'Hoho'
    },
    {
      id: 2,
      title: 'Blub'
    }
  ]
}])
onMounted(() => {
  console.log('ToDos')
  console.log(userRepo.with('todos').get())
  userRepo.flush();
  console.log(userRepo.all());
})

// console.log(users)

// console.log('pinia', pinia.state.value)

</script>
