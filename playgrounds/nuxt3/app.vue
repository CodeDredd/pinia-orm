<template>
  <div>Nuxt module playground!</div>
</template>

<script setup>
import User from './models/User'
import { useRepo } from 'pinia-orm'

const userRepo = useRepo(User)
const users = userRepo.save([
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
</script>
