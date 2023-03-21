<script setup lang="ts">
const { tree } = useDocus()
</script>

<template>
  <nav>
    <DocsAsideTree v-if="tree?.length > 0" :links="tree" />
    <NuxtLink v-else to="/" class="go-back-link">
      <Icon name="heroicons-outline:arrow-left" class="icon" />
      <span class="text">Go back</span>
    </NuxtLink>
    <h4 class='mb-4 mt-12'>Special supporters</h4>
    <a href='https://recordonce.com/' ><nuxt-img class='h-6' src="/logos/Record_Once_logo.svg" /></a>
  </nav>
</template>

<style scoped lang="ts">
css({
  '.go-back-link': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '{text.sm.fontSize}',
    lineHeight: '{text.sm.lineHeight}',
    cursor: 'pointer',
    color: '{color.gray.500}',
    '&:hover': {
      color: '{color.gray.700}',
    },
    '.icon': {
      width: '{space.4}',
      height: '{space.4}'
    },
    '.text': {
      marginLeft: '{space.2}'
    }
  }
})
</style>
