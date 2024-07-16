import { createApp } from 'vue'
import App from './App.vue'

import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'

import { createPinia } from 'pinia'
import { createORM } from 'pinia-orm'
import { createPiniaOrmAxios } from '@pinia-orm/axios'
import axios from 'axios'

const app = createApp(App)

const pinia = createPinia()
const piniaOrm = createORM({
  plugins: [
    createPiniaOrmAxios({
      axios,
    }),
  ],
})

pinia.use(piniaOrm)

app.use(createVuestic())
app.use(pinia)
app.mount('#app')
