<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
const target = ref()
const props = defineProps<{
  width: number
  height: number
  disableScaling: boolean
}>()
const size = useElementSize(target)
const scale = computed(() => {
  if (props.disableScaling)
    return 'scale(1)'
  return `scale(${Math.min(size.width.value / props.width, size.height.value / props.height)})`
})
</script>

<template>
  <div
    ref="target"
    :style="{
      display: 'grid',
      placeItems: !disableScaling ? 'center' : 'unset',
      placeContent: !disableScaling ? 'center' : 'unset',
    }"
  >
    <div
      :style="{
        width: disableScaling ? '100%' : `${width}px`,
        height: disableScaling ? '100%' : `${height}px`,
        transform: scale,
        transformOrigin: 'center center',
      }"
    >
      <slot
        :width="width"
        :height="height"
        :scale="scale"
      />
    </div>
  </div>
</template>
