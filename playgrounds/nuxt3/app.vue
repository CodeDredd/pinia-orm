<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup>
import User from "./models/User"
import { useRepo } from 'pinia-orm'
const { pinia } = useNuxtApp()
//
// console.log(User)
const userRepo = useRepo(User)
const users = await userRepo.save([{
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
  console.log(userRepo.with('todos').get())
})
</script>
