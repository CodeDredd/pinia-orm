# Setup Axios

This plugin gives you useful functions which is extending the `Repository`

## Install Pinia ORM Axios Plugin

::code-group
  ```bash [Yarn]
  yarn add @pinia-orm/axios
  ```
  ```bash [NPM]
  npm install @pinia-orm/axios --save
  ```
  ```bash [PNPM]
  pnpm add @pinia-orm/axios
  ```
::

## Adding the plugin to your pinia ORM store

::code-group
  ```js{}[Vue3]
  import { createPinia } from 'pinia'
  import { createORM } from 'pinia-orm'
  import axios form 'axios'

  const pinia = createPinia()
  const piniaOrm = createORM()
  piniaOrm().use(piniaOrmPluginAxios({
    axios
  }))
  pinia.use(piniaOrm)
  ```
  ```js{}[Vue2]
  import { createPinia, PiniaVuePlugin } from 'pinia'
  import { createORM } from 'pinia-orm'
  import axios form 'axios'

  Vue.use(PiniaVuePlugin)
  const pinia = createPinia()
  const piniaOrm = createORM()
  piniaOrm().use(piniaOrmPluginAxios({
    axios
  }))
  pinia.use(piniaOrm)
  ```
::


