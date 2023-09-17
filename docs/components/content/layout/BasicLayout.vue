<template>
  <div class="basic-layout">
    <slot />
  </div>
</template>

<style lang="ts" scoped>
css({
'.basic-layout': {
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
}
})
</style>
<script setup lang='ts'>
</script>
