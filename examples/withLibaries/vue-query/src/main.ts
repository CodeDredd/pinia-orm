import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createORM } from 'pinia-orm'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(createORM())

app.use(pinia)

app.mount('#app')
