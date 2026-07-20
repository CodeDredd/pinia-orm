<script setup lang="ts">
interface DocsVersion {
  label: string
  href: string
  current?: boolean
}

const appConfig = useAppConfig() as { versions?: DocsVersion[] }

const versions = computed<DocsVersion[]>(() => appConfig.versions ?? [])

const current = computed(() => versions.value.find(version => version.current) ?? versions.value[0])

function onChange (event: Event) {
  const href = (event.target as HTMLSelectElement).value

  if (!href || href === current.value?.href) { return }

  window.location.href = href
}
</script>

<template>
  <label v-if="versions.length > 1" class="version-select">
    <span class="sr-only">Switch documentation version</span>
    <select :value="current?.href" @change="onChange">
      <option v-for="version in versions" :key="version.label" :value="version.href">
        {{ version.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.version-select select {
  appearance: none;
  background-color: transparent;
  border: 1px solid rgb(115 115 115 / 0.35);
  border-radius: 0.375rem;
  color: inherit;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.375rem 1.5rem 0.375rem 0.625rem;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.375rem center;
  background-repeat: no-repeat;
  background-size: 0.875rem;
}

.version-select select:hover {
  border-color: rgb(115 115 115 / 0.7);
}

.version-select .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
