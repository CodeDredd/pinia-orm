<script setup lang="ts">
defineProps({
  cols: {
    type: [String, Number, Object],
    default: 3
  },
  gap: {
    type: [String, Object],
    default: () => ({
      initial: '{space.4}',
      '2xl': '{space.6}'
    })
  }
})
</script>

<template>
  <div class="card-grid">
    <ContentSlot :use="$slots.root" />

    <div class="card-grid-layout" :class='[`lg:grid-cols-${cols}`]'>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="ts">
css({
'.card-grid': {
'--gap': props => props.gap,
position: 'relative',
width: '100%',

'.card-grid-layout': {
  display: 'grid',
  gap: '{gap}',
  gridAutoRows: 'minmax({docus.landing.card.minHeight}, auto)',
  gridAutoFlow: 'dense',
},
}
})
</style>
