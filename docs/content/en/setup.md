---
title: Setup
description: 'The Pinia plugin to enable Object-Relational Mapping access to the Pinia Store.'
position: 1
category: Getting started
---

Check the [Nuxt.js documentation](https://nuxtjs.org/api/configuration-modules#the-modules-property) for more information about installing and using modules in Nuxt.js.

## Installation Vue 2 / 3

### Packages

Add `pinia-orm` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add pinia-orm
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm i --save pinia-orm
  ```

  </code-block>
</code-group>

### Adding plugin

<code-group>
  <code-block label="Vue3" active>

  ```js
  import { createPinia } from 'pinia'
  import PiniaORM from 'pinia-orm'

  const pinia = createPinia().use(PiniaORM.install())
  ```

  </code-block>
  <code-block label="Vue2">

  ```js
  import { createPinia, PiniaVuePlugin } from 'pinia'
  import PiniaORM from 'pinia-orm'

  Vue.use(PiniaVuePlugin)
  const pinia = createPinia().use(PiniaORM.install())
  ```

  </code-block>
</code-group>

## Installation Nuxt 2 / 3

### Packages

Add `pinia-orm` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add pinia-orm @pinia-orm/nuxt
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm i --save pinia-orm @pinia-orm/nuxt
  ```

  </code-block>
</code-group>

### Adding plugin

<code-group>
  <code-block label="Nuxt3" active>

  ```ts{}[nuxt.config.ts]
  import { defineNuxtConfig } from 'nuxt3'

  export default defineNuxtConfig({
    buildModules: ['@pinia/nuxt'],
    modules: ['@pinia-orm/nuxt'],
    // See https://github.com/nuxt/framework/issues/2371
    nitro: {
      externals: {
        inline: ['uuid'],
      },
    }
  })
  ```

  </code-block>
  <code-block label="Nuxt2">

  ```js{}[nuxt.config.js]
  export default {
    buildModules: [
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt'
    ],
    modules: ['@pinia-orm/nuxt'],
  }
  ```

  </code-block>
</code-group>
