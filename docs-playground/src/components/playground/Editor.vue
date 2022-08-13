<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMonaco } from '~/logic/useMonaco'

const emit = defineEmits<(e: 'change', content: string) => void>()
const props = defineProps<{ language: string; value: string }>()

const target = ref()
const { onChange, setContent } = useMonaco(target, {
  language: props.language,
  code: props.value,
})

watch(() => props.value, () => setContent(props.value))
onChange(content => emit('change', content))
emit('change', props.value)
</script>

<template>
  <div ref="target" class="h-full w-full"></div>
</template>
