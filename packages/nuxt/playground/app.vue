<template>
  <button
    type="button"
    @click="addToDo"
  >
    Add todo
  </button>
  <button @click="todo.flush()">
    Clear Todos
  </button>
  <pre>{{ all_todo_text }}</pre>
</template>

<script setup lang="ts">
import { useRepo } from 'pinia-orm'
import Todo from './models/ToDo'

const todo = useRepo(Todo)
const all_todo_text = computed(() => todo.all().map((t: Todo) => t.text))

const addToDo = () => {
  console.log('Adding')
  todo.insert({ text: 'Fix TS support', name: 'TS Todo' })
}
</script>
