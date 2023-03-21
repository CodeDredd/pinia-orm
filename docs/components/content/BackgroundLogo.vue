<template>
  <div class="w-full h-full hidden xl:block">
    <div class="flex items-center top-40 right-[24%] absolute justify-center z-[-20]">
      <div class="hero-background absolute blur-[72px] w-96 h-96 rounded-[50%]" />
      <div class="relative">
        <img height="220" width="220" src="/logo.svg">
      </div>
    </div>
    <div class="hero-background absolute bottom-0 blur-[72px] w-96 h-96 rounded-[50%]" />
  </div>
  <div class="w-full h-full xl:hidden">
    <div class="flex items-center top-16 right-[24%] absolute justify-center z-[-20]">
      <div class="hero-background absolute blur-[40px] w-32 h-32 rounded-[50%]" />
      <div class="relative">
        <img height="50" width="50" src="/logo.svg">
      </div>
    </div>
    <div class="hero-background absolute bottom-0 blur-[40px] w-32 h-32 rounded-[50%]" />
  </div>
</template>

<style lang="css">
.hero-background {
  background-image: linear-gradient(-45deg, #257866c6 50%, #0f93bfbb 50%);
}
</style>
