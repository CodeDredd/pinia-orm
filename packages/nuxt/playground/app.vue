<template>
  <button @click="todo.save({text:'Fix TS support', name:'TS Todo'})">Add todo</button>
  <button @click="todo.flush()">Clear Todos</button>
  <span>{{all_todo_text}}</span>
</template>

<script setup lang="ts">
import { useRepo } from 'pinia-orm'
import Todo from "./models/ToDo";

const todo = useRepo(Todo);
const all_todo_text = computed(() => todo.all().map((t: Todo) => t.text));

</script>
