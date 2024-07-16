<script setup>
import { VaCard } from 'vuestic-ui'

import { onMounted } from 'vue'

import { useAxiosRepo } from '@pinia-orm/axios'
import UserModel from './models/User'

onMounted(() => {
  console.log(useAxiosRepo(UserModel).api().fetchById(1))
})
</script>

<template>
  <VaCard>
    <VaCardTitle>Title</VaCardTitle>
    <VaCardContent> blabla </VaCardContent>
  </VaCard>
</template>
