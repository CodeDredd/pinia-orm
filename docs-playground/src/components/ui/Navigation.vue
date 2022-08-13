<script setup lang="ts">
import { defineProps } from 'vue'
import { useVModel, useClipboard, useEventListener } from '@vueuse/core'
import { isDark, toggleDark } from '~/logic/dark'
import { exportState } from '~/orchestrator'

const props = defineProps<{ modelValue: boolean }>()
const isOpen = useVModel(props)
const { copy } = useClipboard()

const share = () => {
  const state = exportState()
  window.location.hash = state
  return copy(window.location.href)
}

useEventListener('keydown', (ev) => {
  if (ev.ctrlKey && ev.code === 'KeyS' && !ev.shiftKey) {
    ev.preventDefault()
    share().then(() => alert('URL copied to clipboard'))
  }
})
</script>

<template>
  <div
    position="fixed left-0 top-0 bottom-0"
    p="y-4 x-2"
    w="18"
    flex="~ col"
    items="center"
    spcae="y-2"
  >
    <a href="https://pinia-orm.codedredd.de" alt="Pinia ORM - Documentation"><img src="/logo_pinia_orm.svg" class="w-12" /></a>
    <span class="flex-1"></span>
    <Button
      icon
      text="base"
      @click="toggleDark"
    >
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </Button>
    <Button
      icon
      text="base"
      @click="share()"
    >
      <carbon-share />
    </Button>
    <Button
      icon
      text="base"
      @click="isOpen = true"
    >
      <carbon-settings />
    </Button>
    <a href="https://github.com/CodeDredd/pinia-orm/tree/master/docs-playground" target="_blank">
      <Button
        icon
        text="base"
      >
        <mdi-github />
      </Button>
    </a>
  </div>
</template>
